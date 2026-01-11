// src/components/CardDetail.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { auth, db } from '../firebaseConfig';
import Card, { CardData } from './Card';

const CardDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const cardData = (route.params as any)?.cardData as CardData | undefined;
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useLanguage();

  const handleFavoriteToggle = async () => {
    const user = auth.currentUser;
    if (!user || !cardData) {
      console.warn('No hay usuario o carta');
      return;
    }

    const favoriteId = `${cardData.type}-${cardData.id}`;
    const favRef = doc(db, 'users', user.uid, 'favorites', favoriteId);

    try {
      const snapshot = await getDoc(favRef);
      if (snapshot.exists()) {
        await deleteDoc(favRef);
        setIsFavorite(false);
        Alert.alert('Favoritos', 'Se eliminó de favoritos');
      } else {
        await setDoc(favRef, { ...cardData, createdAt: new Date() });
        setIsFavorite(true);
        Alert.alert('Favoritos', 'Se agregó a favoritos');
      }
    } catch (error) {
      console.error('Error manejando favoritos:', error);
    }
  };

  const handleCardClickInDetail = () => {
    console.log('Carta clickeada en modo detalle');
  };

  if (!cardData) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Carta no encontrada</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text>← {t('goBack') ?? 'Volver'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text>← {t('goBack') ?? 'Volver'}</Text>
      </Pressable>

      <View style={styles.content}>
        {/* Carta a la izquierda */}
        <View style={styles.left}>
          <Card
            data={cardData}
            size="medium"
            flipOnHover={true}
            variant="detail"
            showFavoriteButton={true}
            isFavorite={isFavorite}
            onFavoriteToggle={handleFavoriteToggle}
            onClick={handleCardClickInDetail}
          />
        </View>

        {/* Información a la derecha */}
        <View style={styles.right}>
          <Text style={styles.title}>{cardData.name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{cardData.type}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información de la carta</Text>
            <View style={styles.infoPlaceholder}>
              <Text>ID: {cardData.id}</Text>
              <Text>Tipo: {cardData.type}</Text>
              <Text>Imagen: {cardData.image_path}</Text>

              {cardData.info1 && <Text>Status: {cardData.info1}</Text>}
              {cardData.info2 && <Text>Gender: {cardData.info2}</Text>}
              {cardData.info3 && <Text>Occupation: {cardData.info3}</Text>}

              <View style={styles.apiNotice}>
                <Text style={styles.apiTitle}>Información de la API</Text>
                <Text>La información detallada se cargará aquí desde la API:</Text>
                <Text>• Estadísticas completas</Text>
                <Text>• Historial de apariciones</Text>
                <Text>• Datos exclusivos</Text>
                <Text>
                  • Información específica del {cardData.type}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.actionButton}>
              <Text>Compartir</Text>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={handleFavoriteToggle}
            >
              <Text>Agregar a colección</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CardDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  backButton: {
    marginVertical: 8,
  },
  notFound: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  left: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flex: 2,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  typeBadge: {
    backgroundColor: '#eee',
    padding: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  typeText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  infoSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoPlaceholder: {
    marginBottom: 8,
  },
  apiNotice: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  apiTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
});
