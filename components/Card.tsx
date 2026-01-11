import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

/* =======================
   TYPES
======================= */
export type CardType = 'character' | 'episode' | 'location';

export interface CardData {
  id: number;
  name: string;
  image_path: string;
  type: CardType;
  info1?: string;
  info2?: string;
  info3?: string;
  extraInfo?: Record<string, any>;
  gender?: string;
  season?: number;
}

interface CardProps {
  data: CardData;
  size?: 'small' | 'medium' | 'large';
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  variant?: 'preview' | 'detail';
}

/* =======================
   COMPONENT
======================= */
const Card: React.FC<CardProps> = ({
  data,
  size = 'medium',
  showFavoriteButton = false,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  variant = 'preview',
}) => {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  const handlePress = () => {
    if (variant === 'preview' && onClick) {
      onClick();
    } else {
      setIsFlipped(prev => !prev);
    }
  };

  const handleFavoritePress = () => {
    if (!onFavoriteToggle) return;

    const next = !localIsFavorite;
    setLocalIsFavorite(next);
    onFavoriteToggle();

    Alert.alert(
      next ? 'Favoritos' : 'Favoritos',
      next ? 'Añadido a favoritos' : 'Eliminado de favoritos'
    );
  };

  const getImageUrl = () =>
    `https://cdn.thesimpsonsapi.com/200/${data.type}/${data.id}.webp`;

  const getLabels = (): string[] => {
    switch (data.type) {
      case 'character':
        return ['Status', 'Gender', 'Occupation'];
      case 'episode':
        return ['Season', 'Episode', 'Air Date'];
      case 'location':
        return ['City', 'Type', 'Use'];
      default:
        return ['Info 1', 'Info 2', 'Info 3'];
    }
  };

  const labels = getLabels();

  const infoItems = [
    data.info1 && { label: labels[0], value: data.info1 },
    data.info2 && { label: labels[1], value: data.info2 },
    data.info3 && { label: labels[2], value: data.info3 },
  ].filter(Boolean).slice(0, 3) as { label: string; value: string }[];

  return (
    <View style={[styles.wrapper, styles[size]]}>
      <Pressable onPress={handlePress} style={styles.card}>
        {!isFlipped ? (
          /* ---------- FRONT ---------- */
          <View style={styles.face}>
            <Text style={styles.id}>#{data.id}</Text>

            <Image
              source={{ uri: getImageUrl() }}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>{data.name}</Text>
          </View>
        ) : (
          /* ---------- BACK ---------- */
          <View style={styles.face}>
            <Text style={styles.title}>{data.name}</Text>

            {infoItems.map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}:</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}

            <Text style={styles.hint}>
              {variant === 'detail'
                ? 'Toca para volver a la imagen'
                : isFlipped
                ? t('cardClickForImage') ?? 'Toca para imagen'
                : t('cardClickForInfo') ?? 'Toca para info'}
            </Text>
          </View>
        )}
      </Pressable>

      {/* ---------- ACTIONS ---------- */}
      {variant === 'preview' && (
        <View style={styles.actions}>
          <Pressable onPress={onClick} style={styles.actionBtn}>
            <Text>👁</Text>
          </Pressable>

          {showFavoriteButton && (
            <Pressable onPress={handleFavoritePress} style={styles.actionBtn}>
              <Text style={{ fontSize: 18 }}>
                {localIsFavorite ? '★' : '☆'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default Card;

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },
  card: {
    width: 220,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    padding: 12,
  },
  face: {
    alignItems: 'center',
  },
  id: {
    fontSize: 12,
    alignSelf: 'flex-start',
    color: '#666',
  },
  image: {
    width: 180,
    height: 180,
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  infoValue: {
    flexShrink: 1,
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 12,
  },
  actionBtn: {
    padding: 6,
  },
  small: {
    transform: [{ scale: 0.9 }],
  },
  medium: {
    transform: [{ scale: 1 }],
  },
  large: {
    transform: [{ scale: 1.1 }],
  },
});
