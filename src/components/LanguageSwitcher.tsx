import React from 'react';
import { useLanguage } from "../context/LanguageContext";
import { getAvailableLanguages } from '../i18n';
import { FaGlobeAmericas } from 'react-icons/fa';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const languages = getAvailableLanguages();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  const selectLanguage = (langCode: string) => {
    setLanguage(langCode as any);
  };

  return (
    <div className="language-switcher">
      <div className="language-dropdown">
        <button
          className="language-button"
          onClick={toggleLanguage}
          title={t('toggleLanguage')}
          aria-label={t('toggleLanguage')}
        >
          <FaGlobeAmericas />
          <span className="language-code">
            {language.toUpperCase()}
          </span>
        </button>
        
        <div className="language-dropdown-content">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => selectLanguage(lang.code)}
              aria-label={`Switch to ${lang.name}`}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {language === lang.code && (
                <span className="language-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="current-language">
        {languages.find(l => l.code === language)?.flag}
      </div>
    </div>
  );
};

export default LanguageSwitcher;