// App.tsx - SOLO PÁGINA PRINCIPAL
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import MainLayout from './components/MainLayout';
import Card from './components/Card';
import type { CardData } from './components/Card';
import { useNavigate } from "react-router-dom";
import { 
  getInitialCardReferences,
  loadCardData,
  groupCardsByType
} from './components/cardUtils';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

import "./index.css";
import "./styles/theme-light.css";
import "./styles/theme-dark.css";
import "./styles/components/header.css";
import "./styles/components/buttons.css";
import "./styles/components/layout.css";
import "./styles/components/Card.css";

function App() {
  const navigate = useNavigate();
  
  const { t } = useLanguage();
  
  // Estados de la página principal
  const [initialCards, setInitialCards] = useState<CardData[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const charactersRef = useRef<HTMLDivElement>(null);
  const episodesRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");

    const unsubscribe = onSnapshot(favRef, snapshot => {
      const ids = new Set<string>();
      snapshot.forEach(doc => ids.add(doc.id));
      setFavorites(ids);
    });

    return () => unsubscribe();
  }, []);

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

  // Función para obtener el tamaño de carta correcto según el dispositivo
  const getCardDimensions = () => {
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 768;
    
    if (isMobile) {
      return { width: 160, gap: 15 }; // Tamaño móvil
    } else if (isTablet) {
      return { width: 220, gap: 20 }; // Tamaño tablet
    } else {
      return { width: 280, gap: 30 }; // Tamaño desktop
    }
  };

  // Versión simple - usa scrollBy (1 carta por clic)
  const scrollLeftSimple = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    
    const container = ref.current;
    const dimensions = getCardDimensions();
    const cardWidth = dimensions.width + dimensions.gap;
    
    container.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
  };

  const scrollRightSimple = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    
    const container = ref.current;
    const dimensions = getCardDimensions();
    const cardWidth = dimensions.width + dimensions.gap;
    
    container.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
  };

  // Resetear scroll cuando cambia el tamaño
  useEffect(() => {
    const handleResize = () => {      
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
    navigate(`/card/${card.type}-${card.id}`, { 
      state: { 
        cardData: card 
      } 
    });
  };

  const handleFavoriteToggle = async (card: CardData) => {
    const user = auth.currentUser;
    if (!user) return;

    const id = `${card.type}-${card.id}`;

    setFavorites(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });

    const favRef = doc(db, "users", user.uid, "favorites", id);

    try {
      if (favorites.has(id)) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, card);
      }
    } catch (err) {
      console.error(err);
    }
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
    
    // Determinar qué traducción usar para loading
    const getLoadingText = () => {
      if (sectionType === 'character') return t('loadingCharacters');
      if (sectionType === 'location') return t('loadingLocations');
      return t('loadingEpisodes');
    };
    
    // Determinar qué traducción usar para no data
    const getNoDataText = () => {
      if (sectionType === 'character') return t('noCharactersAvailable');
      if (sectionType === 'location') return t('noLocationsAvailable');
      return t('noEpisodesAvailable');
    };
    
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
            {getLoadingText()}
          </div>
        ) : hasCards ? (
          <div className="carousel-container">
            <button 
              className="carousel-button left" 
              onClick={() => scrollLeftSimple(ref)}
              aria-label={t('previousCards')}
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
                  onFavoriteToggle={() => handleFavoriteToggle(card)}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
            <button 
              className="carousel-button right" 
              onClick={() => scrollRightSimple(ref)}
              aria-label={t('nextCards')}
            >
              ▶
            </button>
          </div>
        ) : (
          <div className="no-data-message">
            {getNoDataText()}
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
      </div>

      {renderCardSection('character', groupedInitialCards.character, charactersRef, t('characters'))}
      {renderCardSection('location', groupedInitialCards.location, locationsRef, t('locations'))}
      {renderCardSection('episode', groupedInitialCards.episode, episodesRef, t('episodes'))}
    </MainLayout>
  );
}

export default App;