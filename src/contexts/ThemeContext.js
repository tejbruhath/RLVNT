import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Force dark mode always
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Always apply dark theme
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', JSON.stringify(true));
  }, []);

  // Disable theme toggle - always dark
  const toggleTheme = () => {
    // Do nothing - dark mode only
  };

  const value = {
    isDarkMode: true, // Always true
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
