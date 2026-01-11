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
}