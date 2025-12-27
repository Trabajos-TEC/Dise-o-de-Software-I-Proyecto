import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const LanguageButton: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button 
      className="language-btn"
      onClick={toggleLanguage}
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