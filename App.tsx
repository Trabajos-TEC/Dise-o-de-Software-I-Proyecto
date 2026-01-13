// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import CardDetail from './components/CardDetail';
import Header from './components/Header';
import { LanguageProvider } from './context/LanguageContext';
import EpisodiosScreen from './screens/Episodios';
import HomeScreen from './screens/Home';
import PersonajesScreen from './screens/Personajes';
import UbicacionesScreen from './screens/Ubicaciones';
import { colors } from './styles/colors';
import { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const getTheme = (isDark: boolean) => ({
  dark: isDark,
  colors: {
    primary: isDark ? colors.dark.blue : colors.light.blue,
    background: isDark ? colors.dark.background : colors.light.background,
    card: isDark ? colors.dark.cardBg : colors.light.cardBg,
    text: isDark ? colors.dark.textPrimary : colors.light.textPrimary,
    border: isDark ? colors.dark.cardBorder : colors.light.cardBorder,
    notification: '#FF3B30',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as '400' },
    medium: { fontFamily: 'System', fontWeight: '500' as '500' },
    bold: { fontFamily: 'System', fontWeight: '700' as '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' as '900' },
  },
});

export default function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);
  
  const toggleTheme = () => setDarkTheme(!darkTheme);

  const handleLogoPress = () => {
    setClearSearch(true);
    setTimeout(() => setClearSearch(false), 100);
  };

  return (
    <LanguageProvider>
      <NavigationContainer theme={getTheme(darkTheme)}>
        <Stack.Navigator
          screenOptions={{
            header: (props) => (
              <Header 
                toggleTheme={toggleTheme} 
                darkTheme={darkTheme} 
                onLogoPress={handleLogoPress}
                {...props}
              />
            ),
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen 
                {...props} 
                darkTheme={darkTheme} 
                clearSearchFlag={clearSearch}
                onClearSearch={() => setClearSearch(false)}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="Personajes">
            {(props) => <PersonajesScreen {...props} darkTheme={darkTheme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Ubicaciones">
            {(props) => <UbicacionesScreen {...props} darkTheme={darkTheme} />}
          </Stack.Screen>
          
          <Stack.Screen name="Episodios">
            {(props) => <EpisodiosScreen {...props} darkTheme={darkTheme} />}
          </Stack.Screen>
          
          <Stack.Screen name="CardDetail">
            {(props) => <CardDetail {...props} darkTheme={darkTheme} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}