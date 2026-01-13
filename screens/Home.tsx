// HomeScreen.tsx - CON fondo PNG propio
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
} from 'react-native';
import Card from '../components/Card';
import { NavigationProp } from '../navigation/AppNavigator';
import { useLanguage } from '../context/LanguageContext'; // Importar useLanguage

const API_CHARACTERS = 'https://thesimpsonsapi.com/api/characters';
const API_EPISODES = 'https://thesimpsonsapi.com/api/episodes';
const API_LOCATIONS = 'https://thesimpsonsapi.com/api/locations';

interface HomeScreenProps {
  darkTheme?: boolean;
  clearSearchFlag?: boolean;
  onClearSearch?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  darkTheme = false,
  clearSearchFlag = false,
  onClearSearch 
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage(); // Obtener la función de traducción

  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const [personajes, setPersonajes] = useState<any[]>([]);
  const [episodios, setEpisodios] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);

  // Efecto para limpiar búsqueda cuando se presiona el logo
  useEffect(() => {
    if (clearSearchFlag && onClearSearch) {
      setSearchText('');
      setPersonajes([]);
      setEpisodios([]);
      setUbicaciones([]);
      onClearSearch();
    }
  }, [clearSearchFlag, onClearSearch]);

  // Fondo PNG según tema
  const backgroundImage = darkTheme 
    ? require('../assets/simpsons_nubes_noche.png')
    : require('../assets/simpsons_nubes_dia.png');

  // Colores según tema
  const textColor = darkTheme ? '#E0E0FF' : '#2C3E50';
  const placeholderColor = darkTheme ? '#B8B8FF' : '#666';
  const sectionBg = darkTheme ? 'rgba(45, 27, 105, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const inputBg = darkTheme ? 'rgba(28, 16, 68, 0.9)' : 'rgba(255, 255, 255, 0.95)';
  const borderColor = darkTheme ? '#4A4FC5' : '#FFD90F';

  useEffect(() => {
    if (!searchText) {
      setPersonajes([]);
      setEpisodios([]);
      setUbicaciones([]);
      return;
    }

    const fetchAllPages = async (endpoint: string): Promise<any[]> => {
      try {
        const firstPageRes = await fetch(`${endpoint}?page=1`);
        const firstPageData = await firstPageRes.json();
        
        if (!firstPageData || !firstPageData.results) {
          console.warn(`API ${endpoint} no devolvió resultados`);
          return [];
        }
        
        const totalPages = firstPageData.pages || 1;
        let allResults = [...firstPageData.results];

        for (let page = 2; page <= totalPages; page++) {
          try {
            const res = await fetch(`${endpoint}?page=${page}`);
            const data = await res.json();
            if (data.results) {
              allResults = [...allResults, ...data.results];
            }
          } catch (pageError) {
            console.error(`Error fetching page ${page}:`, pageError);
          }
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

        const filteredP = Array.isArray(allPersonajes) 
          ? allPersonajes.filter((p: any) =>
              p && p.name && p.name.toLowerCase().includes(searchText.toLowerCase())
            )
          : [];

        const filteredE = Array.isArray(allEpisodios)
          ? allEpisodios.filter((e: any) =>
              e && e.name && e.name.toLowerCase().includes(searchText.toLowerCase())
            )
          : [];

        const filteredU = Array.isArray(allUbicaciones)
          ? allUbicaciones.filter((u: any) =>
              u && u.name && u.name.toLowerCase().includes(searchText.toLowerCase())
            )
          : [];

        setPersonajes(filteredP);
        setEpisodios(filteredE);
        setUbicaciones(filteredU);
      } catch (error) {
        console.error('Error en fetchData:', error);
        setPersonajes([]);
        setEpisodios([]);
        setUbicaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchText]);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        style={styles.scrollView}
      >
        <View style={styles.overlay} />
        
        <View style={styles.content}>
          <TextInput
            placeholder={t('searchPlaceholder')} // Usar traducción
            style={[
              styles.searchInput,
              {
                backgroundColor: inputBg,
                color: textColor,
                borderColor: borderColor,
              }
            ]}
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={placeholderColor}
          />

          {loading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

          {searchText ? (
            <>
              {personajes.length > 0 && (
                <View style={[
                  styles.section,
                  { backgroundColor: sectionBg }
                ]}>
                  <Text style={[
                    styles.sectionTitle,
                    { color: textColor }
                  ]}>
                    {t('characters')} {/* Usar traducción */}
                  </Text>
                  {personajes.map(p => (
                    <Card
                      key={p.id}
                      title={p.name}
                      darkTheme={darkTheme}
                      cardType="personaje"
                      cardId={p.id}
                      imageUrl={`https://cdn.thesimpsonsapi.com/200/character/${p.id}.webp`}
                      subtitle={`${p.species || t('character')} • ${p.gender || t('gender')}`} // Usar traducciones
                      onPress={() =>
                        navigation.navigate('CardDetail', { type: 'personaje', data: p })
                      }
                    />
                  ))}
                </View>
              )}

              {episodios.length > 0 && (
                <View style={[
                  styles.section,
                  { backgroundColor: sectionBg }
                ]}>
                  <Text style={[
                    styles.sectionTitle,
                    { color: textColor }
                  ]}>
                    {t('episodes')} {/* Usar traducción */}
                  </Text>
                  {episodios.map(e => (
                    <Card
                      key={e.id}
                      title={e.name}
                      darkTheme={darkTheme}
                      cardType="episodio"
                      cardId={e.id}
                      imageUrl={`https://cdn.thesimpsonsapi.com/200/episode/${e.id}.webp`}
                      subtitle={`${t('episodeSeason')} ${e.season || '?'} • ${t('episodeAired')}: ${e.airdate || '?'}`} // Usar traducciones
                      onPress={() =>
                        navigation.navigate('CardDetail', { type: 'episodio', data: e })
                      }
                    />
                  ))}
                </View>
              )}

              {ubicaciones.length > 0 && (
                <View style={[
                  styles.section,
                  { backgroundColor: sectionBg }
                ]}>
                  <Text style={[
                    styles.sectionTitle,
                    { color: textColor }
                  ]}>
                    {t('locations')} {/* Usar traducción */}
                  </Text>
                  {ubicaciones.map(u => (
                    <Card
                      key={u.id}
                      title={u.name}
                      darkTheme={darkTheme}
                      cardType="ubicacion"
                      cardId={u.id}
                      imageUrl={`https://cdn.thesimpsonsapi.com/200/location/${u.id}.webp`}
                      subtitle={`${u.type || t('location')} • ${u.town || t('town')}`} // Usar traducciones
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
                !loading && (
                  <Text style={[
                    styles.noResults,
                    { color: placeholderColor }
                  ]}>
                    {t('noResultsFound')} {/* Usar traducción */}
                  </Text>
                )}
            </>
          ) : (
            <View style={styles.defaultCards}>
              <Card
                title={t('characters')}
                darkTheme={darkTheme}
                cardType="personaje"
                onPress={() => navigation.navigate('Personajes')}
              />
              <Card
                title={t('locations')}
                darkTheme={darkTheme}
                cardType="ubicacion"
                onPress={() => navigation.navigate('Ubicaciones')}
              />
              <Card
                title={t('episodes')}
                darkTheme={darkTheme}
                cardType="episodio"
                onPress={() => navigation.navigate('Episodios')}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  container: { 
    flexGrow: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  section: { 
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 12,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  defaultCards: {
    gap: 16,
    marginTop: 20,
  },
});

export default HomeScreen;