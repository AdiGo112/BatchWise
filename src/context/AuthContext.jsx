import { createContext, useContext, useEffect, useState } from "react"
import { users } from "../data/Users"

const AuthContext = createContext()

const SESSION_KEY = "batchwise_user"

export function AuthProvider({ children }) {
  // Read synchronously so a refresh doesn't flash the login screen before the
  // effect runs. The old version started at null and redirected you to /login
  // for one frame on every reload.
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (!stored) return null
      // Re-resolve against the directory so a stale session can't carry an old
      // user shape, and so profile edits show up after a refresh.
      const { id } = JSON.parse(stored)
      return users.find(u => u.id === id) ?? null
    } catch {
      return null
    }
  })

  // Keep the tab in sync if you log in or out in another tab.
  useEffect(() => {
    const sync = (e) => {
      if (e.key !== SESSION_KEY) return
      setUser(e.newValue ? users.find(u => u.id === JSON.parse(e.newValue).id) ?? null : null)
    }
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [])

  const login = (identifier, password) => {
    const id = identifier.trim().toLowerCase()
    const found = users.find(
      u => (u.email.toLowerCase() === id || u.prn?.toLowerCase() === id) && u.password === password
    )
    if (!found) return false

    setUser(found)
    // Store only the id. The previous version wrote the whole record --
    // password included -- into localStorage.
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id }))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
