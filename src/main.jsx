import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { applyTheme, readTheme } from "./theme"

import "./styles/Styles.css"
import "./styles/Shell.css"

// Set before first paint so there is no light-mode flash on a dark-mode reload.
applyTheme(readTheme())

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
