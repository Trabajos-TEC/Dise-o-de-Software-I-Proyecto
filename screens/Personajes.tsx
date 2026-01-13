// screens/PersonajesScreen.tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  ScrollView, 
  View, 
  ImageBackground,
  Text,
  StyleSheet 
} from 'react-native';
import Card from '../components/Card';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../context/LanguageContext';

const API_BASE = 'https://thesimpsonsapi.com/api/characters';

interface PersonajesScreenProps {
  darkTheme?: boolean;
}

type Personaje = {
  id: number;
  name: string;
  species?: string;
  gender?: string;
  status?: string;
  occupation?: string;
  age?: string;
};

const PersonajesScreen: React.FC<PersonajesScreenProps> = ({ darkTheme = false }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fondo PNG según tema
  const backgroundImage = darkTheme 
    ? require('../assets/simpsons_nubes_noche.png')
    : require('../assets/simpsons_nubes_dia.png');

  // Colores según tema
  const textColor = darkTheme ? '#E0E0FF' : '#2C3E50';
  const sectionBg = darkTheme ? 'rgba(45, 27, 105, 0.8)' : 'rgba(255, 255, 255, 0.8)';

  useEffect(() => {
    fetchPersonajes();
  }, [page]);

  const fetchPersonajes = async () => {
    try {
      const response = await fetch(`${API_BASE}?page=${page}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        if (page === 1) {
          setPersonajes(data.results);
        } else {
          setPersonajes(prev => [...prev, ...data.results]);
        }
        
        setHasMore(page < (data.pages || 1));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching personajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  if (loading && page === 1) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={textColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>
            {t('loadingCharacters')}
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        style={styles.scrollView}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && hasMore && !loading) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.overlay} />
        
        <View style={styles.content}>
          {/* Título */}
          <View style={[styles.headerSection, { backgroundColor: sectionBg }]}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {t('characters')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textColor }]}>
              {personajes.length} {t('results')}
            </Text>
          </View>

          {/* Lista de personajes */}
          <View style={[styles.section, { backgroundColor: sectionBg }]}>
            {personajes.map(p => (
              <Card
                key={p.id}
                title={p.name}
                darkTheme={darkTheme}
                cardType="personaje"
                cardId={p.id}
                imageUrl={`https://cdn.thesimpsonsapi.com/200/character/${p.id}.webp`}
                subtitle={`${p.species || t('character')} • ${p.gender || t('gender')}`}
                onPress={() =>
                  navigation.navigate('CardDetail', { 
                    type: 'personaje', 
                    data: p 
                  })
                }
              />
            ))}
          </View>

          {/* Cargando más */}
          {loading && page > 1 && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={textColor} />
              <Text style={[styles.loadingMoreText, { color: textColor }]}>
                {t('loading')}
              </Text>
            </View>
          )}

          {/* No más resultados */}
          {!hasMore && personajes.length > 0 && (
            <View style={styles.noMoreContainer}>
              <Text style={[styles.noMoreText, { color: textColor }]}>
                {t('cardsLoaded')}
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  headerSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.8,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingMoreText: {
    marginLeft: 10,
    fontSize: 14,
  },
  noMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default PersonajesScreen;