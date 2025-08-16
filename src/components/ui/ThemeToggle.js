import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out group"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon (Light Mode) */}
      <Sun 
        className={`h-5 w-5 text-yellow-500 transition-all duration-300 ${
          isDarkMode 
            ? 'opacity-0 rotate-90 scale-0' 
            : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      
      {/* Moon Icon (Dark Mode) */}
      <Moon 
        className={`absolute top-2 left-2 h-5 w-5 text-blue-400 transition-all duration-300 ${
          isDarkMode 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-0'
        }`}
      />
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDarkMode 
          ? 'bg-blue-500/20 shadow-lg shadow-blue-500/25' 
          : 'bg-yellow-500/20 shadow-lg shadow-yellow-500/25'
      }`} />
      
      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default ThemeToggle;
