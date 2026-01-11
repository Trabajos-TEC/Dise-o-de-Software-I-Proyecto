import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'simpsons-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);

  // Cargar tema guardado o usar el del sistema
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedTheme === 'dark') {
          setIsDarkMode(true);
        } else if (savedTheme === 'light') {
          setIsDarkMode(false);
        } else {
          const systemTheme = Appearance.getColorScheme();
          setIsDarkMode(systemTheme === 'dark');
        }
      } catch (error) {
        console.warn('Error loading theme:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  // Guardar tema cuando cambia
  useEffect(() => {
    if (!isReady) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      isDarkMode ? 'dark' : 'light'
    ).catch(() => {});
  }, [isDarkMode, isReady]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (!isReady) {
    return null; // evita parpadeos
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
