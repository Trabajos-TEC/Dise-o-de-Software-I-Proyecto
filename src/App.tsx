// App.tsx - SOLO PÁGINA PRINCIPAL
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import MainLayout from './components/MainLayout';
import Card from './components/Card';
import type { CardData } from './components/Card';
import { useNavigate } from "react-router-dom";
import { 
  getInitialCardReferences,
  loadCardData,
  groupCardsByType
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
  
  // Estados de la página principal
  const [initialCards, setInitialCards] = useState<CardData[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const charactersRef = useRef<HTMLDivElement>(null);
  const episodesRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);

  const [scrollPositions, setScrollPositions] = useState({
    characters: 0,
    episodes: 0,
    locations: 0
  });

  // Cargar tarjetas iniciales
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

  // Funciones de desplazamiento circular
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

  // Resetear scroll
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

  const handleCardClick = (card: CardData) => {
    navigate(`/card/${card.id}`, { 
      state: { 
        cardData: card 
      } 
    });
  };

  const handleFavoriteToggle = (cardId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(cardId)) {
        newFavorites.delete(cardId);
      } else {
        newFavorites.add(cardId);
      }
      return newFavorites;
    });
  };

  // Renderizar sección de tarjetas
  const renderCardSection = (
    sectionType: 'character' | 'episode' | 'location',
    cards: CardData[],
    ref: React.RefObject<HTMLDivElement | null>,
    sectionTitle: string
  ) => {
    const hasCards = cards.length > 0;
    const isLoading = loadingInitial;
    const sectionKey = sectionType === 'character' ? 'characters' : 
                       sectionType === 'episode' ? 'episodes' : 'locations';
    
    return (
      <div className={`cards-section ${sectionType}-section`}>
        <div className="section-header">
          <h2 className="section-title">
            {sectionTitle}
          </h2>
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
                  flipOnHover={false}
                  variant="preview"
                  showFavoriteButton={true}
                  isFavorite={favorites.has(card.id.toString())}
                  onFavoriteToggle={() => handleFavoriteToggle(card.id.toString())}
                  onClick={() => handleCardClick(card)}
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
            No hay {sectionTitle.toLowerCase()} disponibles
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      {/* SOLO PÁGINA PRINCIPAL - SIN RESULTADOS DE BÚSQUEDA */}
      <div className="hero-section first-hero">
        <div className="logo-container">
          <img src="/8fd978ef204d80914f6a493c8377415a.png" alt="The Simpsons Logo" className="main-logo" />
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
      </div>

      {renderCardSection('character', groupedInitialCards.character, charactersRef, t('characters'))}
      {renderCardSection('location', groupedInitialCards.location, locationsRef, t('locations'))}
      {renderCardSection('episode', groupedInitialCards.episode, episodesRef, t('episodes'))}
    </MainLayout>
  );
}

export default App;