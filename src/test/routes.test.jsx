import { it, expect, afterEach } from 'vitest'
import { screen, cleanup } from '@testing-library/react'
import { renderApp } from './render.jsx'

afterEach(cleanup)

const routes = [
  '/', '/post/2', '/post/4', '/communities', '/community/1', '/companies',
  '/company/1', '/resources', '/search?q=google', '/search?q=zzzznope',
  '/bookmarks', '/chats', '/announcements', '/create', '/profile',
  '/profile/4', '/settings', '/nope-404'
]

it.each(routes)('a student can open %s', (url) => {
  const { container } = renderApp(url)
  expect(container.querySelector('.left-sidebar')).not.toBeNull()
  expect(container.querySelector('.content').textContent.length).toBeGreaterThan(20)
})

it('signed-out visitors land on login with demo accounts and a reset', () => {
  const { container } = renderApp('/', null)
  expect(container.querySelector('.demo-buttons')).not.toBeNull()
  expect(screen.getByRole('button', { name: /reset demo data/i })).toBeTruthy()
})

it.each([
  ['/post/2', '.comment-text', 'seeded comments render'],
  ['/post/2', '.vote-btn.downvote', 'a real downvote button'],
  ['/', '.trending-number', 'the trending panel is not empty'],
  ['/settings', '.setting-row', 'settings is not a blank page'],
  ['/profile', '.profile-stats', 'the profile route exists'],
])('%s: %s (%s)', (url, selector) => {
  expect(renderApp(url).container.querySelector(selector)).not.toBeNull()
})

it('TnP accounts get the placement dashboard', () => {
  renderApp('/', 'tnp')
  expect(screen.getByRole('heading', { name: /training & placement/i })).toBeTruthy()
})
