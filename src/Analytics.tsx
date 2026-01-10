// src/Analytics.tsx - Página de Estadísticas y Análisis
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Card from './components/Card';
import type { CardData } from './components/Card';
import { 
  getAllCharacters, 
  getAllEpisodes, 
  getAllLocations,
  type CharacterApiData,
  type EpisodeApiData 
} from './services/simpsonsApi';
import { useLanguage } from './context/LanguageContext';
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
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'top10' | 'seasons' | 'comparator'>('top10');
  
  // Estados para Top 10
  const [topCharacters, setTopCharacters] = useState<TopCharacter[]>([]);
  
  // Estados para Estadísticas de Temporadas
  const [seasonStats, setSeasonStats] = useState<SeasonStats[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  
  // Estados para Comparador
  const [allCharacters, setAllCharacters] = useState<CardData[]>([]);
  const [character1, setCharacter1] = useState<CardData | null>(null);
  const [character2, setCharacter2] = useState<CardData | null>(null);

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
      
      // Simular conteo de búsquedas (en una app real, esto vendría de analytics/Firebase)
      const topChars = characters
        .map(char => ({
          ...char,
          searchCount: Math.floor(Math.random() * 1000) + 100
        }))
        .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
        .slice(0, 10);
      
      setTopCharacters(topChars);
      setAllCharacters(characters);
      
      // Cargar TODOS los episodios con paginación múltiple
      let allEpisodes: CardData[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      
      while (hasMorePages && currentPage <= 35) { // Limitar a 35 páginas (35*20 = 700 episodios)
        const episodesResponse = await getAllEpisodes(currentPage, 20);
        
        const pageEpisodes: CardData[] = episodesResponse.results.map((ep: EpisodeApiData) => ({
          id: ep.id,
          type: 'episode' as const,
          name: ep.name,
          image_path: ep.image_path,
          info1: `Temporada ${ep.season}`,
          info2: `Episodio ${ep.episode_number}`,
          info3: ep.airdate,
          extraInfo: {
            season: ep.season,
            episode_number: ep.episode_number,
            airdate: ep.airdate,
            synopsis: ep.synopsis
          }
        }));
        
        allEpisodes = [...allEpisodes, ...pageEpisodes];
        
        // Verificar si hay más páginas
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
        .filter(s => s.season > 0) // Filtrar temporada 0 si existe
        .sort((a, b) => a.season - b.season);
      
      setSeasonStats(stats);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComparisonData = () => {
    if (!character1 || !character2) return null;
    
    const char1Extra = character1.extraInfo || {};
    const char2Extra = character2.extraInfo || {};
    
    return {
      name: {
        char1: character1.name,
        char2: character2.name,
        winner: character1.name.length > character2.name.length ? 'char1' : 
                character1.name.length < character2.name.length ? 'char2' : 'tie'
      },
      gender: {
        char1: char1Extra.gender || 'Unknown',
        char2: char2Extra.gender || 'Unknown',
        same: char1Extra.gender === char2Extra.gender
      },
      age: {
        char1: char1Extra.age || 0,
        char2: char2Extra.age || 0,
        winner: (char1Extra.age || 0) > (char2Extra.age || 0) ? 'char1' : 
                (char1Extra.age || 0) < (char2Extra.age || 0) ? 'char2' : 'tie'
      },
      occupation: {
        char1: char1Extra.occupation || 'Unknown',
        char2: char2Extra.occupation || 'Unknown',
        same: char1Extra.occupation === char2Extra.occupation
      },
      phrases: {
        char1: char1Extra.phrases?.length || 0,
        char2: char2Extra.phrases?.length || 0,
        winner: (char1Extra.phrases?.length || 0) > (char2Extra.phrases?.length || 0) ? 'char1' : 
                (char1Extra.phrases?.length || 0) < (char2Extra.phrases?.length || 0) ? 'char2' : 'tie'
      }
    };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <h2>Cargando estadísticas...</h2>
        </div>
      </MainLayout>
    );
  }

  const comparison = getComparisonData();

  return (
    <MainLayout>
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Estadísticas y Análisis</h1>
          <p>Descubre los datos más interesantes del universo de Los Simpson</p>
        </div>

        {/* Tabs de navegación */}
        <div className="analytics-tabs">
          <button 
            className={`tab-btn ${activeTab === 'top10' ? 'active' : ''}`}
            onClick={() => setActiveTab('top10')}
          >
            🏆 Top 10 Personajes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'seasons' ? 'active' : ''}`}
            onClick={() => setActiveTab('seasons')}
          >
            📺 Estadísticas por Temporada
          </button>
          <button 
            className={`tab-btn ${activeTab === 'comparator' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparator')}
          >
            ⚔️ Comparador de Personajes
          </button>
        </div>

        {/* Contenido de tabs */}
        <div className="analytics-content">
          
          {/* TAB 1: Top 10 Personajes */}
          {activeTab === 'top10' && (
            <div className="top10-section">
              <h2>🏆 Top 10 Personajes Más Buscados</h2>
              <p className="section-description">
                Los personajes más populares según las búsquedas de usuarios
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
                       {char.searchCount} búsquedas
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Estadísticas por Temporada */}
          {activeTab === 'seasons' && (
            <div className="seasons-section">
              <h2> Estadísticas por Temporada</h2>
              <p className="section-description">
                Análisis detallado de episodios por cada temporada
              </p>
              
              <div className="seasons-overview">
                <div className="stat-card">
                  <h3>{seasonStats.length}</h3>
                  <p>Temporadas</p>
                </div>
                <div className="stat-card">
                  <h3>{seasonStats.reduce((sum, s) => sum + s.episodeCount, 0)}</h3>
                  <p>Episodios Totales</p>
                </div>
                <div className="stat-card">
                  <h3>{(seasonStats.reduce((sum, s) => sum + s.episodeCount, 0) / seasonStats.length).toFixed(1)}</h3>
                  <p>Promedio por Temporada</p>
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
                      <h3>Temporada {season.season}</h3>
                      <div className="season-info">
                        <span className="episode-count">{season.episodeCount} episodios</span>
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
                            + {season.episodes.length - 6} episodios más
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Comparador de Personajes */}
          {activeTab === 'comparator' && (
            <div className="comparator-section">
              <h2>⚔️ Comparador de Personajes</h2>
              <p className="section-description">
                Compara dos personajes lado a lado
              </p>
              
              <div className="comparator-selectors">
                <div className="selector-group">
                  <label>Personaje 1:</label>
                  <select 
                    value={character1?.id || ''}
                    onChange={(e) => {
                      const char = allCharacters.find(c => c.id === e.target.value);
                      setCharacter1(char || null);
                    }}
                    className="character-select"
                  >
                    <option value="">Selecciona un personaje</option>
                    {allCharacters.map(char => (
                      <option key={char.id} value={char.id}>{char.name}</option>
                    ))}
                  </select>
                </div>

                <div className="vs-divider">VS</div>

                <div className="selector-group">
                  <label>Personaje 2:</label>
                  <select 
                    value={character2?.id || ''}
                    onChange={(e) => {
                      const char = allCharacters.find(c => c.id === e.target.value);
                      setCharacter2(char || null);
                    }}
                    className="character-select"
                  >
                    <option value="">Selecciona un personaje</option>
                    {allCharacters.map(char => (
                      <option key={char.id} value={char.id}>{char.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {character1 && character2 && comparison && (
                <div className="comparison-result">
                  <div className="comparison-cards">
                    <div className="comparison-card">
                      <Card data={character1} size="medium" variant="preview" />
                    </div>
                    <div className="comparison-card">
                      <Card data={character2} size="medium" variant="preview" />
                    </div>
                  </div>

                  <div className="comparison-stats">
                    <h3>Comparación Detallada</h3>
                    
                    <div className="comparison-row">
                      <div className={`stat ${comparison.gender.same ? 'tie' : ''}`}>
                        {comparison.gender.char1}
                      </div>
                      <div className="stat-label">Género</div>
                      <div className={`stat ${comparison.gender.same ? 'tie' : ''}`}>
                        {comparison.gender.char2}
                      </div>
                    </div>

                    <div className="comparison-row">
                      <div className={`stat ${comparison.age.winner === 'char1' ? 'winner' : ''}`}>
                        {comparison.age.char1} años
                      </div>
                      <div className="stat-label">Edad</div>
                      <div className={`stat ${comparison.age.winner === 'char2' ? 'winner' : ''}`}>
                        {comparison.age.char2} años
                      </div>
                    </div>

                    <div className="comparison-row">
                      <div className={`stat ${comparison.occupation.same ? 'tie' : ''}`}>
                        {comparison.occupation.char1}
                      </div>
                      <div className="stat-label">Ocupación</div>
                      <div className={`stat ${comparison.occupation.same ? 'tie' : ''}`}>
                        {comparison.occupation.char2}
                      </div>
                    </div>

                    <div className="comparison-row">
                      <div className={`stat ${comparison.phrases.winner === 'char1' ? 'winner' : ''}`}>
                        {comparison.phrases.char1} frases
                      </div>
                      <div className="stat-label">Frases Icónicas</div>
                      <div className={`stat ${comparison.phrases.winner === 'char2' ? 'winner' : ''}`}>
                        {comparison.phrases.char2} frases
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(!character1 || !character2) && (
                <div className="comparison-placeholder">
                  <p>👆 Selecciona dos personajes para compararlos</p>
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={() => navigate('/')} className="back-btn">
          ← Volver al inicio
        </button>
      </div>
    </MainLayout>
  );
}

export default Analytics;
