// src/services/simpsonsApi.ts - VERSIÓN OPTIMIZADA (MÁS RÁPIDA)

const API_BASE_URL = 'https://thesimpsonsapi.com/api';

// Tipos para las respuestas de la API (mantener igual)
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: T[];
}

export interface CharacterApiData {
  id: number;
  age: number;
  birthdate: string;
  gender: string;
  name: string;
  occupation: string;
  portrait_path: string;
  phrases: string[];
  status: string;
}

export interface EpisodeApiData {
  id: number;
  airdate: string;
  episode_number: number;
  image_path: string;
  name: string;
  season: number;
  synopsis: string;
}

export interface LocationApiData {
  id: number;
  name: string;
  image_path: string;
  town: string;
  use: string;
}

// Cache simple para mejorar velocidad
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Función para fetch con cache
 */
const fetchWithCache = async <T>(url: string, cacheKey: string): Promise<T> => {
  const now = Date.now();
  const cached = cache.get(cacheKey);
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`📦 Usando cache para: ${cacheKey}`);
    return cached.data;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    
    // Guardar en cache
    cache.set(cacheKey, { data, timestamp: now });
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// ================================================================
// FUNCIONES EXISTENTES (MANTENER IGUAL)
// ================================================================

/**
 * Obtiene TODOS los personajes paginados
 */
export const getAllCharacters = async (page: number = 1, limit: number = 100): Promise<ApiResponse<CharacterApiData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/characters?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

/**
 * Obtiene un personaje por ID
 */
export const getCharacterById = async (id: number): Promise<CharacterApiData> => {
  try {
    const cacheKey = `character-${id}`;
    const data = await fetchWithCache<any>(`${API_BASE_URL}/characters/${id}`, cacheKey);
    return data.results?.[0] || data;
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene TODOS los episodios paginados
 */
export const getAllEpisodes = async (page: number = 1, limit: number = 100): Promise<ApiResponse<EpisodeApiData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/episodes?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
};

/**
 * Obtiene un episodio por ID
 */
export const getEpisodeById = async (id: number): Promise<EpisodeApiData> => {
  try {
    const cacheKey = `episode-${id}`;
    const data = await fetchWithCache<any>(`${API_BASE_URL}/episodes/${id}`, cacheKey);
    return data.results?.[0] || data;
  } catch (error) {
    console.error(`Error fetching episode ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene TODAS las ubicaciones paginadas
 */
export const getAllLocations = async (page: number = 1, limit: number = 100): Promise<ApiResponse<LocationApiData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

/**
 * Obtiene una ubicación por ID
 */
export const getLocationById = async (id: number): Promise<LocationApiData> => {
  try {
    const cacheKey = `location-${id}`;
    const data = await fetchWithCache<any>(`${API_BASE_URL}/locations/${id}`, cacheKey);
    return data.results?.[0] || data;
  } catch (error) {
    console.error(`Error fetching location ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene TODOS los personajes (SIN LÍMITES)
 */
export const getAllCharactersUnlimited = async (): Promise<CharacterApiData[]> => {
  try {
    let allCharacters: CharacterApiData[] = [];
    let page = 1;
    let hasMore = true;
    
    console.log('Iniciando descarga de TODOS los personajes...');
    
    while (hasMore) {
      console.log(`Obteniendo personajes página ${page}...`);
      const response: ApiResponse<CharacterApiData> = await getAllCharacters(page, 100);
      
      // Si no hay resultados, salir
      if (!response.results || response.results.length === 0) {
        console.log('No hay más personajes');
        break;
      }
      
      allCharacters = [...allCharacters, ...response.results];
      
      // Verificar si hay más páginas
      hasMore = response.next !== null;
      
      // Si estamos en la última página, salir
      if (!hasMore || page >= response.pages) {
        console.log(`Última página alcanzada. Total páginas: ${response.pages}`);
        break;
      }
      
      page++;
      
      // Pequeña pausa para no sobrecargar la API (reducida a 30ms)
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    console.log(`✅ Total personajes obtenidos: ${allCharacters.length}`);
    return allCharacters;
  } catch (error) {
    console.error('Error fetching all characters:', error);
    return [];
  }
};

/**
 * Obtiene TODOS los episodios (SIN LÍMITES)
 */
export const getAllEpisodesUnlimited = async (): Promise<EpisodeApiData[]> => {
  try {
    let allEpisodes: EpisodeApiData[] = [];
    let page = 1;
    let hasMore = true;
    
    console.log('Iniciando descarga de TODOS los episodios...');
    
    while (hasMore) {
      console.log(`Obteniendo episodios página ${page}...`);
      const response: ApiResponse<EpisodeApiData> = await getAllEpisodes(page, 100);
      
      if (!response.results || response.results.length === 0) {
        console.log('No hay más episodios');
        break;
      }
      
      allEpisodes = [...allEpisodes, ...response.results];
      hasMore = response.next !== null;
      
      if (!hasMore || page >= response.pages) {
        console.log(`Última página alcanzada. Total páginas: ${response.pages}`);
        break;
      }
      
      page++;
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    console.log(`✅ Total episodios obtenidos: ${allEpisodes.length}`);
    return allEpisodes;
  } catch (error) {
    console.error('Error fetching all episodes:', error);
    return [];
  }
};

/**
 * Obtiene TODAS las ubicaciones (SIN LÍMITES)
 */
export const getAllLocationsUnlimited = async (): Promise<LocationApiData[]> => {
  try {
    let allLocations: LocationApiData[] = [];
    let page = 1;
    let hasMore = true;
    
    console.log('Iniciando descarga de TODAS las ubicaciones...');
    
    while (hasMore) {
      console.log(`Obteniendo ubicaciones página ${page}...`);
      const response: ApiResponse<LocationApiData> = await getAllLocations(page, 100);
      
      if (!response.results || response.results.length === 0) {
        console.log('No hay más ubicaciones');
        break;
      }
      
      allLocations = [...allLocations, ...response.results];
      hasMore = response.next !== null;
      
      if (!hasMore || page >= response.pages) {
        console.log(`Última página alcanzada. Total páginas: ${response.pages}`);
        break;
      }
      
      page++;
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    console.log(`✅ Total ubicaciones obtenidas: ${allLocations.length}`);
    return allLocations;
  } catch (error) {
    console.error('Error fetching all locations:', error);
    return [];
  }
};

/**
 * Búsqueda general en toda la API - VERSIÓN OPTIMIZADA (MÁS RÁPIDA)
 */
export const searchAll = async (query: string, page: number = 1, limit: number = 100): Promise<{
  characters: ApiResponse<CharacterApiData>;
  episodes: ApiResponse<EpisodeApiData>;
  locations: ApiResponse<LocationApiData>;
}> => {
  const startTime = Date.now();
  
  try {
    // Si el query está vacío, devolver arrays vacíos
    if (!query || query.trim() === '') {
      return {
        characters: { count: 0, next: null, prev: null, pages: 0, results: [] },
        episodes: { count: 0, next: null, prev: null, pages: 0, results: [] },
        locations: { count: 0, next: null, prev: null, pages: 0, results: [] }
      };
    }
    
    const searchLower = encodeURIComponent(query.trim().toLowerCase());
    console.log(`🚀 Búsqueda rápida: "${query}"`);
    
    // Usar límites más altos para obtener hasta ~700 resultados
    // 400 personajes + 200 episodios + 100 ubicaciones = 700 total
    // Pero mantener la interfaz igual usando el parámetro limit
    const actualLimit = Math.max(limit, 100); // Mínimo 100 para ser rápido
    
    const [characters, episodes, locations] = await Promise.allSettled([
      // Personajes - más resultados
      fetchWithCache<ApiResponse<CharacterApiData>>(
        `${API_BASE_URL}/characters?search=${searchLower}&page=${page}&limit=${actualLimit * 4}`, // x4 para más personajes
        `search-characters-${searchLower}-${page}-${actualLimit}`
      ),
      
      // Episodios
      fetchWithCache<ApiResponse<EpisodeApiData>>(
        `${API_BASE_URL}/episodes?search=${searchLower}&page=${page}&limit=${actualLimit * 2}`, // x2 para episodios
        `search-episodes-${searchLower}-${page}-${actualLimit}`
      ),
      
      // Ubicaciones
      fetchWithCache<ApiResponse<LocationApiData>>(
        `${API_BASE_URL}/locations?search=${searchLower}&page=${page}&limit=${actualLimit}`,
        `search-locations-${searchLower}-${page}-${actualLimit}`
      )
    ]);
    
    // Procesar resultados manteniendo la misma estructura
    const charactersResult = characters.status === 'fulfilled' 
      ? characters.value 
      : { count: 0, next: null, prev: null, pages: 0, results: [] };
    
    const episodesResult = episodes.status === 'fulfilled'
      ? episodes.value
      : { count: 0, next: null, prev: null, pages: 0, results: [] };
    
    const locationsResult = locations.status === 'fulfilled'
      ? locations.value
      : { count: 0, next: null, prev: null, pages: 0, results: [] };
    
    const endTime = Date.now();
    console.log(`✅ Búsqueda completada en ${endTime - startTime}ms`);
    console.log(`📊 Resultados obtenidos: P:${charactersResult.results.length}, E:${episodesResult.results.length}, L:${locationsResult.results.length}`);
    
    return {
      characters: {
        count: charactersResult.count,
        next: charactersResult.next,
        prev: charactersResult.prev,
        pages: charactersResult.pages,
        results: charactersResult.results.slice(0, limit) // Cortar al límite original
      },
      episodes: {
        count: episodesResult.count,
        next: episodesResult.next,
        prev: episodesResult.prev,
        pages: episodesResult.pages,
        results: episodesResult.results.slice(0, limit) // Cortar al límite original
      },
      locations: {
        count: locationsResult.count,
        next: locationsResult.next,
        prev: locationsResult.prev,
        pages: locationsResult.pages,
        results: locationsResult.results.slice(0, limit) // Cortar al límite original
      }
    };
    
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return {
      characters: { count: 0, next: null, prev: null, pages: 0, results: [] },
      episodes: { count: 0, next: null, prev: null, pages: 0, results: [] },
      locations: { count: 0, next: null, prev: null, pages: 0, results: [] }
    };
  }
};

/**
 * Búsqueda general SIN LÍMITES (obtiene todos los datos primero, luego filtra)
 */
export const searchAllUnlimited = async (query: string): Promise<{
  characters: ApiResponse<CharacterApiData>;
  episodes: ApiResponse<EpisodeApiData>;
  locations: ApiResponse<LocationApiData>;
}> => {
  try {
    // Si el query está vacío, devolver arrays vacíos
    if (!query || query.trim() === '') {
      return {
        characters: { count: 0, next: null, prev: null, pages: 1, results: [] },
        episodes: { count: 0, next: null, prev: null, pages: 1, results: [] },
        locations: { count: 0, next: null, prev: null, pages: 1, results: [] }
      };
    }
    
    const searchLower = query.toLowerCase().trim();
    
    console.log(`🔍 Buscando: "${query}" (${searchLower})`);
    
    // Obtener TODOS los datos primero
    const [allCharacters, allEpisodes, allLocations] = await Promise.all([
      getAllCharactersUnlimited(),
      getAllEpisodesUnlimited(),
      getAllLocationsUnlimited()
    ]);
    
    console.log('📊 Total datos obtenidos para búsqueda:', {
      characters: allCharacters.length,
      episodes: allEpisodes.length,
      locations: allLocations.length
    });
    
    // Filtrar localmente por el query
    const filterCharacters = allCharacters.filter(char => {
      const nameMatch = char.name?.toLowerCase().includes(searchLower);
      const occupationMatch = char.occupation?.toLowerCase().includes(searchLower);
      const phraseMatch = char.phrases?.some(phrase => 
        phrase.toLowerCase().includes(searchLower)
      );
      const genderMatch = char.gender?.toLowerCase().includes(searchLower);
      const statusMatch = char.status?.toLowerCase().includes(searchLower);
      
      return nameMatch || occupationMatch || phraseMatch || genderMatch || statusMatch;
    });
    
    const filterEpisodes = allEpisodes.filter(ep => {
      const nameMatch = ep.name?.toLowerCase().includes(searchLower);
      const synopsisMatch = ep.synopsis?.toLowerCase().includes(searchLower);
      
      return nameMatch || synopsisMatch;
    });
    
    const filterLocations = allLocations.filter(loc => {
      const nameMatch = loc.name?.toLowerCase().includes(searchLower);
      const townMatch = loc.town?.toLowerCase().includes(searchLower);
      const useMatch = loc.use?.toLowerCase().includes(searchLower);
      
      return nameMatch || townMatch || useMatch;
    });
    
    console.log('🎯 Resultados filtrados:', {
      characters: filterCharacters.length,
      episodes: filterEpisodes.length,
      locations: filterLocations.length
    });
    
    return {
      characters: {
        count: filterCharacters.length,
        next: null,
        prev: null,
        pages: 1,
        results: filterCharacters
      },
      episodes: {
        count: filterEpisodes.length,
        next: null,
        prev: null,
        pages: 1,
        results: filterEpisodes
      },
      locations: {
        count: filterLocations.length,
        next: null,
        prev: null,
        pages: 1,
        results: filterLocations
      }
    };
  } catch (error) {
    console.error('Error in searchAllUnlimited:', error);
    // Devolver resultados vacíos en caso de error
    return {
      characters: { count: 0, next: null, prev: null, pages: 1, results: [] },
      episodes: { count: 0, next: null, prev: null, pages: 1, results: [] },
      locations: { count: 0, next: null, prev: null, pages: 1, results: [] }
    };
  }
};

/**
 * NUEVO: Búsqueda rápida usando la API con paginación (para búsquedas más eficientes)
 */
export const searchWithPagination = async (
  query: string, 
  page: number = 1, 
  limit: number = 100
): Promise<{
  characters: ApiResponse<CharacterApiData>;
  episodes: ApiResponse<EpisodeApiData>;
  locations: ApiResponse<LocationApiData>;
  totalResults: number;
}> => {
  const results = await searchAll(query, page, limit);
  
  return {
    ...results,
    totalResults: 
      results.characters.count + 
      results.episodes.count + 
      results.locations.count
  };
};

