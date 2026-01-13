import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Card from '../components/Card';

type Ubicacion = {
  id: number;
  name: string;
};

type RootStackParamList = {
  Ubicaciones: undefined;
  CardDetail: { type: string; data: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const API_BASE = 'https://thesimpsonsapi.com/api/locations';

const UbicacionesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [locations, setLocations] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Obtenemos el count total de ubicaciones
        const response = await fetch(API_BASE);
        const data = await response.json();
        const count = data.count;

        // Tomamos los primeros 20 IDs
        const ids = Array.from({ length: Math.min(count, 20) }, (_, i) => i + 1);

        const locationsData = await Promise.all(
          ids.map(async id => {
            const res = await fetch(`${API_BASE}/${id}`);
            return await res.json();
          })
        );

        setLocations(locationsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {locations.map(loc => (
          <Card
            key={loc.id}
            title={loc.name}
            onPress={() =>
              navigation.navigate('CardDetail', { type: 'ubicacion', data: loc })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default UbicacionesScreen;
