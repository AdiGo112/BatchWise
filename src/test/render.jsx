import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import App from '../App.jsx'
import { users } from '../data/Users.js'

Element.prototype.scrollIntoView ??= () => {} // jsdom has no layout
window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {} })

// Renders the whole app at `url`, signed in as the first user of `accountType`,
// or signed out when it is null. Each call starts from clean storage.
export function renderApp(url, accountType = 'student') {
  localStorage.clear()
  if (accountType) {
    const id = users.find(u => u.accountType === accountType).id
    localStorage.setItem('batchwise_user', JSON.stringify({ id }))
  }
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AuthProvider><App /></AuthProvider>
    </MemoryRouter>
  )
}
