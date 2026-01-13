import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View } from 'react-native';
import CardDetail from './components/CardDetail';
import Header from './components/Header';
import { LanguageProvider } from './context/LanguageContext';
import EpisodiosScreen from './screens/Episodios';
import HomeScreen from './screens/Home';
import PersonajesScreen from './screens/Personajes';
import UbicacionesScreen from './screens/Ubicaciones';

const Stack = createNativeStackNavigator();

export default function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  return (
    <LanguageProvider>
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: darkTheme ? '#333' : '#fff' }}>
          
            <Stack.Navigator
            screenOptions={{
                header: () => <Header toggleTheme={toggleTheme} />, // aquí se renderiza tu header
            }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Personajes" component={PersonajesScreen} />
                <Stack.Screen name="Ubicaciones" component={UbicacionesScreen} />
                <Stack.Screen name="Episodios" component={EpisodiosScreen} />
                <Stack.Screen name="CardDetail" component={CardDetail} />
            </Stack.Navigator>

        </View>
      </NavigationContainer>
    </LanguageProvider>
  );
}
