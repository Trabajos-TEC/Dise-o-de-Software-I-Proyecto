// src/components/Footer.tsx
// Componente Footer reutilizable que adapta su estilo según el tema actual (La parte de abajoo del App)

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/components/layout.css';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  return (
    <footer className={`app-footer ${isDarkMode ? 'dark' : 'light'}`}>
      <p className="footer-text">{t('footerNote')}</p>
      <p className="footer-subtext">{t('projectFor')}</p>
    </footer>
  );
};

export default Footer;