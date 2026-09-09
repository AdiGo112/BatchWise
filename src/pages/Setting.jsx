import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApp } from '../context/AppContext'
import { useTheme } from '../theme'

// Was an empty <div>. The navbar linked here, so "Settings" opened a blank page.
const Settings = () => {
  const [theme, toggleTheme] = useTheme()
  const { user, logout } = useAuth()
  const { posts, bookmarkedPosts, joinedCommunities } = useApp()
  const navigate = useNavigate()

  const resetDemo = () => {
    if (!window.confirm('Reset posts, bookmarks and communities to the seed data?')) return
    Object.keys(localStorage)
      .filter(k => k.startsWith(`batchwise:${user.id}:`))
      .forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Signed in as {user.email}</p>
      </div>

      <div className="card settings-card">
        <div className="setting-row">
          <div>
            <strong>Appearance</strong>
            <p className="muted">Currently using {theme} mode.</p>
          </div>
          <button className="btn-ghost" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'light' : 'dark'}
          </button>
        </div>

        <div className="setting-row">
          <div>
            <strong>Your data</strong>
            <p className="muted">
              {posts.length} posts · {bookmarkedPosts.length} bookmarks ·{' '}
              {joinedCommunities.length} communities, saved in this browser.
            </p>
          </div>
          <button className="btn-ghost danger" onClick={resetDemo}>Reset demo data</button>
        </div>

        <div className="setting-row">
          <div>
            <strong>Session</strong>
            <p className="muted">Log out on this device.</p>
          </div>
          <button
            className="btn-ghost danger"
            onClick={() => { logout(); navigate('/login') }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
