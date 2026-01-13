import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView,
  ImageBackground
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useLanguage } from '../context/LanguageContext'; // Importar useLanguage

// Define las props del componente
interface CardDetailProps {
  darkTheme?: boolean;
}

const CardDetail: React.FC<CardDetailProps> = ({ darkTheme = false }) => {
  const route = useRoute();
  const params = route.params as RootStackParamList['CardDetail'];
  const { t } = useLanguage(); // Obtener la función de traducción
  
  if (!params) {
    return (
      <View style={styles.errorContainer}>
        <Text>{t('cardNotFound')}</Text>
      </View>
    );
  }
  
  const { type, data } = params;

  // Fondo PNG según tema (igual que HomeScreen)
  const backgroundImage = darkTheme 
    ? require('../assets/simpsons_nubes_noche.png')
    : require('../assets/simpsons_nubes_dia.png');

  // Colores según tema (igual que HomeScreen)
  const textColor = darkTheme ? '#E0E0FF' : '#2C3E50';
  const sectionBg = darkTheme ? 'rgba(45, 27, 105, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const labelColor = darkTheme ? '#B8B8FF' : '#666';
  const valueColor = darkTheme ? '#E0E0FF' : '#333';

  // Función para construir URL de imagen según tipo y id
  const getImageUrl = () => {
    if (!data.id) return null;
    if (type === 'personaje') return `https://cdn.thesimpsonsapi.com/500/character/${data.id}.webp`;
    if (type === 'episodio') return `https://cdn.thesimpsonsapi.com/500/episode/${data.id}.webp`;
    if (type === 'ubicacion') return `https://cdn.thesimpsonsapi.com/500/location/${data.id}.webp`;
    return null;
  };

  const imageUrl = getImageUrl();

  // Renderizar detalles según el tipo
  const renderDetails = () => {
    switch (type) {
      case 'personaje':
        return (
          <>
            <DetailItem 
              label={t('status')}
              value={data.status || t('noDataAvailable')}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label={t('gender')}
              value={data.gender || t('noDataAvailable')}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label={t('birthdate')}
              value={data.birthdate || t('noDataAvailable')}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label="ID"
              value={data.id.toString()}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            {data.occupation && (
              <DetailItem 
                label={t('occupation')}
                value={data.occupation}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
            {data.age && (
              <DetailItem 
                label={t('age')}
                value={`${data.age} ${t('characterAgeYears')}`}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
            {data.species && (
              <DetailItem 
                label={t('character')}
                value={data.species}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
          </>
        );

      case 'episodio':
        return (
          <>
            <DetailItem 
              label={t('episodeSeason')}
              value={data.season?.toString() || t('noDataAvailable')}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label={t('episodeNumber')}
              value={data.episode_number?.toString() || data.episode?.toString() || t('noDataAvailable')}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label={t('episodeAired')}
              value={data.airdate || t('noDataAvailable')}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label="ID"
              value={data.id.toString()}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            {data.description && (
              <DetailItem 
                label={t('synopsis')}
                value={data.description}
                labelColor={labelColor}
                valueColor={valueColor}
                multiline
              />
            )}
            {data.director && (
              <DetailItem 
                label={t('character')}
                value={data.director}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
          </>
        );

      case 'ubicacion':
        return (
          <>
            <DetailItem 
              label="ID"
              value={data.id.toString()}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label={t('location')}
              value={data.name}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <DetailItem 
              label={t('locationDescription')}
              value={data.description || t('noDataAvailable')}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            {data.town && (
              <DetailItem 
                label={t('town')}
                value={data.town}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
            {data.type && (
              <DetailItem 
                label={t('location')}
                value={data.type}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
            {data.use && (
              <DetailItem 
                label={t('use')}
                value={data.use}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
            {data.dimension && (
              <DetailItem 
                label={t('location')}
                value={data.dimension}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
            {data.first_appearance_ep_id && (
              <DetailItem 
                label={t('episode')}
                value={data.first_appearance_ep_id.toString()}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

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
        {/* Overlay semitransparente para legibilidad (igual que HomeScreen) */}
        <View style={styles.overlay} />
        
        {/* Contenido */}
        <View style={styles.content}>
          {/* Tarjeta con los detalles */}
          <View style={[styles.card, { backgroundColor: sectionBg }]}>
            <Text style={[styles.title, { color: textColor }]}>{data.name}</Text>

            {/* Subtítulo según tipo */}
            {type === 'personaje' && data.species && (
              <Text style={[styles.subtitle, { color: labelColor }]}>
                {data.species} • {data.gender || t('gender')}
              </Text>
            )}
            
            {type === 'episodio' && data.season && (
              <Text style={[styles.subtitle, { color: labelColor }]}>
                {t('episodeSeason')} {data.season} • {t('episodeNumber')} {data.episode_number || data.episode || '?'}
              </Text>
            )}
            
            {type === 'ubicacion' && data.type && (
              <Text style={[styles.subtitle, { color: labelColor }]}>
                {data.type} • {data.town || t('town')}
              </Text>
            )}

            {imageUrl && (
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.image} 
                resizeMode="contain"
                onError={() => {
                  console.log('Error cargando imagen:', imageUrl);
                }}
              />
            )}

            {/* Imagen de placeholder si no hay imagen */}
            {!imageUrl && (
              <View style={[styles.noImageContainer, { backgroundColor: darkTheme ? 'rgba(28, 16, 68, 0.5)' : 'rgba(240, 240, 240, 0.5)' }]}>
                <Text style={[styles.noImageText, { color: labelColor }]}>
                  {type === 'personaje' ? '👤' : type === 'episodio' ? '🎬' : '📍'}
                </Text>
                <Text style={[styles.noImageLabel, { color: labelColor }]}>
                  {type === 'personaje' ? t('character') : 
                   type === 'episodio' ? t('episode') : 
                   t('location')}
                </Text>
              </View>
            )}

            {/* Detalles */}
            <View style={styles.detailsContainer}>
              {renderDetails()}
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

// Componente para items de detalle
const DetailItem = ({ 
  label, 
  value, 
  labelColor, 
  valueColor,
  multiline = false 
}: { 
  label: string; 
  value: string | number; 
  labelColor: string;
  valueColor: string;
  multiline?: boolean;
}) => (
  <View style={styles.detailItem}>
    <Text style={[styles.detailLabel, { color: labelColor, fontWeight: '600' }]}>
      {label}:
    </Text>
    <Text 
      style={[
        styles.detailValue, 
        { color: valueColor },
        multiline && styles.multilineText
      ]}
      numberOfLines={multiline ? undefined : 2}
    >
      {value}
    </Text>
  </View>
);

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
  card: {
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  noImageContainer: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 60,
    marginBottom: 10,
  },
  noImageLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 16,
    width: 120,
    paddingRight: 10,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  multilineText: {
    flex: 1,
    flexWrap: 'wrap',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default CardDetail;