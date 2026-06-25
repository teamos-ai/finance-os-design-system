import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'dark' | 'light' | 'paper'
export const THEMES: Theme[] = ['light', 'paper', 'dark']
export const THEME_LABELS: Record<Theme, string> = {
  dark: 'Dark · OLED',
  light: 'Light · Clarity',
  paper: 'Paper',
}
const STORAGE_KEY = 'fos-theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  cycle: () => void
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitial(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored && THEMES.includes(stored)) return stored
  } catch {
    /* localStorage unavailable */
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    // Theme-aware favicon: blue mark in light mode, amber otherwise.
    const fav = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
    if (fav) fav.href = theme === 'light' ? '/logo-square-blue.png' : '/favicon.png'
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeState,
    cycle: () => setThemeState((p) => THEMES[(THEMES.indexOf(p) + 1) % THEMES.length]),
    themes: THEMES,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
