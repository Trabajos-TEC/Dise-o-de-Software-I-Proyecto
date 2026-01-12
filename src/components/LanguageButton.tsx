import React from 'react';
import { FaGlobe } from 'react-icons/fa6';
import { useLanguage } from '../context/LanguageContext';

interface LanguageButtonProps {
  onClick?: () => void;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({ onClick }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleToggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
    if (onClick) onClick();
  };

  return (
    <button 
      className="language-btn"
      onClick={handleToggleLanguage}
      aria-label={t('toggleLanguage')}
      title={t('toggleLanguage')}
    >
      <FaGlobe className="btn-icon" />
      <span className="btn-text">
        {language === 'en' ? 'ES' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageButton;