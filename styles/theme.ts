// styles/theme.ts
import { colors } from './colors';

export const lightTheme = {
  // Colores base
  ...colors.light,
  
  // Alias para fácil acceso
  primary: colors.light.blue,
  secondary: colors.light.yellow,
  accent: colors.light.orange,
  
  // Fondos
  background: colors.light.white,
  surface: colors.light.cardBg,
  
  // Textos
  text: colors.light.textPrimary,
  textLight: colors.light.textSecondary,
  
  // Bordes
  border: colors.light.cardBorder,
  divider: 'rgba(255, 217, 15, 0.2)',
  
  // Sombras
  shadow: 'rgba(0, 0, 0, 0.12)',
  
  // Estados
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

export const darkTheme = {
  // Colores base
  ...colors.dark,
  
  // Alias para fácil acceso
  primary: colors.dark.blue,
  secondary: colors.dark.yellow,
  accent: colors.dark.orange,
  
  // Fondos
  background: colors.dark.darkBlue,
  surface: colors.dark.cardBg,
  
  // Textos
  text: colors.dark.textPrimary,
  textLight: colors.dark.textSecondary,
  
  // Bordes
  border: colors.dark.cardBorder,
  divider: 'rgba(138, 43, 226, 0.2)',
  
  // Sombras
  shadow: 'rgba(0, 0, 0, 0.4)',
  
  // Estados
  success: '#66BB6A',
  warning: '#FFB74D',
  error: '#EF5350',
  info: '#42A5F5',
};