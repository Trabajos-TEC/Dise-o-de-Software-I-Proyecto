// Importa valores primero
import { en } from './languages/en';
import { es } from './languages/es';

// Importa tipos SEPARADAMENTE con 'import type'
import type { Translations, Language, TranslationKeys } from './types';

// Exporta los objetos de traducción
export const translations: Translations = {
  en,
  es
};

// Función para obtener traducción
export const getTranslation = (lang: Language, key: keyof TranslationKeys): string => {
  return translations[lang][key];
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

// Exporta tipos usando 'export type'
export type { Language, TranslationKeys, Translations };