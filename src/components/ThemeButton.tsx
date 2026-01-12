import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';

interface ThemeButtonProps {
  onClick?: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ onClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
    if (onClick) onClick();
  };

  return (
    <button 
      className="theme-btn"
      onClick={handleClick}
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