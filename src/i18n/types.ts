// src/i18n/types.ts
export type Language = 'en' | 'es';

// Define el tipo de las traducciones
export interface Translations {
  [key: string]: string;
}

// Define las claves específicas
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
  characterAgeYears: string; // <-- NUEVO
  
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
  
  // Mensajes genéricos (para el default case)
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
