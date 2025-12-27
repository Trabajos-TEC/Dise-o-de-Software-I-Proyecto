/*PRINCIPAL */
import { FaCloud, FaStar } from 'react-icons/fa';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import LanguageButton from './components/LanguageButton';
import ThemeButton from './components/ThemeButton';

import "./index.css";
import "./styles/theme-light.css";
import "./styles/theme-dark.css";
import "./styles/components/header.css";
import "./styles/components/buttons.css";
import "./styles/components/layout.css";  // ← IMPORTANTE: AÑADE ESTA LÍNEA

function App() {
  const { language, t } = useLanguage();
  const { isDarkMode } = useTheme();

  return (
    <div className="simpsons-app">
      {/* BARRA SUPERIOR */}
      <header className="app-header">
        <div className="header-left">
          {isDarkMode ? <FaStar className="header-icon" /> : <FaCloud className="header-icon" />}
          <span className="header-title">{t('simpsonsTheme')}</span>
        </div>
        
        <div className="header-right">
          <LanguageButton />
          <span className="separator">|</span>
          <ThemeButton />
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="app-main">
        <div className="hero-section">
          <h1 className="app-title">{t('appTitle')}</h1>
          <p className="app-subtitle">{t('welcomeMessage')}</p>
          
          <div className="current-status">
            <div className="status-item">
              <span className="status-label">{t('currentLanguage')}:</span>
              <span className="status-value">
                {language === 'en' ? 'English 🇺🇸' : 'Español 🇪🇸'}
              </span>
            </div>
            
            <div className="status-item">
              <span className="status-label">{t('currentTheme')}:</span>
              <span className="status-value">
                {isDarkMode ? '🌙 ' + t('darkMode') : '☀️ ' + t('lightMode')}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p className="footer-text">{t('footerNote')}</p>
        <p className="footer-subtext">{t('projectFor')}</p>
      </footer>
    </div>
  );
}

export default App;