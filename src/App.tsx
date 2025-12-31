/*PRINCIPAL */
import { useState, FormEvent, ChangeEvent } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import LanguageButton from './components/LanguageButton';
import ThemeButton from './components/ThemeButton';

import "./index.css";
import "./styles/theme-light.css";
import "./styles/theme-dark.css";
import "./styles/components/header.css";
import "./styles/components/buttons.css";
import "./styles/components/layout.css"; 

function App() {
  const { language, t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Aquí puedes implementar la lógica de búsqueda
      console.log('Buscando:', searchQuery);
      alert(`${t('searchingFor')}: ${searchQuery}`);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="simpsons-app">
      <header className="app-header">
        <div className="header-left">
          <button 
            className="logo-button"
            onClick={handleLogoClick}
            aria-label="Volver al inicio"
          >
            <img 
              src="/logo.png" 
              alt="The Simpsons Logo" 
              className="header-logo"
            />
          </button>
        </div>
        
        {/* Barra de búsqueda en el centro */}
        <div className="header-center">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Buscar"
              />
              <button 
                type="submit" 
                className="search-button"
                aria-label="Buscar"
              >
                <span className="search-icon">⌕</span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="header-right">
          <LanguageButton />
          <span className="separator">|</span>
          <ThemeButton />
        </div>
      </header>

      <main className="app-main">
        {/* Primer cuadro - igual que hero-section */}
        <div className="hero-section first-hero">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="The Simpsons Logo" 
              className="main-logo"
            />
          </div>
          
          <div className="welcome-message">
            <p className="welcome-text">
              {t('welcomeMessage')}
            </p>
          </div>
          
          <div className="status-container">
            <div className="status-card">
              <div className="status-item">
                <span className="status-label">{t('currentLanguage')}:</span>
                <span className="status-value">
                  {language === 'en' ? 'English 🇺🇸' : 'Español 🇪🇸'}
                </span>
              </div>
              
              <div className="status-item">
                <span className="status-label">{t('currentTheme')}:</span>
                <span className="status-value">
                  {isDarkMode ? t('darkMode') : t('lightMode')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Segundo cuadro - IGUAL que hero-section pero con contenido diferente */}
        <div className="hero-section coming-soon-section">
          <div className="coming-soon-content">
            <h2 className="coming-soon-title">
              {t('comingSoon')}
            </h2>
            <p className="coming-soon-text">
              {t('comingSoonDescription')}
            </p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p className="footer-text">{t('footerNote')}</p>
        <p className="footer-subtext">{t('projectFor')}</p>
      </footer>
    </div>
  );
}

export default App;