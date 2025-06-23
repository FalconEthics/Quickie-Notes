import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create theme context
const ThemeContext = createContext();

// Theme values
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export function ThemeProvider({ children }) {
  // Initialize theme state from localStorage (default to light)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;
  });

  // Apply the theme to the document - defined with useCallback to maintain reference
  const applyTheme = useCallback((isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Function to toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

    // Update state and localStorage
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme immediately
    applyTheme(newTheme === THEMES.DARK);
  }, [theme, applyTheme]);

  // Effect to apply theme changes - runs on mount and when theme changes
  useEffect(() => {
    // Apply theme based on current state
    applyTheme(theme === THEMES.DARK);
  }, [theme, applyTheme]);

  // Also apply theme immediately on initial render
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === THEMES.DARK;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      isDarkMode: theme === THEMES.DARK
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using the theme
export function useTheme() {
  return useContext(ThemeContext);
}
