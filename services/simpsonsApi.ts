// src/services/simpsonsApi.ts

const API_BASE_URL = 'https://thesimpsonsapi.com/api';

// Tipos para las respuestas de la API
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

/**
 * Obtiene TODOS los personajes paginados
 */
export const getAllCharacters = async (page: number = 1, limit: number = 20): Promise<ApiResponse<CharacterApiData>> => {
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
    const response = await fetch(`${API_BASE_URL}/characters/${id}`);
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    const data = await response.json();
    return data.results?.[0] || data;
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene TODOS los episodios paginados
 */
export const getAllEpisodes = async (page: number = 1, limit: number = 20): Promise<ApiResponse<EpisodeApiData>> => {
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
    const response = await fetch(`${API_BASE_URL}/episodes/${id}`);
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    const data = await response.json();
    return data.results?.[0] || data;
  } catch (error) {
    console.error(`Error fetching episode ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene TODAS las ubicaciones paginadas
 */
export const getAllLocations = async (page: number = 1, limit: number = 20): Promise<ApiResponse<LocationApiData>> => {
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
    const response = await fetch(`${API_BASE_URL}/locations/${id}`);
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    const data = await response.json();
    return data.results?.[0] || data;
  } catch (error) {
    console.error(`Error fetching location ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene TODOS los personajes (sin límite)
 */
export const getAllCharactersUnlimited = async (): Promise<CharacterApiData[]> => {
  try {
    let allCharacters: CharacterApiData[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response: ApiResponse<CharacterApiData> = await getAllCharacters(page, 100); // 100 por página
      allCharacters = [...allCharacters, ...response.results];
      
      // Verificar si hay más páginas
      hasMore = response.next !== null && page < response.pages;
      page++;
      
      // Por seguridad, limitar a 1000 resultados o 10 páginas
      if (page > 10 || allCharacters.length > 1000) {
        console.log('Límite de seguridad alcanzado para personajes');
        break;
      }
      
      // Pequeña pausa para no sobrecargar la API
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Total personajes obtenidos: ${allCharacters.length}`);
    return allCharacters;
  } catch (error) {
    console.error('Error fetching all characters:', error);
    return [];
  }
};

/**
 * Obtiene TODOS los episodios (sin límite)
 */
export const getAllEpisodesUnlimited = async (): Promise<EpisodeApiData[]> => {
  try {
    let allEpisodes: EpisodeApiData[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response: ApiResponse<EpisodeApiData> = await getAllEpisodes(page, 100); // 100 por página
      allEpisodes = [...allEpisodes, ...response.results];
      
      // Verificar si hay más páginas
      hasMore = response.next !== null && page < response.pages;
      page++;
      
      // Por seguridad, limitar a 1000 resultados o 10 páginas
      if (page > 10 || allEpisodes.length > 1000) {
        console.log('Límite de seguridad alcanzado para episodios');
        break;
      }
      
      // Pequeña pausa para no sobrecargar la API
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Total episodios obtenidos: ${allEpisodes.length}`);
    return allEpisodes;
  } catch (error) {
    console.error('Error fetching all episodes:', error);
    return [];
  }
};

/**
 * Obtiene TODAS las ubicaciones (sin límite)
 */
export const getAllLocationsUnlimited = async (): Promise<LocationApiData[]> => {
  try {
    let allLocations: LocationApiData[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response: ApiResponse<LocationApiData> = await getAllLocations(page, 100); // 100 por página
      allLocations = [...allLocations, ...response.results];
      
      // Verificar si hay más páginas
      hasMore = response.next !== null && page < response.pages;
      page++;
      
      // Por seguridad, limitar a 500 resultados o 5 páginas
      if (page > 5 || allLocations.length > 500) {
        console.log('Límite de seguridad alcanzado para ubicaciones');
        break;
      }
      
      // Pequeña pausa para no sobrecargar la API
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Total ubicaciones obtenidas: ${allLocations.length}`);
    return allLocations;
  } catch (error) {
    console.error('Error fetching all locations:', error);
    return [];
  }
};

/**
 * Búsqueda general en toda la API (con límite de 100 por categoría)
 */
export const searchAll = async (query: string, page: number = 1, limit: number = 100): Promise<{
  characters: ApiResponse<CharacterApiData>;
  episodes: ApiResponse<EpisodeApiData>;
  locations: ApiResponse<LocationApiData>;
}> => {
  try {
    const [characters, episodes, locations] = await Promise.all([
      fetch(`${API_BASE_URL}/characters?search=${query}&page=${page}&limit=${limit}`)
        .then(res => {
          if (!res.ok) throw new Error(`Error en characters: ${res.status}`);
          return res.json();
        }),
      fetch(`${API_BASE_URL}/episodes?search=${query}&page=${page}&limit=${limit}`)
        .then(res => {
          if (!res.ok) throw new Error(`Error en episodes: ${res.status}`);
          return res.json();
        }),
      fetch(`${API_BASE_URL}/locations?search=${query}&page=${page}&limit=${limit}`)
        .then(res => {
          if (!res.ok) throw new Error(`Error en locations: ${res.status}`);
          return res.json();
        }),
    ]);
    
    return { characters, episodes, locations };
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
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
    const searchLower = query.toLowerCase();
    
    // Obtener TODOS los datos primero
    const [allCharacters, allEpisodes, allLocations] = await Promise.all([
      getAllCharactersUnlimited(),
      getAllEpisodesUnlimited(),
      getAllLocationsUnlimited()
    ]);
    
    console.log('Total datos obtenidos para búsqueda:', {
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
    
    console.log('Resultados filtrados:', {
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
    throw error;
  }
};