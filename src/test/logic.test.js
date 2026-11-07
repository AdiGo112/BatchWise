import { describe, it, expect, vi, afterEach } from 'vitest'
import { applyVote, score, sortPosts } from '../context/AppContext.jsx'

const post = (over = {}) => ({ upvotes: [], downvotes: [], isPinned: false, ...over })

describe('applyVote', () => {
  it('toggles an upvote, moves a vote between sides, never stacks', () => {
    let p = applyVote(post(), 1, 1)
    expect(p.upvotes).toEqual([1])
    expect(score(p)).toBe(1)

    p = applyVote(p, 1, 1)
    expect(score(p)).toBe(0) // a second click removes it

    p = applyVote(p, 1, -1)
    expect(p.downvotes).toEqual([1])
    expect(score(p)).toBe(-1) // a downvote lowers the score

    p = applyVote(p, 1, 1)
    expect(p.upvotes).toEqual([1])
    expect(p.downvotes).toEqual([]) // switching sides clears the other one
  })

  it('only removes the voter’s own vote', () => {
    expect(applyVote(post({ upvotes: [2, 3] }), 2, 1).upvotes).toEqual([3])
  })
})

describe('sortPosts', () => {
  const now = Date.parse('2026-09-09T12:00:00Z')
  const hoursAgo = (h) => new Date(now - h * 36e5).toISOString()
  const fresh = post({ id: 'fresh', upvotes: [1, 2, 3, 4, 5], createdAt: hoursAgo(2) })
  const stale = post({ id: 'stale', upvotes: Array.from({ length: 20 }, (_, i) => i), createdAt: hoursAgo(200) })
  const pinned = post({ id: 'pin', createdAt: hoursAgo(500), isPinned: true })

  afterEach(() => vi.useRealTimers())

  it('hot favours recent posts, top favours score, new favours age', () => {
    vi.useFakeTimers({ now })
    expect(sortPosts([stale, fresh], 'hot')[0].id).toBe('fresh')
    expect(sortPosts([fresh, stale], 'top')[0].id).toBe('stale')
    expect(sortPosts([stale, fresh], 'new')[0].id).toBe('fresh')
  })

  it.each(['hot', 'new', 'top'])('pinned floats to the top in %s', (mode) => {
    vi.useFakeTimers({ now })
    expect(sortPosts([fresh, stale, pinned], mode)[0].id).toBe('pin')
  })
})
