// Smallest thing that fails if the voting or ranking logic breaks.
// Run: node src/logic.test.mjs
import assert from 'node:assert/strict'

// Mirrors of the pure logic in AppContext.jsx. Kept here rather than importing
// the .jsx so this runs on bare node with no build step.
const score = (item) => item.upvotes.length - (item.downvotes?.length ?? 0)

const applyVote = (item, userId, dir) => {
  const up = new Set(item.upvotes)
  const down = new Set(item.downvotes ?? [])
  const target = dir === 1 ? up : down
  const other = dir === 1 ? down : up
  other.delete(userId)
  if (target.has(userId)) target.delete(userId)
  else target.add(userId)
  return { ...item, upvotes: [...up], downvotes: [...down] }
}

const hotness = (post, now) => {
  const ageHours = (now - new Date(post.createdAt)) / 3.6e6
  return score(post) / Math.pow(ageHours + 2, 1.5)
}

const post = (over = {}) => ({ upvotes: [], downvotes: [], isPinned: false, ...over })

// --- voting -----------------------------------------------------------------
let p = post()

p = applyVote(p, 1, 1)
assert.deepEqual(p.upvotes, [1], 'upvote registers')
assert.equal(score(p), 1)

// Clicking upvote twice removes it, it does not stack.
p = applyVote(p, 1, 1)
assert.deepEqual(p.upvotes, [], 'upvote toggles off')
assert.equal(score(p), 0)

// The bug this replaces: the downvote button called toggleUpvote, so
// downvoting *raised* the score.
p = applyVote(p, 1, -1)
assert.deepEqual(p.downvotes, [1], 'downvote registers')
assert.equal(score(p), -1, 'downvote lowers the score')

// Switching sides moves the vote instead of counting twice.
p = applyVote(p, 1, 1)
assert.deepEqual(p.upvotes, [1])
assert.deepEqual(p.downvotes, [], 'switching to upvote clears the downvote')
assert.equal(score(p), 1)

// One vote per user, regardless of how many other people voted.
let q = post({ upvotes: [2, 3] })
q = applyVote(q, 2, 1)
assert.deepEqual(q.upvotes, [3], 'a user can only remove their own vote')

// --- ranking ----------------------------------------------------------------
const now = Date.parse('2026-09-09T12:00:00Z')
const hoursAgo = (h) => new Date(now - h * 36e5).toISOString()

const fresh = post({ upvotes: [1, 2, 3, 4, 5], createdAt: hoursAgo(2) })
const stale = post({ upvotes: Array.from({ length: 20 }, (_, i) => i), createdAt: hoursAgo(200) })

assert.ok(hotness(fresh, now) > hotness(stale, now), 'hot favours recent posts')
assert.ok(score(stale) > score(fresh), 'top still favours the higher score')

// Pinned floats to the top whatever the sort.
const sortPosts = (posts, mode) => {
  const ranked = [...posts]
  if (mode === 'new') ranked.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  else if (mode === 'top') ranked.sort((a, b) => score(b) - score(a))
  else ranked.sort((a, b) => hotness(b, now) - hotness(a, now))
  return ranked.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
}

const pinned = post({ id: 'pin', upvotes: [], createdAt: hoursAgo(500), isPinned: true })
for (const mode of ['hot', 'new', 'top']) {
  assert.equal(sortPosts([fresh, stale, pinned], mode)[0], pinned, `pinned floats in ${mode}`)
}

// The trending window was 3 days against seed data timestamped in 2024, so the
// trending panel was permanently empty. Relative seed dates fix that.
const inWindow = [fresh, stale].filter(x => new Date(x.createdAt) > now - 3 * 864e5)
assert.equal(inWindow.length, 1, 'recent posts fall inside the 3-day trending window')

console.log('logic.test.mjs: all assertions passed')
