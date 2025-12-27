/*PARA AGREGAR LOS TIPOS DE ELEMENTOS QUE SE LES PUEDE CAMBIAR EL IDIOMA*/
export type Language = 'en' | 'es';

export interface TranslationKeys {
  // Títulos
  appTitle: string;
  themeSwitcher: string;
  languageSwitcher: string;
  
  // Modos
  lightMode: string;
  darkMode: string;
  dayMode: string;
  nightMode: string;
  
  // Textos de la barra
  simpsonsTheme: string;
  currentMode: string;
  changeTo: string;
  
  // Botones
  toggleTheme: string;
  toggleLanguage: string;
  
  // Descripciones
  welcomeMessage: string;
  themeDescription: string;
  languageDescription: string;
  
  // Footer
  footerNote: string;
  projectFor: string;
}

export type Translations = {
  [key in Language]: TranslationKeys;
};