import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext.jsx"
import Login from "./pages/Login"
import Layout from "./components/Layout"
import TnpDashboard from "./pages/tnp/TnpDashboard"

export default function App() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Remember where they were headed so login can send them back. */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route
        path="/*"
        element={user.accountType === "tnp" ? <TnpDashboard /> : <Layout />}
      />
    </Routes>
  )
}
