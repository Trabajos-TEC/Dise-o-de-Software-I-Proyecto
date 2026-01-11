import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as Localization from 'expo-localization';
import { getTranslation } from '../i18n';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getDeviceLanguage = (): Language => {
    const locales = Localization.getLocales();
    const langCode = locales[0]?.languageCode;
    return langCode === 'es' ? 'es' : 'en';
  };

  const [language, setLanguage] = useState<Language>(getDeviceLanguage);

  const t = (key: string): string => {
    try {
      return getTranslation(language, key);
    } catch {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
