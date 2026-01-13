// screens/EpisodiosScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  ActivityIndicator, 
  Text, 
  ImageBackground,
  StyleSheet 
} from 'react-native';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../context/LanguageContext';

const API_BASE = 'https://thesimpsonsapi.com/api/episodes';

interface EpisodiosScreenProps {
  darkTheme?: boolean;
}

type Episodio = {
  id: number;
  name: string;
  season: number;
  episode_number?: number;
  episode?: number;
  airdate?: string;
  description?: string;
};

const EpisodiosScreen: React.FC<EpisodiosScreenProps> = ({ darkTheme = false }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
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
    fetchEpisodios();
  }, [page]);

  const fetchEpisodios = async () => {
    try {
      const response = await fetch(`${API_BASE}?page=${page}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        if (page === 1) {
          setEpisodios(data.results);
        } else {
          setEpisodios(prev => [...prev, ...data.results]);
        }
        
        setHasMore(page < (data.pages || 1));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching episodios:', error);
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
            {t('loadingEpisodes')}
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
              {t('episodes')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: textColor }]}>
              {episodios.length} {t('results')}
            </Text>
          </View>

          {/* Lista de episodios */}
          <View style={[styles.section, { backgroundColor: sectionBg }]}>
            {episodios.map(ep => (
              <Card
                key={ep.id}
                title={ep.name}
                darkTheme={darkTheme}
                cardType="episodio"
                cardId={ep.id}
                imageUrl={`https://cdn.thesimpsonsapi.com/200/episode/${ep.id}.webp`}
                subtitle={`${t('episodeSeason')} ${ep.season} • ${t('episodeNumber')} ${ep.episode_number || ep.episode || '?'}`}
                onPress={() =>
                  navigation.navigate('CardDetail', { 
                    type: 'episodio', 
                    data: ep 
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
          {!hasMore && episodios.length > 0 && (
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

export default EpisodiosScreen;