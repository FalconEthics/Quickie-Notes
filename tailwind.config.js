/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Custom colors with dark mode variants
        background: {
          light: '#ffffff',
          dark: '#121212',
        },
        surface: {
          light: '#f5f5f5',
          dark: '#1e1e1e',
        },
        text: {
          light: '#333333',
          dark: '#e0e0e0',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'fadeOut': 'fadeOut 0.5s ease-in-out',
        'slideIn': 'slideIn 0.4s ease-out',
        'slideOut': 'slideOut 0.4s ease-in',
        'expandDown': 'expandDown 0.3s ease-out',
        'collapseUp': 'collapseUp 0.3s ease-in',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'pageTransition': 'pageTransition 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' },
        },
        expandDown: {
          '0%': { maxHeight: '0', opacity: '0' },
          '100%': { maxHeight: '500px', opacity: '1' },
        },
        collapseUp: {
          '0%': { maxHeight: '500px', opacity: '1' },
          '100%': { maxHeight: '0', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pageTransition: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      }
    },
  },
  plugins: [],
}
