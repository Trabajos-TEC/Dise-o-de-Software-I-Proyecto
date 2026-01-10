// src/components/cardUtils.ts
import type { CardData, CardType } from './Card';
import { 
  getCharacterById,
  getEpisodeById,
  getLocationById,
  searchAll,
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
export const getInitialCardReferences = (): Array<{id: number, type: CardType}> => {
  return [
    // ============ PERSONAJES (10 ejemplos) ============
    { id: 1, type: 'character' as CardType },   // Homer Simpson
    { id: 2, type: 'character' as CardType },   // Marge Simpson
    { id: 3, type: 'character' as CardType },   // Bart Simpson
    { id: 4, type: 'character' as CardType },   // Lisa Simpson
    { id: 5, type: 'character' as CardType },   // Maggie Simpson
    { id: 6, type: 'character' as CardType },   // Abraham "Abe" Simpson
    { id: 7, type: 'character' as CardType },   // Krusty the Clown
    { id: 8, type: 'character' as CardType },   // Milhouse Van Houten
    { id: 9, type: 'character' as CardType },   // Ned Flanders
    { id: 10, type: 'character' as CardType },  // Montgomery Burns
    
    // ============ EPISODIOS (10 ejemplos) ============
    { id: 1, type: 'episode' as CardType },     // Simpsons Roasting on an Open Fire
    { id: 2, type: 'episode' as CardType },     // Bart the Genius
    { id: 3, type: 'episode' as CardType },     // Homer's Odyssey
    { id: 4, type: 'episode' as CardType },     // There's No Disgrace Like Home
    { id: 5, type: 'episode' as CardType },     // Bart the General
    { id: 6, type: 'episode' as CardType },     // Moaning Lisa
    { id: 7, type: 'episode' as CardType },     // The Call of the Simpsons
    { id: 8, type: 'episode' as CardType },     // The Telltale Head
    { id: 9, type: 'episode' as CardType },     // Life on the Fast Lane
    { id: 10, type: 'episode' as CardType },    // Homer's Night Out
    
    // ============ UBICACIONES (10 ejemplos) ============
    { id: 1, type: 'location' as CardType },    // 742 Evergreen Terrace
    { id: 2, type: 'location' as CardType },    // Springfield Nuclear Power Plant
    { id: 3, type: 'location' as CardType },    // Kwik-E-Mart
    { id: 4, type: 'location' as CardType },    // Springfield Elementary School
    { id: 5, type: 'location' as CardType },    // Moe's Tavern
    { id: 6, type: 'location' as CardType },    // Krusty Burger
    { id: 7, type: 'location' as CardType },    // The Android's Dungeon
    { id: 8, type: 'location' as CardType },    // Springfield Retirement Castle
    { id: 9, type: 'location' as CardType },    // Springfield Town Hall
    { id: 10, type: 'location' as CardType },   // Springfield Police Station
  ];
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
export const searchCards = async (query: string): Promise<SearchResult> => {
  try {
    console.log(`Buscando: "${query}"`);
    
    const searchResponse = await searchAll(query, 1, 20);
    
    // Normalizar el query para búsqueda case-insensitive
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filtrar los resultados para asegurar que coincidan con la búsqueda
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
    
    return {
      characters: filterResults(searchResponse.characters?.results || [], 'character'),
      episodes: filterResults(searchResponse.episodes?.results || [], 'episode'),
      locations: filterResults(searchResponse.locations?.results || [], 'location')
    };
  } catch (error) {
    console.error('Error buscando cartas:', error);
    return {
      characters: [],
      episodes: [],
      locations: []
    };
  }
};