import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSwitcher: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        padding: '8px 16px',
        borderRadius: '50px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        cursor: 'pointer',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {isDarkMode ? (
        <>
          <FaSun /> Day
        </>
      ) : (
        <>
          <FaMoon /> Night
        </>
      )}
    </button>
  );
};

export default ThemeSwitcher;