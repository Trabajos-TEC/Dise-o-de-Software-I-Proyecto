type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    cardClickForInfo: 'Tap to view information',
    cardClickForImage: 'Tap to view image',
    favoritesAdded: 'Added to favorites',
    favoritesRemoved: 'Removed from favorites',
  },
  es: {
    cardClickForInfo: 'Toca para ver información',
    cardClickForImage: 'Toca para ver imagen',
    favoritesAdded: 'Añadido a favoritos',
    favoritesRemoved: 'Eliminado de favoritos',
  },
};

export function getTranslation(language: string, key: string): string {
  return translations[language]?.[key] ?? key;
}
