import { createContext, useContext, useState, useEffect } from 'react';

// Create theme context
const ThemeContext = createContext();

// Theme values
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export function ThemeProvider({ children }) {
  // Initialize theme state from localStorage
  const [theme, setTheme] = useState(() => {
    // Get saved theme or default to system
    return localStorage.getItem('theme') || THEMES.SYSTEM;
  });

  // Track the actual applied theme (light or dark)
  const [activeTheme, setActiveTheme] = useState(() => {
    // Initial value based on system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
    return THEMES.LIGHT;
  });

  // Apply the theme to the document
  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      setActiveTheme(THEMES.DARK);
    } else {
      document.documentElement.classList.remove('dark');
      setActiveTheme(THEMES.LIGHT);
    }
  };

  // Function to toggle between themes
  const toggleTheme = () => {
    const themeMap = {
      [THEMES.LIGHT]: THEMES.DARK,
      [THEMES.DARK]: THEMES.SYSTEM,
      [THEMES.SYSTEM]: THEMES.LIGHT
    };

    const newTheme = themeMap[theme];

    // Update state and localStorage
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme immediately if not system
    if (newTheme === THEMES.DARK) {
      applyTheme(true);
    } else if (newTheme === THEMES.LIGHT) {
      applyTheme(false);
    } else {
      // For system theme, check the system preference
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  };

  // Effect to apply theme changes
  useEffect(() => {
    const handleSystemThemeChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        applyTheme(e.matches);
      }
    };

    // Apply theme on mount and theme changes
    if (theme === THEMES.DARK) {
      applyTheme(true);
    } else if (theme === THEMES.LIGHT) {
      applyTheme(false);
    } else {
      // System theme - match OS preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(isDarkMode);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleSystemThemeChange);

      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      activeTheme,
      toggleTheme,
      isDarkMode: activeTheme === THEMES.DARK,
      isSystemTheme: theme === THEMES.SYSTEM
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
