import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"

// One-click logins. Judges and testers should not have to guess a password.
// Demo-only credentials: there is no backend, and these accounts are public.
const DEMO = [
  { label: "Student", identifier: "ved.hule@dypcoe.edu", password: "ved123", hint: "Ved Hule · Batch 2026" },
  { label: "Alumni", identifier: "rohan.j@dycoe.edu", password: "rohan123", hint: "Rohan Jadhav · Google" },
  { label: "TnP / Faculty", identifier: "amit.kulkarni@dycoe.edu", password: "tnp123", hint: "Placement dashboard" }
]

// Clears everything this app stores (session, posts, chats, drives, theme) and
// starts again from the seed data.
const resetDemoData = () => {
  if (!window.confirm("Reset all demo data in this browser to the seed data?")) return
  Object.keys(localStorage)
    .filter(k => k.startsWith("batchwise"))
    .forEach(k => localStorage.removeItem(k))
  window.location.reload()
}

export default function Login() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const attempt = (id, pw) => {
    if (login(id, pw)) {
      navigate("/", { replace: true })
    } else {
      setError("That PRN/email and password combination doesn't match an account.")
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setError("")
    if (!identifier.trim() || !password) {
      setError("Enter your PRN or email and your password.")
      return
    }
    attempt(identifier, password)
  }

  return (
    <main className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h2>🎓 BatchWise</h2>
          <p>Interview experiences, placement announcements and alumni advice — all from your own campus.</p>
          <ul className="login-points">
            <li>Ask your batch, hear from alumni who got the offer</li>
            <li>Company-wise interview threads</li>
            <li>Placement announcements that don't get lost in WhatsApp</li>
          </ul>
        </div>

        <form className="login-right" onSubmit={handleSubmit}>
          <h3>Log in</h3>

          <label htmlFor="identifier">PRN or email</label>
          <input
            id="identifier"
            autoComplete="username"
            placeholder="PRN2021001 or you@dycoe.edu"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary full">Log in</button>

          <div className="demo-logins">
            <span>Or try a demo account</span>
            <p className="demo-note">Demo accounts — data stays in your browser.</p>
            <div className="demo-buttons">
              {DEMO.map(d => (
                <button
                  key={d.label}
                  type="button"
                  className="demo-btn"
                  title={d.hint}
                  onClick={() => attempt(d.identifier, d.password)}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button type="button" className="demo-reset" onClick={resetDemoData}>
              Reset demo data
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
