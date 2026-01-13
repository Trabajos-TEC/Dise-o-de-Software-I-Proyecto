// context/LanguageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es';

export interface TranslationKeys {
  appTitle: string;
  themeSwitcher: string;
  languageSwitcher: string;
  lightMode: string;
  darkMode: string;
  dayMode: string;
  nightMode: string;
  simpsonsTheme: string;
  currentMode: string;
  changeTo: string;
  toggleTheme: string;
  toggleLanguage: string;
  welcomeMessage: string;
  themeDescription: string;
  languageDescription: string;
  footerNote: string;
  projectFor: string;
  currentLanguage: string;
  currentTheme: string;
  comingSoon: string;
  comingSoonDescription: string;
  searchPlaceholder: string;
  searchingFor: string;
  characters: string;
  locations: string;
  episodes: string;
  clearSearch: string;
  loading: string;
  noResultsFound: string;
  noDataAvailable: string;
  cardsLoaded: string;
  cardClickForImage: string;
  cardClickForInfo: string;
  
  previousCards: string;
  nextCards: string;
  loadingCharacters: string;
  loadingLocations: string;
  loadingEpisodes: string;
  noCharactersAvailable: string;
  noLocationsAvailable: string;
  noEpisodesAvailable: string;

  /*PAGINA DE BUSQUEDA */
  searchResultsFor: string;
  of: string;
  results: string;
  filtered: string;
  filters: string;
  category: string;
  all: string;
  gender: string;
  season: string;
  resetFilters: string;
  noResultsWithFilters: string;
  previous: string;
  next: string;
  page: string;
  backToHome: string;

  /* CARD DETAIL PAGE */
  goBack: string;
  cardNotFound: string;
  
  character: string;
  episode: string;
  location: string;
  
  characterDetails: string;
  episodeDetails: string;
  locationDetails: string;
  cardDetails: string;
  detailedInformation: string;
  
  // Mensajes para personajes
  characterDescription: string;
  characterCurrently: string;
  characterGender: string;
  characterOccupation: string;
  characterAge: string;
  characterBorn: string;
  characterAgeYears: string;
  
  // Mensajes para episodios
  episodeDescription: string;
  episodeSeason: string;
  episodeNumber: string;
  episodeAired: string;
  
  // Mensajes para lugares
  locationDescription: string;
  locatedIn: string;
  mainUse: string;
  partOfTown: string;
  usedAs: string;
  
  // Información común
  age: string;
  birthdate: string;
  famousPhrases: string;
  synopsis: string;
  episodeNumberLabel: string;
  town: string;
  use: string;
  
  // Botones y mensajes
  share: string;
  addToCollection: string;
  removeFromCollection: string;
  addedToFavorites: string;
  removedFromFavorites: string;
  
  // Mensajes genéricos
  status: string;
  occupation: string;

  analyticsTitle: string;
  analyticsSubtitle: string;
  loadingAnalytics: string;
  
  /* Tabs */
  top10Tab: string;
  seasonsTab: string;
  
  /* Top 10 Section */
  top10Title: string;
  top10Description: string;
  searches: string;
  
  /* Seasons Section */
  seasonsTitle: string;
  seasonsDescription: string;
  seasonsCount: string;
  totalEpisodes: string;
  averagePerSeason: string;
  moreEpisodes: string;
}

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones completas
const translations: Record<Language, TranslationKeys> = {
  en: {
    appTitle: 'The Simpsons API Explorer',
    themeSwitcher: 'Theme',
    languageSwitcher: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    dayMode: 'Day',
    nightMode: 'Night',
    simpsonsTheme: 'Simpsons Theme',
    currentMode: 'Current Mode',
    changeTo: 'Change to',
    toggleTheme: 'Toggle Theme',
    toggleLanguage: 'Toggle Language',
    welcomeMessage: 'Welcome to The Simpsons Universe!',
    themeDescription: 'Switch between day and night themes',
    languageDescription: 'Change interface language',
    footerNote: 'This project uses The Simpsons API for educational purposes.',
    projectFor: 'Project for Software Design I',
    currentLanguage: 'English',
    currentTheme: 'Day Theme',
    comingSoon: 'Coming Soon',
    comingSoonDescription: 'New features and improvements are on the way!',
    searchPlaceholder: 'Search characters, episodes, locations...',
    searchingFor: 'Searching for',
    characters: 'Characters',
    locations: 'Locations',
    episodes: 'Episodes',
    clearSearch: 'Clear Search',
    loading: 'Loading...',
    noResultsFound: 'No results found',
    noDataAvailable: 'No data available',
    cardsLoaded: 'cards loaded',
    cardClickForImage: 'Click for image',
    cardClickForInfo: 'Click for info',
    
    previousCards: 'Previous',
    nextCards: 'Next',
    loadingCharacters: 'Loading characters...',
    loadingLocations: 'Loading locations...',
    loadingEpisodes: 'Loading episodes...',
    noCharactersAvailable: 'No characters available',
    noLocationsAvailable: 'No locations available',
    noEpisodesAvailable: 'No episodes available',

    searchResultsFor: 'Results for',
    of: 'of',
    results: 'results',
    filtered: 'Filtered',
    filters: 'Filters',
    category: 'Category',
    all: 'All',
    gender: 'Gender',
    season: 'Season',
    resetFilters: 'Reset Filters',
    noResultsWithFilters: 'No results with current filters',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    backToHome: 'Back to Home',

    goBack: 'Go Back',
    cardNotFound: 'Card not found',
    
    character: 'Character',
    episode: 'Episode',
    location: 'Location',
    
    characterDetails: 'Character Details',
    episodeDetails: 'Episode Details',
    locationDetails: 'Location Details',
    cardDetails: 'Card Details',
    detailedInformation: 'Detailed Information',
    
    characterDescription: 'Description',
    characterCurrently: 'Status',
    characterGender: 'Gender',
    characterOccupation: 'Occupation',
    characterAge: 'Age',
    characterBorn: 'Born',
    characterAgeYears: 'years old',
    
    episodeDescription: 'Synopsis',
    episodeSeason: 'Season',
    episodeNumber: 'Episode',
    episodeAired: 'Aired',
    
    locationDescription: 'Description',
    locatedIn: 'Located in',
    mainUse: 'Main Use',
    partOfTown: 'Part of Town',
    usedAs: 'Used as',
    
    age: 'Age',
    birthdate: 'Birthdate',
    famousPhrases: 'Famous Phrases',
    synopsis: 'Synopsis',
    episodeNumberLabel: 'Episode #',
    town: 'Town',
    use: 'Use',
    
    share: 'Share',
    addToCollection: 'Add to Collection',
    removeFromCollection: 'Remove from Collection',
    addedToFavorites: 'Added to favorites',
    removedFromFavorites: 'Removed from favorites',
    
    status: 'Status',
    occupation: 'Occupation',

    analyticsTitle: 'Analytics',
    analyticsSubtitle: 'Statistics and data about The Simpsons',
    loadingAnalytics: 'Loading analytics...',
    
    top10Tab: 'Top 10',
    seasonsTab: 'Seasons',
    
    top10Title: 'Top 10 Most Searched',
    top10Description: 'The most popular searches in the application',
    searches: 'searches',
    
    seasonsTitle: 'Seasons Statistics',
    seasonsDescription: 'Information about all seasons',
    seasonsCount: 'Total Seasons',
    totalEpisodes: 'Total Episodes',
    averagePerSeason: 'Average per Season',
    moreEpisodes: 'more episodes',
  },
  es: {
    appTitle: 'Explorador API de Los Simpson',
    themeSwitcher: 'Tema',
    languageSwitcher: 'Idioma',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    dayMode: 'Día',
    nightMode: 'Noche',
    simpsonsTheme: 'Tema Simpson',
    currentMode: 'Modo Actual',
    changeTo: 'Cambiar a',
    toggleTheme: 'Cambiar Tema',
    toggleLanguage: 'Cambiar Idioma',
    welcomeMessage: '¡Bienvenido al Universo de Los Simpson!',
    themeDescription: 'Cambia entre temas día y noche',
    languageDescription: 'Cambia el idioma de la interfaz',
    footerNote: 'Este proyecto usa The Simpsons API con fines educativos.',
    projectFor: 'Proyecto para Diseño de Software I',
    currentLanguage: 'Español',
    currentTheme: 'Tema Día',
    comingSoon: 'Próximamente',
    comingSoonDescription: '¡Nuevas características y mejoras en camino!',
    searchPlaceholder: 'Buscar personajes, episodios, ubicaciones...',
    searchingFor: 'Buscando',
    characters: 'Personajes',
    locations: 'Ubicaciones',
    episodes: 'Episodios',
    clearSearch: 'Limpiar Búsqueda',
    loading: 'Cargando...',
    noResultsFound: 'No se encontraron resultados',
    noDataAvailable: 'No hay datos disponibles',
    cardsLoaded: 'cartas cargadas',
    cardClickForImage: 'Click para ver imagen',
    cardClickForInfo: 'Click para ver información',
    
    previousCards: 'Anterior',
    nextCards: 'Siguiente',
    loadingCharacters: 'Cargando personajes...',
    loadingLocations: 'Cargando ubicaciones...',
    loadingEpisodes: 'Cargando episodios...',
    noCharactersAvailable: 'No hay personajes disponibles',
    noLocationsAvailable: 'No hay ubicaciones disponibles',
    noEpisodesAvailable: 'No hay episodios disponibles',

    searchResultsFor: 'Resultados para',
    of: 'de',
    results: 'resultados',
    filtered: 'Filtrado',
    filters: 'Filtros',
    category: 'Categoría',
    all: 'Todos',
    gender: 'Género',
    season: 'Temporada',
    resetFilters: 'Restablecer Filtros',
    noResultsWithFilters: 'No hay resultados con los filtros actuales',
    previous: 'Anterior',
    next: 'Siguiente',
    page: 'Página',
    backToHome: 'Volver al Inicio',

    goBack: 'Volver',
    cardNotFound: 'Carta no encontrada',
    
    character: 'Personaje',
    episode: 'Episodio',
    location: 'Ubicación',
    
    characterDetails: 'Detalles del Personaje',
    episodeDetails: 'Detalles del Episodio',
    locationDetails: 'Detalles de la Ubicación',
    cardDetails: 'Detalles de la Carta',
    detailedInformation: 'Información Detallada',
    
    characterDescription: 'Descripción',
    characterCurrently: 'Estado',
    characterGender: 'Género',
    characterOccupation: 'Ocupación',
    characterAge: 'Edad',
    characterBorn: 'Nacimiento',
    characterAgeYears: 'años',
    
    episodeDescription: 'Sinopsis',
    episodeSeason: 'Temporada',
    episodeNumber: 'Episodio',
    episodeAired: 'Emitido',
    
    locationDescription: 'Descripción',
    locatedIn: 'Ubicado en',
    mainUse: 'Uso Principal',
    partOfTown: 'Parte de la Ciudad',
    usedAs: 'Usado como',
    
    age: 'Edad',
    birthdate: 'Fecha de Nacimiento',
    famousPhrases: 'Frases Famosas',
    synopsis: 'Sinopsis',
    episodeNumberLabel: 'Episodio #',
    town: 'Ciudad',
    use: 'Uso',
    
    share: 'Compartir',
    addToCollection: 'Agregar a Colección',
    removeFromCollection: 'Eliminar de Colección',
    addedToFavorites: 'Agregado a favoritos',
    removedFromFavorites: 'Eliminado de favoritos',
    
    status: 'Estado',
    occupation: 'Ocupación',

    analyticsTitle: 'Analíticas',
    analyticsSubtitle: 'Estadísticas y datos sobre Los Simpson',
    loadingAnalytics: 'Cargando analíticas...',
    
    top10Tab: 'Top 10',
    seasonsTab: 'Temporadas',
    
    top10Title: 'Top 10 Más Buscados',
    top10Description: 'Las búsquedas más populares en la aplicación',
    searches: 'búsquedas',
    
    seasonsTitle: 'Estadísticas de Temporadas',
    seasonsDescription: 'Información sobre todas las temporadas',
    seasonsCount: 'Total Temporadas',
    totalEpisodes: 'Total Episodios',
    averagePerSeason: 'Promedio por Temporada',
    moreEpisodes: 'episodios más',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'es' ? 'en' : 'es'));
  };

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};