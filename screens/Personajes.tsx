import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Card from '../components/Card';

type Personaje = {
  id: number;
  name: string;
  portrait_path: string;
};

type RootStackParamList = {
  Personajes: undefined;
  CardDetail: { type: string; data: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const API_BASE = 'https://thesimpsonsapi.com/api/characters';

const PersonajesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonajes = async () => {
      try {
        // Primero obtenemos el count
        const response = await fetch(API_BASE);
        const data = await response.json();
        const count = data.count;

        // Luego obtenemos los primeros 20 personajes por ejemplo
        const ids = Array.from({ length: Math.min(count, 25) }, (_, i) => i + 1);

        const personajesData = await Promise.all(
          ids.map(async id => {
            const res = await fetch(`${API_BASE}/${id}`);
            return await res.json();
          })
        );

        setPersonajes(personajesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonajes();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {personajes.map(p => (
          <Card
            key={p.id}
            title={p.name}
            onPress={() =>
              navigation.navigate('CardDetail', { type: 'personaje', data: p })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default PersonajesScreen;
