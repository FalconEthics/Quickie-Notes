import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Theme } from '../types'
import type { ThemeContextType } from '../types'

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme state from localStorage (default to light)
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === Theme.DARK ? Theme.DARK : Theme.LIGHT
  })

  // Apply the theme to the document - defined with useCallback to maintain reference
  const applyTheme = useCallback((isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Function to toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT

    // Update state and localStorage
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

    // Apply theme immediately
    applyTheme(newTheme === Theme.DARK)
  }, [theme, applyTheme])

  // Effect to apply theme changes - runs on mount and when theme changes
  useEffect(() => {
    // Apply theme based on current state
    applyTheme(theme === Theme.DARK)
  }, [theme, applyTheme])

  // Also apply theme immediately on initial render
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === Theme.DARK
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDarkMode: theme === Theme.DARK
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook for using the theme
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
