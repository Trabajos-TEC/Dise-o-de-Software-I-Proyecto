// src/components/cardUtils.ts
import type { CardData, CardType } from './Card';
import { 
  getCharacterById,
  getEpisodeById,
  getLocationById,
  searchAllUnlimited,
  type CharacterApiData,
  type EpisodeApiData,
  type LocationApiData
} from '../services/simpsonsApi';

// Tipos adicionales
export interface SearchResult {
  characters: CardData[];
  episodes: CardData[];
  locations: CardData[];
}

/**
 * Transforma datos de la API al formato de CardData
 */
export const transformToCardData = (
  data: any, 
  type: CardType
): CardData => {
  switch (type) {
    case 'character':
      const charData = data as CharacterApiData;
      return {
        id: charData.id,
        name: charData.name,
        image_path: charData.portrait_path || '',
        type: 'character',
        info1: charData.status || 'Unknown',
        info2: charData.gender || 'Unknown',
        info3: charData.occupation || 'Unknown',
        extraInfo: {
          age: charData.age,
          birthdate: charData.birthdate,
          phrases: charData.phrases || []
        }
      };

    case 'episode':
      const episodeData = data as EpisodeApiData;
      return {
        id: episodeData.id,
        name: episodeData.name,
        image_path: episodeData.image_path || '',
        type: 'episode',
        info1: `Temp ${episodeData.season || '?'}`,
        info2: `Ep ${episodeData.episode_number || '?'}`,
        info3: episodeData.airdate || 'Unknown',
        extraInfo: {
          synopsis: episodeData.synopsis || '',
          season: episodeData.season,
          episode_number: episodeData.episode_number
        }
      };

    case 'location':
      const locationData = data as LocationApiData;
      return {
        id: locationData.id,
        name: locationData.name,
        image_path: locationData.image_path || '',
        type: 'location',
        info1: locationData.town || 'Springfield',
        info2: locationData.use || 'Unknown',
        info3: 'Springfield',
        extraInfo: {
          town: locationData.town,
          use: locationData.use
        }
      };

    default:
      return {
        id: data.id,
        name: data.name,
        image_path: data.image_path || '',
        type: 'character',
        info1: '',
        info2: '',
        info3: ''
      };
  }
};

/**
 * Datos iniciales mínimos (solo id y tipo)
 * Personajes principales de Los Simpson
 */
// cardUtils.ts
export const getInitialCardReferences = (): Array<{id: number, type: CardType}> => {
  // Función para generar IDs aleatorios únicos dentro de un rango
  const generateRandomIds = (count: number, maxId: number): number[] => {
    const ids = new Set<number>();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * maxId) + 1);
    }
    return Array.from(ids);
  };

  // Suponiendo que tienes hasta 600 personajes, 700 episodios, 200 ubicaciones
  // (ajusta estos números según tu base de datos real)
  const characterIds = generateRandomIds(10, 600);   // 10 personajes aleatorios
  const episodeIds = generateRandomIds(10, 700);     // 10 episodios aleatorios
  const locationIds = generateRandomIds(10, 200);    // 10 ubicaciones aleatorias

  const cards: Array<{id: number, type: CardType}> = [];

  // Agregar personajes aleatorios
  characterIds.forEach(id => {
    cards.push({ id, type: 'character' as CardType });
  });

  // Agregar episodios aleatorios
  episodeIds.forEach(id => {
    cards.push({ id, type: 'episode' as CardType });
  });

  // Agregar ubicaciones aleatorias
  locationIds.forEach(id => {
    cards.push({ id, type: 'location' as CardType });
  });

  return cards;
};

/**
 * Carga los datos COMPLETOS de una carta por su ID y tipo
 */
export const loadCardData = async (id: number, type: CardType): Promise<CardData | null> => {
  try {
    console.log(`Cargando carta ${type} con ID: ${id}`);
    
    switch (type) {
      case 'character':
        const charData = await getCharacterById(id);
        console.log(`Personaje cargado:`, charData.name);
        return transformToCardData(charData, 'character');
      
      case 'episode':
        const epData = await getEpisodeById(id);
        console.log(`Episodio cargado:`, epData.name);
        return transformToCardData(epData, 'episode');
      
      case 'location':
        const locData = await getLocationById(id);
        console.log(`Ubicación cargada:`, locData.name);
        return transformToCardData(locData, 'location');
      
      default:
        console.warn(`Tipo de carta desconocido: ${type}`);
        return null;
    }
  } catch (error) {
    console.error(`Error cargando carta ${type} con ID ${id}:`, error);
    
    // Crear una carta de reemplazo temporal si falla
    return {
      id: id,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}`,
      image_path: '',
      type: type,
      info1: 'Cargando...',
      info2: '',
      info3: '',
      extraInfo: {}
    };
  }
};

/**
 * Convierte un array de datos de API a cartas
 */
export const transformApiResponseToCards = (
  apiData: any[], 
  type: CardType
): CardData[] => {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn(`API data no es un array para tipo ${type}:`, apiData);
    return [];
  }
  
  return apiData.map(item => transformToCardData(item, type));
};

/**
 * Filtra cartas por tipo
 */
export const filterCardsByType = (
  cards: CardData[], 
  type: CardType
): CardData[] => {
  return cards.filter(card => card.type === type);
};

/**
 * Agrupa cartas por tipo
 */
export const groupCardsByType = (
  cards: CardData[]
): Record<CardType, CardData[]> => {
  const result = {
    character: [] as CardData[],
    episode: [] as CardData[],
    location: [] as CardData[]
  };
  
  cards.forEach(card => {
    if (card.type === 'character') {
      result.character.push(card);
    } else if (card.type === 'episode') {
      result.episode.push(card);
    } else if (card.type === 'location') {
      result.location.push(card);
    }
  });
  
  return result;
};

/**
 * Busca cartas en la API por término de búsqueda
 */
// En cardUtils.ts - MODIFICA LA FUNCIÓN searchCards
export const searchCards = async (query: string): Promise<SearchResult> => {
  try {
    console.log(`Buscando sin límites: "${query}"`);
    
    // USAR LA NUEVA FUNCIÓN SIN LÍMITES
    const searchResponse = await searchAllUnlimited(query);
    
    // Normalizar el query para búsqueda case-insensitive
    const normalizedQuery = query.toLowerCase().trim();
    
    // Transformar y filtrar
    const filterResults = (items: any[], type: CardType): CardData[] => {
      const transformed = transformApiResponseToCards(items || [], type);
      
      // Filtrar solo los que realmente coinciden con la búsqueda
      return transformed.filter(card => {
        const nameMatch = card.name.toLowerCase().includes(normalizedQuery);
        const info1Match = card.info1?.toLowerCase().includes(normalizedQuery);
        const info2Match = card.info2?.toLowerCase().includes(normalizedQuery);
        const info3Match = card.info3?.toLowerCase().includes(normalizedQuery);
        
        return nameMatch || info1Match || info2Match || info3Match;
      });
    };
    
    const result = {
      characters: filterResults(searchResponse.characters?.results || [], 'character'),
      episodes: filterResults(searchResponse.episodes?.results || [], 'episode'),
      locations: filterResults(searchResponse.locations?.results || [], 'location')
    };
    
    console.log('Resultados finales:', {
      characters: result.characters.length,
      episodes: result.episodes.length,
      locations: result.locations.length
    });
    
    return result;
  } catch (error) {
    console.error('Error buscando cartas:', error);
    return {
      characters: [],
      episodes: [],
      locations: []
    };
  }
};