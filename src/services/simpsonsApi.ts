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
 * Búsqueda general en toda la API
 */
export const searchAll = async (query: string, page: number = 1, limit: number = 20): Promise<{
  characters: ApiResponse<CharacterApiData>;
  episodes: ApiResponse<EpisodeApiData>;
  locations: ApiResponse<LocationApiData>;
}> => {
  try {
    const [characters, episodes, locations] = await Promise.all([
      fetch(`${API_BASE_URL}/characters?search=${query}&page=${page}&limit=${limit}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/episodes?search=${query}&page=${page}&limit=${limit}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/locations?search=${query}&page=${page}&limit=${limit}`).then(res => res.json()),
    ]);
    
    return { characters, episodes, locations };
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};