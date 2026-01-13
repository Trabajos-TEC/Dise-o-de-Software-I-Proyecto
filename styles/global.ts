// styles/global.ts
import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from './theme';

export const getGlobalStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const styles = StyleSheet.create({
    // Fondo con imagen - CORREGIDO
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    
    // Contenedor sobre la imagen - CORREGIDO
    containerOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    
    // Contenedor para pantallas - para usar en HomeScreen, etc.
    screenContainer: {
      flex: 1,
      backgroundColor: 'transparent', // Para que se vea el fondo
    },
    
    // Header
    header: {
      backgroundColor: theme.headerBg,
      padding: 16,
      paddingTop: 40,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    
    // ... resto de estilos existentes
  });

  return {
    styles,
    theme,
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  };
};