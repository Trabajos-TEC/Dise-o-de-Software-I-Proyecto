// src/SearchResults.tsx - VERSIÓN CON FILTROS AVANZADOS Y PAGINACIÓN
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import MainLayout from './components/MainLayout';
import Card from './components/Card';
import type { SearchResult } from './components/cardUtils';
import type { CardData } from './components/Card';
import './styles/SearchResults.css';

// Importar Firebase para favoritos
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Estados para filtros
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // characters, episodes, locations
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Cargar favoritos del usuario
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");

    const unsubscribe = onSnapshot(favRef, snapshot => {
      const ids = new Set<string>();
      snapshot.forEach(doc => ids.add(doc.id));
      setFavorites(ids);
    });

    return () => unsubscribe();
  }, []);

  // Cargar resultados del estado de navegación
  useEffect(() => {
    console.log(' location.state en SearchResults:', location.state);
    
    if (location.state?.searchQuery && location.state?.searchResults) {
      console.log(' Datos recibidos correctamente');
      setSearchQuery(location.state.searchQuery);
      setSearchResults(location.state.searchResults);
      setCurrentPage(1); // Reset page on new search
    } else {
      console.log(' No hay datos, redirigiendo...');
      navigate('/');
    }
  }, [location.state, navigate]);

  // ============ FUNCIONES PARA LAS CARTAS ============

  // Función para redirigir al hacer click en una carta
  const handleCardClick = (card: CardData) => {
    navigate(`/card/${card.type}-${card.id}`, { 
      state: { 
        cardData: card 
      } 
    });
  };

  // Función para manejar favoritos
  const handleFavoriteToggle = async (card: CardData) => {
    const user = auth.currentUser;
    if (!user) return;

    const id = `${card.type}-${card.id}`;

    // Actualizar estado local inmediatamente
    setFavorites(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });

    // Actualizar Firebase
    const favRef = doc(db, "users", user.uid, "favorites", id);

    try {
      if (favorites.has(id)) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, card);
      }
    } catch (err) {
      console.error(err);
      // Revertir cambio local si hay error
      setFavorites(prev => {
        const copy = new Set(prev);
        copy.has(id) ? copy.delete(id) : copy.add(id);
        return copy;
      });
    }
  };

  // ============ FILTROS Y PAGINACIÓN ============

  // Aplicar filtros a los resultados
  const getFilteredResults = (): CardData[] => {
    if (!searchResults) return [];
    
    let allResults: CardData[] = [];
    
    // Filtrar por categoría
    if (selectedCategory === 'all' || selectedCategory === 'characters') {
      const filteredChars = selectedGender === 'all' 
        ? searchResults.characters 
        : searchResults.characters.filter(char => char.gender?.toLowerCase() === selectedGender.toLowerCase());
      allResults = [...allResults, ...filteredChars];
    }
    
    if (selectedCategory === 'all' || selectedCategory === 'episodes') {
      const filteredEps = selectedSeason === 'all'
        ? searchResults.episodes
        : searchResults.episodes.filter(ep => ep.season?.toString() === selectedSeason);
      allResults = [...allResults, ...filteredEps];
    }
    
    if (selectedCategory === 'all' || selectedCategory === 'locations') {
      allResults = [...allResults, ...searchResults.locations];
    }
    
    return allResults;
  };

  // Obtener géneros únicos de los personajes
  const getUniqueGenders = (): string[] => {
    if (!searchResults) return [];
    const genders = searchResults.characters
      .map(char => char.gender)
      .filter((gender): gender is string => !!gender);
    return [...new Set(genders)];
  };

  // Obtener temporadas únicas de los episodios
  const getUniqueSeasons = (): number[] => {
    if (!searchResults) return [];
    const seasons = searchResults.episodes
      .map(ep => ep.season)
      .filter((season): season is number => season !== undefined);
    return [...new Set(seasons)].sort((a, b) => a - b);
  };

  // Paginación
  const filteredResults = getFilteredResults();
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSelectedGender('all');
    setSelectedSeason('all');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  if (!searchResults) {
    return (
      <MainLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>{t('loading')}</h2>
        </div>
      </MainLayout>
    );
  }

  const uniqueGenders = getUniqueGenders();
  const uniqueSeasons = getUniqueSeasons();
  const totalResults = searchResults.characters.length + searchResults.episodes.length + searchResults.locations.length;

  return (
    <MainLayout>
      <div className="search-results-container">
        {/* Header y Filtros juntos en un cuadro */}
        <div className="search-header-filters-container">
          {/* Header con título y estadísticas */}
          <div className="search-header">
            <h1>{t('searchResultsFor')}: "{searchQuery}"</h1>
            <p className="results-count">
              {filteredResults.length} {t('of')} {totalResults} {t('results')}
              {filteredResults.length !== totalResults && ` ${t('filtered')}`}
            </p>
          </div>

          {/* Panel de Filtros */}
          <div className="filters-panel">
            <h3>{t('filters')}</h3>
            
            <div className="filters-grid">
              {/* Filtro por Categoría */}
              <div className="filter-group">
                <label htmlFor="category-filter">{t('category')}:</label>
                <select 
                  id="category-filter"
                  value={selectedCategory} 
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-select"
                >
                  <option value="all">{t('all')}</option>
                  <option value="characters">{t('characters')} ({searchResults.characters.length})</option>
                  <option value="episodes">{t('episodes')} ({searchResults.episodes.length})</option>
                  <option value="locations">{t('locations')} ({searchResults.locations.length})</option>
                </select>
              </div>

              {/* Filtro por Género (solo para personajes) */}
              {(selectedCategory === 'all' || selectedCategory === 'characters') && uniqueGenders.length > 0 && (
                <div className="filter-group">
                  <label htmlFor="gender-filter">{t('gender')}:</label>
                  <select 
                    id="gender-filter"
                    value={selectedGender} 
                    onChange={(e) => {
                      setSelectedGender(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="filter-select"
                  >
                    <option value="all">{t('all')}</option>
                    {uniqueGenders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filtro por Temporada (solo para episodios) */}
              {(selectedCategory === 'all' || selectedCategory === 'episodes') && uniqueSeasons.length > 0 && (
                <div className="filter-group">
                  <label htmlFor="season-filter">{t('season')}:</label>
                  <select 
                    id="season-filter"
                    value={selectedSeason} 
                    onChange={(e) => {
                      setSelectedSeason(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="filter-select"
                  >
                    <option value="all">{t('all')}</option>
                    {uniqueSeasons.map(season => (
                      <option key={season} value={season.toString()}>{t('season')} {season}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Botón para resetear filtros */}
              <div className="filter-group">
                <button 
                  onClick={resetFilters}
                  className="reset-filters-btn"
                  disabled={selectedGender === 'all' && selectedSeason === 'all' && selectedCategory === 'all'}
                >
                  {t('resetFilters')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {currentResults.length === 0 ? (
          <div className="no-results">
            <p>{t('noResultsWithFilters')}</p>
            <button onClick={resetFilters} className="button">
              {t('resetFilters')}
            </button>
          </div>
        ) : (
          <>
            <div className="results-grid">
              {currentResults.map(item => (
                <div key={`${item.type}-${item.id}`} className="result-card">
                  <Card 
                    data={item} 
                    size="medium"
                    variant="preview"
                    showFavoriteButton={true}
                    isFavorite={favorites.has(`${item.type}-${item.id}`)}
                    onFavoriteToggle={() => handleFavoriteToggle(item)}
                    onClick={() => handleCardClick(item)}
                  />
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← {t('previous')}
                </button>
                
                <div className="pagination-info">
                  <span>{t('page')} {currentPage} {t('of')} {totalPages}</span>
                  
                  {/* Números de página */}
                  <div className="page-numbers">
                    {currentPage > 2 && (
                      <>
                        <button onClick={() => handlePageChange(1)} className="page-number">1</button>
                        {currentPage > 3 && <span>...</span>}
                      </>
                    )}
                    
                    {currentPage > 1 && (
                      <button onClick={() => handlePageChange(currentPage - 1)} className="page-number">
                        {currentPage - 1}
                      </button>
                    )}
                    
                    <button className="page-number active">{currentPage}</button>
                    
                    {currentPage < totalPages && (
                      <button onClick={() => handlePageChange(currentPage + 1)} className="page-number">
                        {currentPage + 1}
                      </button>
                    )}
                    
                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && <span>...</span>}
                        <button onClick={() => handlePageChange(totalPages)} className="page-number">
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  {t('next')} →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default SearchResults;