// src/components/ThemeButton.tsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';

const ThemeButton: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-btn"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <>
          <FaSun className="btn-icon" />
          <span className="btn-text">Light</span>
        </>
      ) : (
        <>
          <FaMoon className="btn-icon" />
          <span className="btn-text">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeButton;