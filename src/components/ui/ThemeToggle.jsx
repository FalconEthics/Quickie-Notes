import { FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme, THEMES } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Determine which icon to show based on current theme
  const getIcon = () => {
    return theme === THEMES.DARK
      ? <FaMoon className="text-xl" />
      : <FaSun className="text-xl text-yellow-500" />;
  };

  // Get tooltip text based on current theme
  const getTooltipText = () => {
    return theme === THEMES.DARK
      ? 'Dark Mode (Click for Light Mode)'
      : 'Light Mode (Click for Dark Mode)';
  };

  return (
    <div className="relative group">
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-gray-100 dark:bg-[#393B41] text-gray-800 dark:text-gray-200 transition-colors duration-300"
        aria-label="Toggle dark mode"
      >
        {getIcon()}
      </motion.button>

      {/* Tooltip - positioned below the button */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 min-w-max">
        <span className="px-2 py-1 text-xs font-medium text-white bg-[#181818] dark:bg-[#393B41] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg block">
          {getTooltipText()}
        </span>
      </div>
    </div>
  );
}
