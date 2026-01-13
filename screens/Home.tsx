import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Card from '../components/Card';
import { NavigationProp } from '../navigation/AppNavigator';

const API_CHARACTERS = 'https://thesimpsonsapi.com/api/characters';
const API_EPISODES = 'https://thesimpsonsapi.com/api/episodes';
const API_LOCATIONS = 'https://thesimpsonsapi.com/api/locations';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const [personajes, setPersonajes] = useState<any[]>([]);
  const [episodios, setEpisodios] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);

  useEffect(() => {
    if (!searchText) {
      setPersonajes([]);
      setEpisodios([]);
      setUbicaciones([]);
      return;
    }

    const fetchAllPages = async (endpoint: string) => {
      try {
        const firstPageRes = await fetch(`${endpoint}?page=1`);
        const firstPageData = await firstPageRes.json();
        const totalPages = firstPageData.pages;
        let allResults = [...firstPageData.results];

        for (let page = 2; page <= totalPages; page++) {
          const res = await fetch(`${endpoint}?page=${page}`);
          const data = await res.json();
          allResults = [...allResults, ...data.results];
        }

        return allResults;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const [allPersonajes, allEpisodios, allUbicaciones] = await Promise.all([
          fetchAllPages(API_CHARACTERS),
          fetchAllPages(API_EPISODES),
          fetchAllPages(API_LOCATIONS),
        ]);

        const filteredP = allPersonajes.filter((p: any) =>
          p.name.toLowerCase().includes(searchText.toLowerCase())
        );
        const filteredE = allEpisodios.filter((e: any) =>
          e.name.toLowerCase().includes(searchText.toLowerCase())
        );
        const filteredU = allUbicaciones.filter((u: any) =>
          u.name.toLowerCase().includes(searchText.toLowerCase())
        );

        setPersonajes(filteredP);
        setEpisodios(filteredE);
        setUbicaciones(filteredU);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchText]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Buscar personajes, episodios, ubicaciones..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

      {searchText ? (
        <>
          {personajes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personajes</Text>
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
          )}

          {episodios.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Episodios</Text>
              {episodios.map(e => (
                <Card
                  key={e.id}
                  title={e.name}
                  onPress={() =>
                    navigation.navigate('CardDetail', { type: 'episodio', data: e })
                  }
                />
              ))}
            </View>
          )}

          {ubicaciones.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ubicaciones</Text>
              {ubicaciones.map(u => (
                <Card
                  key={u.id}
                  title={u.name}
                  onPress={() =>
                    navigation.navigate('CardDetail', { type: 'ubicacion', data: u })
                  }
                />
              ))}
            </View>
          )}

          {personajes.length === 0 &&
            episodios.length === 0 &&
            ubicaciones.length === 0 &&
            !loading && <Text style={{ marginTop: 20 }}>No se encontraron resultados</Text>}
        </>
      ) : (
        <>
          <Card
            title="Personajes"
            onPress={() => navigation.navigate('Personajes')}
          />
          <Card
            title="Ubicaciones"
            onPress={() => navigation.navigate('Ubicaciones')}
          />
          <Card
            title="Episodios"
            onPress={() => navigation.navigate('Episodios')}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});

export default HomeScreen;
