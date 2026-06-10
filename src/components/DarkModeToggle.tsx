// Cyber Terminal — Dark Mode Toggle
// Animated sun/moon icon transition.

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const DarkModeToggle: React.FC = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-accent-gold dark:hover:text-accent-gold transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;