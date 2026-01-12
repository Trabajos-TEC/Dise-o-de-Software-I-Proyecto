import React from 'react';
import { FaChartBar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import '../styles/components/buttons.css';

interface AnalyticsButtonProps {
  onClick?: () => void;
}

const AnalyticsButton: React.FC<AnalyticsButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/analytics');
    if (onClick) onClick();
  };

  return (
    <button
      className="analytics-btn"
      onClick={handleClick}
      title="Ver Estadísticas y Análisis"
      aria-label="Ver Estadísticas y Análisis"
    >
      <FaChartBar className="btn-icon" />
      <span className="btn-text">Analytics</span>
    </button>
  );
};

export default AnalyticsButton;