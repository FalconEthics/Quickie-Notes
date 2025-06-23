import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme, THEMES } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Determine which icon to show based on current theme
  const getIcon = () => {
    switch (theme) {
      case THEMES.DARK:
        return <FaMoon className="text-xl" />;
      case THEMES.LIGHT:
        return <FaSun className="text-xl text-yellow-500" />;
      default: // SYSTEM
        return <FaDesktop className="text-xl" />;
    }
  };

  // Get tooltip text based on current theme
  const getTooltipText = () => {
    switch (theme) {
      case THEMES.DARK:
        return 'Dark Mode (Click for Light)';
      case THEMES.LIGHT:
        return 'Light Mode (Click for System)';
      default: // SYSTEM
        return 'System Theme (Click for Dark)';
    }
  };

  return (
    <div className="relative group">
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
        aria-label="Toggle dark mode"
      >
        {getIcon()}
      </motion.button>

      {/* Tooltip - positioned below the button instead of above */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 min-w-max">
        <span className="px-2 py-1 text-xs font-medium text-white bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg block">
          {getTooltipText()}
        </span>
      </div>
    </div>
  );
}
