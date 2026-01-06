// App.tsx - Versión simplificada
import Login from "./login";
import { useState, useRef, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import LanguageButton from './components/LanguageButton';
import ThemeButton from './components/ThemeButton';
import Card from './components/Card';
import type { CardData } from './components/Card';
import SearchResults from './SearchResults';
import { useNavigate } from "react-router-dom";
import { 
  getInitialCardReferences,
  loadCardData,
  groupCardsByType,
  searchCards,
  type SearchResult
} from './components/cardUtils';

import "./index.css";
import "./styles/theme-light.css";
import "./styles/theme-dark.css";
import "./styles/components/header.css";
import "./styles/components/buttons.css";
import "./styles/components/layout.css";
import "./styles/components/Card.css";

function App() {
  const navigate = useNavigate();

  const { language, t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [initialCards, setInitialCards] = useState<CardData[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [showSearchPage, setShowSearchPage] = useState(false); // Para mostrar página de resultados
  
  const charactersRef = useRef<HTMLDivElement>(null);
  const episodesRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);

  // Estado para controlar el desplazamiento circular
  const [scrollPositions, setScrollPositions] = useState({
    characters: 0,
    episodes: 0,
    locations: 0
  });

  useEffect(() => {
    const loadInitialCards = async () => {
      setLoadingInitial(true);
      try {
        const cardRefs = getInitialCardReferences();
        const cardPromises = cardRefs.map(ref => loadCardData(ref.id, ref.type));
        const cards = await Promise.all(cardPromises);
        const validCards = cards.filter((card): card is CardData => card !== null);
        setInitialCards(validCards);
      } catch (error) {
        console.error('Error loading initial cards:', error);
      } finally {
        setLoadingInitial(false);
      }
    };
    
    loadInitialCards();
  }, []);

  const groupedInitialCards = groupCardsByType(initialCards);

  const handleLogoClick = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowSearchPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    setIsSearching(true);
    try {
      const results = await searchCards(trimmedQuery);
      setSearchResults(results);
      setShowSearchPage(true); // Ir a la página de resultados
    } catch (error) {
      console.error('Error searching:', error);
      alert(`${t('searchingFor')}: "${searchQuery}" - Error.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults(null);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowSearchPage(false);
  };

  const handleNewSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowSearchPage(false);
  };

  // Función para desplazar a la izquierda (circular)
  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>, section: keyof typeof scrollPositions) => {
    if (!ref.current) return;
    
    const container = ref.current;
    const cardWidth = 280 + 30;
    const visibleCards = Math.floor(container.clientWidth / cardWidth);
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let newPosition = scrollPositions[section] - (visibleCards * cardWidth);
    
    if (newPosition < 0) {
      newPosition = maxScroll;
    }
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPositions(prev => ({
      ...prev,
      [section]: newPosition
    }));
  };

  // Función para desplazar a la derecha (circular)
  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>, section: keyof typeof scrollPositions) => {
    if (!ref.current) return;
    
    const container = ref.current;
    const cardWidth = 280 + 30;
    const visibleCards = Math.floor(container.clientWidth / cardWidth);
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let newPosition = scrollPositions[section] + (visibleCards * cardWidth);
    
    if (newPosition > maxScroll) {
      newPosition = 0;
    }
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPositions(prev => ({
      ...prev,
      [section]: newPosition
    }));
  };

  // Actualizar posición del scroll cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setScrollPositions({
        characters: 0,
        episodes: 0,
        locations: 0
      });
      
      [charactersRef, episodesRef, locationsRef].forEach(ref => {
        if (ref.current) {
          ref.current.scrollTo({ left: 0, behavior: 'instant' });
        }
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasSearchResults = searchResults && searchQuery.trim().length > 0;
  
  const charactersToShow = hasSearchResults ? searchResults!.characters : groupedInitialCards.character;
  const episodesToShow = hasSearchResults ? searchResults!.episodes : groupedInitialCards.episode;
  const locationsToShow = hasSearchResults ? searchResults!.locations : groupedInitialCards.location;

  const renderCardSection = (
    sectionType: 'character' | 'episode' | 'location',
    cards: CardData[],
    ref: React.RefObject<HTMLDivElement | null>,
    sectionTitle: string
  ) => {
    const hasCards = cards.length > 0;
    const isLoading = loadingInitial && !hasSearchResults;
    const sectionKey = sectionType === 'character' ? 'characters' : 
                       sectionType === 'episode' ? 'episodes' : 'locations';
    
    return (
      <div className={`cards-section ${sectionType}-section`}>
        <div className="section-header">
          <h2 className="section-title">
            {sectionTitle}
          </h2>
          {hasSearchResults && (
            <div className="search-match-badge">
              {cards.length === 0 ? '0 resultados' : `${cards.length} encontrados`}
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            Cargando {sectionTitle.toLowerCase()}...
          </div>
        ) : hasCards ? (
          <div className="carousel-container">
            <button 
              className="carousel-button left" 
              onClick={() => scrollLeft(ref, sectionKey)}
              aria-label="Cartas anteriores"
            >
              ◀
            </button>
            <div className="cards-carousel" ref={ref}>
              {cards.map(card => (
                <Card 
                  key={`${sectionType}-${card.id}-${card.name}`} 
                  data={card} 
                  size="medium" 
                  flipOnHover={true} 
                />
              ))}
            </div>
            <button 
              className="carousel-button right" 
              onClick={() => scrollRight(ref, sectionKey)}
              aria-label="Siguientes cartas"
            >
              ▶
            </button>
          </div>
        ) : (
          <div className="no-data-message">
            {hasSearchResults 
              ? `No se encontraron ${sectionTitle.toLowerCase()} para esta búsqueda` 
              : `No hay ${sectionTitle.toLowerCase()} disponibles`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`simpsons-app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* HEADER - Siempre visible */}
      <header className="app-header">
        <div className="header-left">
          <button className="logo-button" onClick={handleLogoClick}>
            <img src="/logo.png" alt="The Simpsons Logo" className="header-logo" />
          </button>
        </div>
        
        <div className="header-center">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={isSearching}
              />
              <button 
                type="submit" 
                className="search-button" 
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? <span className="search-loading">...</span> : <span className="search-icon">⌕</span>}
              </button>
            </div>
          </form>
        </div>
        
        <div className="header-right">
          <LanguageButton />
          <span className="separator">|</span>
          <ThemeButton />
          <button
            className="sign-in-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="app-main">
        {showSearchPage && searchResults ? (
          // Página de resultados de búsqueda
          <SearchResults
            searchQuery={searchQuery}
            searchResults={searchResults}
            onClearSearch={handleClearSearch}
            onNewSearch={handleNewSearch}
            isLoading={isSearching}
          />
        ) : (
          // Página principal normal
          <>
            <div className="hero-section first-hero">
              <div className="logo-container">
                <img src="/logo.png" alt="The Simpsons Logo" className="main-logo" />
              </div>
              
              <div className="welcome-message">
                <h1 className="welcome-title">{t('appTitle')}</h1>
                <p className="welcome-text">{t('welcomeMessage')}</p>
              </div>
              
              <div className="status-container">
                <div className="status-card">
                  <div className="status-item">
                    <span className="status-label">{t('currentLanguage')}:</span>
                    <span className="status-value">{language === 'en' ? 'English' : 'Español'}</span>
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">{t('currentTheme')}:</span>
                    <span className="status-value">{isDarkMode ? t('darkMode') : t('lightMode')}</span>
                  </div>
                </div>
              </div>
              
              {hasSearchResults && (
                <div className="search-results-info">
                  <p className="search-info-text">
                    {t('searchingFor')}: <strong>"{searchQuery}"</strong>
                    <button 
                      className="clear-search-button" 
                      onClick={handleClearSearch}
                    >
                      ✕ Limpiar
                    </button>
                  </p>
                  <div className="search-summary">
                    <span className="search-summary-item">{charactersToShow.length} {t('characters')}</span>
                    <span className="search-summary-item">{episodesToShow.length} {t('episodes')}</span>
                    <span className="search-summary-item">{locationsToShow.length} {t('locations')}</span>
                  </div>
                </div>
              )}
            </div>

            {renderCardSection('character', charactersToShow, charactersRef, t('characters'))}
            {renderCardSection('location', locationsToShow, locationsRef, t('locations'))}
            {renderCardSection('episode', episodesToShow, episodesRef, t('episodes'))}
          </>
        )}
      </main>

      {/* FOOTER - Siempre visible */}
      <footer className="app-footer">
        <p className="footer-text">{t('footerNote')}</p>
        <p className="footer-subtext">{t('projectFor')}</p>
      </footer>
    </div>
  );
}

export default App;