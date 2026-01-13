import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Episodio = {
  id: number;
  name: string;
  season: number;
  image_path?: string;
};

type RootStackParamList = {
  Episodios: undefined;
  CardDetail: { type: string; data: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const API_BASE = 'https://thesimpsonsapi.com/api/episodes';

const EpisodiosScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodios = async () => {
      try {

        const response = await fetch(API_BASE);
        const data = await response.json();
        const count = data.count;


        const ids = Array.from({ length: Math.min(count, 20) }, (_, i) => i + 1);

        const episodiosData = await Promise.all(
          ids.map(async id => {
            const res = await fetch(`${API_BASE}/${id}`);
            return await res.json();
          })
        );

        setEpisodios(episodiosData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodios();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {episodios.map(ep => (
          <Card
            key={ep.id}
            title={`${ep.name} (S${ep.season})`}
            onPress={() =>
              navigation.navigate('CardDetail', { type: 'episodio', data: ep })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default EpisodiosScreen;
