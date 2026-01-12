// src/Analytics.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Card from './components/Card';
import type { CardData } from './components/Card';
import { useLanguage } from './context/LanguageContext'; // <-- AÑADIR
import { 
  getAllCharacters, 
  getAllEpisodes,
  type CharacterApiData,
  type EpisodeApiData 
} from './services/simpsonsApi';
import './styles/Analytics.css';

interface TopCharacter extends CardData {
  searchCount?: number;
}

interface SeasonStats {
  season: number;
  episodeCount: number;
  episodes: CardData[];
}

function Analytics() {
  const navigate = useNavigate();
  const { t } = useLanguage(); // <-- AÑADIR
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'top10' | 'seasons'>('top10'); // <-- QUITAR 'comparator'
  
  // Estados para Top 10
  const [topCharacters, setTopCharacters] = useState<TopCharacter[]>([]);
  
  // Estados para Estadísticas de Temporadas
  const [seasonStats, setSeasonStats] = useState<SeasonStats[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  
  // Estados para Comparador (QUITAR)
  // const [allCharacters, setAllCharacters] = useState<CardData[]>([]);
  // const [character1, setCharacter1] = useState<CardData | null>(null);
  // const [character2, setCharacter2] = useState<CardData | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Cargar personajes
      const charactersResponse = await getAllCharacters(1, 50);
      const characters: CardData[] = charactersResponse.results.map((char: CharacterApiData) => ({
        id: char.id,
        type: 'character' as const,
        name: char.name,
        image_path: char.portrait_path,
        info1: char.gender,
        info2: char.occupation,
        info3: char.status,
        extraInfo: {
          gender: char.gender,
          occupation: char.occupation,
          status: char.status,
          age: char.age,
          birthdate: char.birthdate,
          phrases: char.phrases
        }
      }));
      
      // Simular conteo de búsquedas
      const topChars = characters
        .map(char => ({
          ...char,
          searchCount: Math.floor(Math.random() * 1000) + 100
        }))
        .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
        .slice(0, 10);
      
      setTopCharacters(topChars);
      // setAllCharacters(characters); // <-- QUITAR
      
      // Cargar TODOS los episodios con paginación múltiple
      let allEpisodes: CardData[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      
      while (hasMorePages && currentPage <= 35) {
        const episodesResponse = await getAllEpisodes(currentPage, 20);
        
        const pageEpisodes: CardData[] = episodesResponse.results.map((ep: EpisodeApiData) => ({
          id: ep.id,
          type: 'episode' as const,
          name: ep.name,
          image_path: ep.image_path,
          info1: `${t('season') || 'Season'} ${ep.season}`,
          info2: `${t('episode') || 'Episode'} ${ep.episode_number}`,
          info3: ep.airdate,
          extraInfo: {
            season: ep.season,
            episode_number: ep.episode_number,
            airdate: ep.airdate,
            synopsis: ep.synopsis
          }
        }));
        
        allEpisodes = [...allEpisodes, ...pageEpisodes];
        hasMorePages = episodesResponse.next !== null;
        currentPage++;
      }
      
      // Agrupar por temporada usando extraInfo
      const seasonGroups = allEpisodes.reduce((acc, ep) => {
        const season = ep.extraInfo?.season || 0;
        if (!acc[season]) {
          acc[season] = [];
        }
        acc[season].push(ep);
        return acc;
      }, {} as Record<number, CardData[]>);
      
      const stats: SeasonStats[] = Object.entries(seasonGroups)
        .map(([season, eps]) => ({
          season: parseInt(season),
          episodeCount: eps.length,
          episodes: eps
        }))
        .filter(s => s.season > 0)
        .sort((a, b) => a.season - b.season);
      
      setSeasonStats(stats);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // QUITAR FUNCIÓN getComparisonData() COMPLETA
  // const getComparisonData = () => { ... }

  if (loading) {
    return (
      <MainLayout>
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <h2>{t('loadingAnalytics') || 'Cargando estadísticas...'}</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>{t('analyticsTitle') || 'Estadísticas y Análisis'}</h1>
          <p>{t('analyticsSubtitle') || 'Descubre los datos más interesantes del universo de Los Simpson'}</p>
        </div>

        {/* Tabs de navegación - SOLO 2 TABS AHORA */}
        <div className="analytics-tabs">
          <button 
            className={`tab-btn ${activeTab === 'top10' ? 'active' : ''}`}
            onClick={() => setActiveTab('top10')}
          >
            {t('top10Tab') || 'Top 10 Personajes'}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'seasons' ? 'active' : ''}`}
            onClick={() => setActiveTab('seasons')}
          >
            {t('seasonsTab') || 'Estadísticas por Temporada'}
          </button>
          {/* QUITAR BOTÓN DEL COMPARADOR */}
        </div>

        {/* Contenido de tabs */}
        <div className="analytics-content">
          
          {/* TAB 1: Top 10 Personajes */}
          {activeTab === 'top10' && (
            <div className="top10-section">
              <h2>{t('top10Title') || 'Top 10 Personajes Más Buscados'}</h2>
              <p className="section-description">
                {t('top10Description') || 'Los personajes más populares según las búsquedas de usuarios'}
              </p>
              
              <div className="top10-grid">
                {topCharacters.map((char, index) => (
                  <div key={char.id} className="top10-item">
                    <div className="rank-badge">#{index + 1}</div>
                    <Card 
                      data={char} 
                      size="medium" 
                      variant="preview"
                      showFavoriteButton={true}
                    />
                    <div className="search-count">
                      {char.searchCount} {t('searches') || 'búsquedas'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Estadísticas por Temporada */}
          {activeTab === 'seasons' && (
            <div className="seasons-section">
              <h2>{t('seasonsTitle') || 'Estadísticas por Temporada'}</h2>
              <p className="section-description">
                {t('seasonsDescription') || 'Análisis detallado de episodios por cada temporada'}
              </p>
              
              <div className="seasons-overview">
                <div className="stat-card">
                  <h3>{seasonStats.length}</h3>
                  <p>{t('seasonsCount') || 'Temporadas'}</p>
                </div>
                <div className="stat-card">
                  <h3>{seasonStats.reduce((sum, s) => sum + s.episodeCount, 0)}</h3>
                  <p>{t('totalEpisodes') || 'Episodios Totales'}</p>
                </div>
                <div className="stat-card">
                  <h3>{(seasonStats.reduce((sum, s) => sum + s.episodeCount, 0) / seasonStats.length).toFixed(1)}</h3>
                  <p>{t('averagePerSeason') || 'Promedio por Temporada'}</p>
                </div>
              </div>

              <div className="seasons-list">
                {seasonStats.map(season => (
                  <div key={season.season} className="season-item">
                    <div 
                      className="season-header"
                      onClick={() => setSelectedSeason(
                        selectedSeason === season.season ? null : season.season
                      )}
                    >
                      <h3>{t('season') || 'Temporada'} {season.season}</h3>
                      <div className="season-info">
                        <span className="episode-count">
                          {season.episodeCount} {t('episodes') || 'episodios'}
                        </span>
                        <span className="expand-icon">
                          {selectedSeason === season.season ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    
                    {selectedSeason === season.season && (
                      <div className="season-episodes">
                        <div className="episodes-grid">
                          {season.episodes.slice(0, 6).map(episode => (
                            <Card 
                              key={episode.id}
                              data={episode}
                              size="small"
                              variant="preview"
                            />
                          ))}
                        </div>
                        {season.episodes.length > 6 && (
                          <p className="more-episodes">
                            + {season.episodes.length - 6} {t('moreEpisodes') || 'episodios más'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUITAR TODA LA SECCIÓN DEL COMPARADOR */}
        </div>

        <button onClick={() => navigate('/')} className="back-btn">
          ← {t('backToHome') || 'Volver al inicio'}
        </button>
      </div>
    </MainLayout>
  );
}

export default Analytics;