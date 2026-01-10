// src/components/AnalyticsButton.tsx
import React from 'react';
import { FaChartBar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import '../styles/components/buttons.css';

const AnalyticsButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      className="analytics-btn"
      onClick={() => navigate('/analytics')}
      title="Ver Estadísticas y Análisis"
      aria-label="Ver Estadísticas y Análisis"
    >
      <FaChartBar className="btn-icon" />
      <span className="btn-text">Analytics</span>
    </button>
  );
};

export default AnalyticsButton;
