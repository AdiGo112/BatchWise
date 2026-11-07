import { it, expect, afterEach } from 'vitest'
import { screen, fireEvent, within, cleanup } from '@testing-library/react'
import { renderApp } from './render.jsx'

afterEach(cleanup)

const postScore = (container) =>
  Number(container.querySelector('.post-detail-card .vote-score').textContent)

it('voting on a post moves the score, toggles off and switches sides', () => {
  const { container } = renderApp('/post/2')
  const card = within(container.querySelector('.post-detail-card'))
  const up = card.getByRole('button', { name: 'Upvote' })
  const down = card.getByRole('button', { name: 'Downvote' })
  // The seed data may already hold this user's upvote; start from no vote.
  if (up.getAttribute('aria-pressed') === 'true') fireEvent.click(up)
  const start = postScore(container)
  expect(up.getAttribute('aria-pressed')).toBe('false')

  fireEvent.click(up)
  expect(postScore(container)).toBe(start + 1)
  expect(up.getAttribute('aria-pressed')).toBe('true')

  fireEvent.click(up)
  expect(postScore(container)).toBe(start)

  fireEvent.click(up)
  fireEvent.click(down)
  expect(postScore(container)).toBe(start - 1)
  expect(up.getAttribute('aria-pressed')).toBe('false')
})

it('adding a comment shows it in the thread', () => {
  const { container } = renderApp('/post/2')
  fireEvent.change(screen.getByLabelText(/add a comment/i), { target: { value: 'Great writeup, thanks!' } })
  fireEvent.click(screen.getByRole('button', { name: 'Add Comment' }))
  const texts = [...container.querySelectorAll('.comment-text')].map(n => n.textContent)
  expect(texts).toContain('Great writeup, thanks!')
})

it('creating a post opens it', () => {
  renderApp('/create')
  const submit = screen.getByRole('button', { name: 'Post' })
  expect(submit.disabled).toBe(true)
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My TCS interview' } })
  fireEvent.change(screen.getByLabelText('Body'), { target: { value: 'Two rounds, both technical.' } })
  fireEvent.click(submit)
  expect(screen.getByRole('heading', { level: 1, name: 'My TCS interview' })).toBeTruthy()
  expect(screen.getByText('Two rounds, both technical.')).toBeTruthy()
})
