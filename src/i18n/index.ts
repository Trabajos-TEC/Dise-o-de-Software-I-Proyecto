// src/i18n/index.ts
import { en } from './languages/en';
import { es } from './languages/es';

// Define los tipos localmente
export type Language = 'en' | 'es';

// Usa el tipo correcto para las traducciones
export type Translations = {
  en: typeof en;
  es: typeof es;
};

// Exporta los objetos de traducción
export const translations: Translations = {
  en,
  es
};

// Obtiene todas las claves disponibles de las traducciones
type AllKeys = keyof typeof en | keyof typeof es;

// Función para obtener traducción
export const getTranslation = (lang: Language, key: string): string => {
  // Usa aserción de tipo o maneja el error
  const typedKey = key as AllKeys;
  return translations[lang]?.[typedKey] || key;
};

// Idiomas disponibles
export const getAvailableLanguages = (): Array<{ 
  code: Language; 
  name: string; 
  flag: string 
}> => [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

// Exporta todo
export { en, es };

// Exporta tipos
export type { TranslationKeys } from './types';