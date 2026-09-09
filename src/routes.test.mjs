// Renders every route through Vite's SSR loader to catch runtime errors a
// build cannot see: undefined context values, bad hooks, dead routes.
// Run: node src/routes.test.mjs
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'

import { fileURLToPath } from 'node:url'

// Project root, one level up from src/.
const root = fileURLToPath(new URL('..', import.meta.url))

// Minimal browser shims for modules that touch localStorage/matchMedia at import time.
const store = new Map()
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
  key: i => [...store.keys()][i],
  get length() { return store.size }
}
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
globalThis.document = { documentElement: { dataset: {} }, addEventListener() {}, removeEventListener() {} }
globalThis.window = { matchMedia: globalThis.matchMedia, addEventListener() {}, removeEventListener() {} }

const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })

const routes = [
  '/', '/post/2', '/post/4', '/communities', '/community/1', '/companies',
  '/company/1', '/resources', '/search?q=google', '/search?q=zzzznope',
  '/bookmarks', '/chats', '/announcements', '/create', '/profile',
  '/profile/4', '/settings', '/nope-404'
]

const { StaticRouter } = await vite.ssrLoadModule('react-router-dom/server.mjs')
  .catch(() => vite.ssrLoadModule('react-router-dom/dist/index.js'))

const { AuthProvider } = await vite.ssrLoadModule('/src/context/AuthContext.jsx')
const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
const { users } = await vite.ssrLoadModule('/src/data/Users.js')

let failures = 0

const render = (url, label, opts = {}) => {
  try {
    const html = renderToString(
      React.createElement(StaticRouter, { location: url },
        React.createElement(AuthProvider, null, React.createElement(App)))
    )
    // <Navigate> is a documented no-op under StaticRouter, so the anon redirect
    // legitimately renders empty here. It redirects normally in the browser.
    if (!opts.expectEmpty && (!html || html.length < 20)) {
      throw new Error('rendered almost nothing')
    }
    for (const needle of opts.contains ?? []) {
      if (!html.includes(needle)) throw new Error(`missing expected markup: ${needle}`)
    }
    console.log(`  ok   ${label} ${url}  (${html.length} bytes)`)
  } catch (err) {
    failures++
    console.log(`  FAIL ${label} ${url}\n       ${err.message}`)
  }
}

console.log('\n-- logged out (should redirect to /login) --')
render('/', 'anon', { expectEmpty: true })
render('/login', 'anon', { contains: ['demo-buttons'] })

console.log('\n-- student session --')
localStorage.setItem('batchwise_user', JSON.stringify({ id: users.find(u => u.accountType === 'student').id }))
for (const r of routes) render(r, 'student')

// Regressions the refactor was meant to fix.
console.log('\n-- specific regressions --')
render('/resources', 'sidebar-on-every-page', { contains: ['left-sidebar'] })
render('/post/2', 'seeded comments render', { contains: ['comment-text'] })
render('/post/2', 'real downvote button', { contains: ['vote-btn downvote'] })
render('/', 'trending panel not empty', { contains: ['trending-number'] })
render('/settings', 'settings is not a blank div', { contains: ['setting-row'] })
render('/profile', 'profile route exists', { contains: ['profile-stats'] })

console.log('\n-- tnp session --')
localStorage.setItem('batchwise_user', JSON.stringify({ id: users.find(u => u.accountType === 'tnp').id }))
render('/', 'tnp')

await vite.close()
console.log(failures ? `\n${failures} route(s) failed` : '\nAll routes rendered clean')
process.exit(failures ? 1 : 0)
