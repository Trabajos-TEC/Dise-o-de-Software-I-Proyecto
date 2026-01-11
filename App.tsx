// App.tsx - HOME (Expo / React Native)
import { useNavigation } from '@react-navigation/native';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Card, { CardData } from './components/Card';
import {
    getInitialCardReferences,
    groupCardsByType,
    loadCardData,
} from './components/cardUtils';
import { useLanguage } from './context/LanguageContext';
import { auth, db } from './firebaseConfig';

const App: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const [initialCards, setInitialCards] = useState<CardData[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  /* ================= FAVORITOS ================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = collection(db, 'users', user.uid, 'favorites');

    const unsubscribe = onSnapshot(favRef, snapshot => {
      const ids = new Set<string>();
      snapshot.forEach(doc => ids.add(doc.id));
      setFavorites(ids);
    });

    return unsubscribe;
  }, []);

  /* ================= CARGA INICIAL ================= */
  useEffect(() => {
    const loadInitialCards = async () => {
      setLoadingInitial(true);
      try {
        const refs = getInitialCardReferences();
        const cards = await Promise.all(
          refs.map(ref => loadCardData(ref.id, ref.type))
        );
        setInitialCards(cards.filter(Boolean) as CardData[]);
      } catch (error) {
        console.error('Error loading cards:', error);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadInitialCards();
  }, []);

  const grouped = groupCardsByType(initialCards);

  /* ================= HANDLERS ================= */
  const handleCardClick = (card: CardData) => {
    navigation.navigate('CardDetail', { cardData: card });
  };

  const handleFavoriteToggle = async (card: CardData) => {
    const user = auth.currentUser;
    if (!user) return;

    const id = `${card.type}-${card.id}`;
    const favRef = doc(db, 'users', user.uid, 'favorites', id);

    setFavorites(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });

    try {
      favorites.has(id)
        ? await deleteDoc(favRef)
        : await setDoc(favRef, card);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SECCIÓN ================= */
  const renderSection = (
    title: string,
    cards: CardData[],
    loadingText: string,
    emptyText: string
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {loadingInitial ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text>{loadingText}</Text>
        </View>
      ) : cards.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cards.map(card => {
            const favId = `${card.type}-${card.id}`;
            return (
                <Card
                key={favId}
                data={card}
                size="medium"
                variant="preview"
                showFavoriteButton
                isFavorite={favorites.has(favId)}
                onFavoriteToggle={() => handleFavoriteToggle(card)}
                onClick={() => handleCardClick(card)}
                />

            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noData}>{emptyText}</Text>
      )}
    </View>
  );

  /* ================= RENDER ================= */
  return (
    <ScrollView style={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image
          source={require('./assets/images/logo.png')} // poné el logo acá
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('appTitle')}</Text>
        <Text style={styles.subtitle}>{t('welcomeMessage')}</Text>
      </View>

      {renderSection(
        t('characters'),
        grouped.character,
        t('loadingCharacters'),
        t('noCharactersAvailable')
      )}

      {renderSection(
        t('locations'),
        grouped.location,
        t('loadingLocations'),
        t('noLocationsAvailable')
      )}

      {renderSection(
        t('episodes'),
        grouped.episode,
        t('loadingEpisodes'),
        t('noEpisodesAvailable')
      )}
    </ScrollView>
  );
};

export default App;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loading: {
    alignItems: 'center',
    gap: 8,
  },
  noData: {
    textAlign: 'center',
    opacity: 0.6,
  },
});
