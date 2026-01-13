import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import CardDetail from '../components/CardDetail';
import Episodios from '../screens/Episodios';
import HomeScreen from '../screens/Home';
import Personajes from '../screens/Personajes';
import Ubicaciones from '../screens/Ubicaciones';

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
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Personajes" component={Personajes} />   
    <Stack.Screen name="Ubicaciones" component={Ubicaciones} />  
    <Stack.Screen name="Episodios" component={Episodios} />      
    <Stack.Screen name="CardDetail" component={CardDetail} />
  </Stack.Navigator>
);

export default AppNavigator;
