// navigation/AppNavigator.tsx (versión simple)
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import CardDetail from '../components/CardDetail';
import EpisodiosScreen from '../screens/Episodios';
import HomeScreen from '../screens/Home';
import PersonajesScreen from '../screens/Personajes';
import UbicacionesScreen from '../screens/Ubicaciones';

// Tipado de rutas
export type RootStackParamList = {
  Home: undefined;
  Personajes: undefined;  
  Ubicaciones: undefined;  
  Episodios: undefined;    
  CardDetail: { type: string; data: any };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Personajes" component={PersonajesScreen} />   
    <Stack.Screen name="Ubicaciones" component={UbicacionesScreen} />  
    <Stack.Screen name="Episodios" component={EpisodiosScreen} />      
    <Stack.Screen name="CardDetail" component={CardDetail} />
  </Stack.Navigator>
);

export default AppNavigator;