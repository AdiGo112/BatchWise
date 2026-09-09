import { useState } from 'react'

const KEY = 'batchwise:theme'

// Honour the OS preference the first time, then remember the explicit choice.
export const readTheme = () => {
  try {
    return (
      localStorage.getItem(KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
  } catch {
    return 'light'
  }
}

export const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Private mode. The theme still applies for this session.
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(readTheme)

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return [theme, toggle]
}
