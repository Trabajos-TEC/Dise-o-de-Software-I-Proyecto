// components/Card.tsx
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image 
} from 'react-native';
import { getGlobalStyles } from '../styles/global';

interface CardProps {
  title: string;
  onPress: () => void;
  darkTheme?: boolean;
  subtitle?: string;
  icon?: React.ReactNode;
  // Nuevas props para parecerse más a la web
  cardType?: 'personaje' | 'episodio' | 'ubicacion';
  cardId?: number;
  imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  onPress, 
  darkTheme = false,
  subtitle,
  icon,
  cardType = 'personaje',
  cardId,
  imageUrl
}) => {
  const globalStyles = getGlobalStyles(darkTheme);
  const { theme, spacing } = globalStyles;
  
  // Determinar color de borde según el tipo (igual que en web)
  const getBorderColor = () => {
    switch (cardType) {
      case 'personaje':
        return darkTheme ? '#4CAF50' : '#2E7D32'; // Verde
      case 'episodio':
        return darkTheme ? '#2196F3' : '#1565C0'; // Azul
      case 'ubicacion':
        return darkTheme ? '#FF9800' : '#EF6C00'; // Naranja
      default:
        return darkTheme ? '#FFD700' : '#FFD700'; // Amarillo Simpson por defecto
    }
  };

  // Si hay imagen, mostrar diseño tipo tarjeta web
  if (imageUrl && cardId) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        style={[
          styles.cardWithImage,
          { 
            backgroundColor: theme.cardBg || '#f8f9fa',
            borderColor: getBorderColor(),
            shadowColor: theme.shadow || '#000',
          }
        ]}
        activeOpacity={0.7}
      >
        {/* Número de carta en esquina (como en web) */}
        {cardId && (
          <View style={[
            styles.cardNumber,
            { backgroundColor: getBorderColor() }
          ]}>
            <Text style={styles.cardNumberText}>#{cardId}</Text>
          </View>
        )}

        {/* Contenedor de imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => {
              // Si la imagen falla, mostrar un placeholder
              console.log('Error cargando imagen:', imageUrl);
            }}
          />
        </View>

        {/* Contenido textual */}
        <View style={styles.contentWithImage}>
          <Text style={[
            styles.titleWithImage, 
            { color: theme.text || '#212529' }
          ]}>
            {title}
          </Text>
          
          {subtitle && (
            <Text style={[
              styles.subtitleWithImage, 
              { color: theme.textLight || '#6c757d' }
            ]}>
              {subtitle}
            </Text>
          )}

          {/* Información adicional según tipo */}
          <View style={styles.infoRow}>
            <Text style={[
              styles.typeBadge,
              { 
                backgroundColor: getBorderColor() + '20', // 20% de opacidad
                color: getBorderColor()
              }
            ]}>
              {cardType === 'personaje' ? 'Personaje' : 
               cardType === 'episodio' ? 'Episodio' : 'Ubicación'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Versión simple (sin imagen) - mantener compatibilidad
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.card,
        { 
          backgroundColor: theme.cardBg || '#f8f9fa',
          borderColor: getBorderColor(),
          shadowColor: theme.shadow || '#000',
        }
      ]}
      activeOpacity={0.7}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text || '#212529' }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textLight || '#6c757d' }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Estilos para tarjeta con imagen (nuevo diseño)
  cardWithImage: {
    borderRadius: 16,
    borderWidth: 3,
    marginVertical: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardNumber: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  cardNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentWithImage: {
    padding: 16,
  },
  titleWithImage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleWithImage: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
  },

  // Estilos originales (para compatibilidad)
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default Card;