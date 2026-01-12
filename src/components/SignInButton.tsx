// components/SignInButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SignInButtonProps {
  onClick?: () => void;
}

const SignInButton: React.FC<SignInButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
    if (onClick) onClick();
  };

  return (
    <button
      className="sign-in-btn btn-has-both"
      onClick={handleClick}
    >
      <i className="btn-icon">👤</i> {/* Icono de usuario */}
      <span className="btn-text">Sign In</span>
    </button>
  );
};

export default SignInButton;