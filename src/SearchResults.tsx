// src/SearchResults.tsx - VERSIÓN COMPLETA CORREGIDA
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [selectedUse, setSelectedUse] = useState<string>('all');
  
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
    if (location.state?.searchQuery && location.state?.searchResults) {
      // DEBUG: ver la estructura real
      const sampleChar = location.state.searchResults.characters[0];
      console.log('DEBUG - Estructura de personaje:', {
        name: sampleChar?.name,
        info1: sampleChar?.info1,  // ← Status
        info2: sampleChar?.info2,  // ← Gender
        info3: sampleChar?.info3,  // ← Occupation
        extraInfo: sampleChar?.extraInfo,
      });
      
      setSearchQuery(location.state.searchQuery);
      setSearchResults(location.state.searchResults);
      setCurrentPage(1);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  // Hacer scroll al principio cuando se cargan los resultados
  useEffect(() => {
    if (searchResults) {
      // Hacer scroll suave al principio de la página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchResults]); // Se ejecuta cuando searchResults cambia

  // También para cuando cambia la página (backup)
  useEffect(() => {
    // Scroll al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // ============ FUNCIONES PARA LAS CARTAS ============

  const handleCardClick = (card: CardData) => {
    navigate(`/card/${card.type}-${card.id}`, { 
      state: { 
        cardData: card 
      } 
    });
  };

  const handleFavoriteToggle = async (card: CardData) => {
    const user = auth.currentUser;
    if (!user) return;

    const id = `${card.type}-${card.id}`;

    setFavorites(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });

    const favRef = doc(db, "users", user.uid, "favorites", id);

    try {
      if (favorites.has(id)) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, card);
      }
    } catch (err) {
      console.error(err);
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
      const filteredChars = searchResults.characters.filter(char => {
        // CORREGIDO: Buscar en info2 (gender) y info1 (status) DIRECTAMENTE en el objeto
        const charGender = char.info2?.toLowerCase() || '';
        const filterGender = selectedGender.toLowerCase();
        
        const charStatus = char.info1?.toLowerCase() || '';
        const filterStatus = selectedStatus.toLowerCase();
        
        const genderMatch = selectedGender === 'all' || charGender === filterGender;
        const statusMatch = selectedStatus === 'all' || charStatus === filterStatus;
        
        // DEBUG
        if (selectedGender !== 'all') {
          console.log('Filtrando género:', {
            name: char.name,
            charGender,
            filterGender,
            match: genderMatch
          });
        }
        
        return genderMatch && statusMatch;
      });
      allResults = [...allResults, ...filteredChars];
    }
    
    if (selectedCategory === 'all' || selectedCategory === 'episodes') {
      const filteredEps = selectedSeason === 'all'
        ? searchResults.episodes
        : searchResults.episodes.filter(ep => 
            ep.extraInfo?.season?.toString() === selectedSeason
          );
      allResults = [...allResults, ...filteredEps];
    }
    
    if (selectedCategory === 'all' || selectedCategory === 'locations') {
      const filteredLocs = searchResults.locations.filter(loc => {
        const charTown = loc.extraInfo?.town?.toLowerCase() || '';
        const filterTown = selectedTown.toLowerCase();
        
        const charUse = loc.extraInfo?.use?.toLowerCase() || '';
        const filterUse = selectedUse.toLowerCase();
        
        const townMatch = selectedTown === 'all' || charTown === filterTown;
        const useMatch = selectedUse === 'all' || charUse === filterUse;
        
        return townMatch && useMatch;
      });
      allResults = [...allResults, ...filteredLocs];
    }
    
    return allResults;
  };

  // Obtener géneros únicos de los personajes
  const getUniqueGenders = (): string[] => {
    if (!searchResults) return ['Male', 'Female'];
    const genders = searchResults.characters
      .map(char => char.info2) // ← CORREGIDO: info2 directamente en el objeto
      .filter((gender): gender is string => !!gender)
      .map(gender => gender.toLowerCase());
    
    const uniqueGenders = [...new Set(genders)];
    return uniqueGenders.length > 0 ? uniqueGenders : ['male', 'female'];
  };

  // Obtener estados únicos de los personajes
  const getUniqueStatuses = (): string[] => {
    if (!searchResults) return ['Alive', 'Dead', 'Unknown'];
    const statuses = searchResults.characters
      .map(char => char.info1) // ← CORREGIDO: info1 directamente en el objeto
      .filter((status): status is string => !!status)
      .map(status => status.toLowerCase());
    
    const uniqueStatuses = [...new Set(statuses)];
    return uniqueStatuses.length > 0 ? uniqueStatuses : ['alive', 'dead', 'unknown'];
  };

  // Obtener temporadas únicas de los episodios
  const getUniqueSeasons = (): number[] => {
    if (!searchResults) return [1, 2, 3, 4, 5];
    const seasons = searchResults.episodes
      .map(ep => ep.extraInfo?.season)
      .filter((season): season is number => season !== undefined);
    const uniqueSeasons = [...new Set(seasons)].sort((a, b) => a - b);
    return uniqueSeasons.length > 0 ? uniqueSeasons : [1, 2, 3, 4, 5];
  };

  // Obtener pueblos/ciudades únicas de las ubicaciones
  const getUniqueTowns = (): string[] => {
    if (!searchResults) return ['Springfield'];
    const towns = searchResults.locations
      .map(loc => loc.extraInfo?.town)
      .filter((town): town is string => !!town)
      .map(town => town.toLowerCase());
    const uniqueTowns = [...new Set(towns)];
    return uniqueTowns.length > 0 ? uniqueTowns : ['springfield'];
  };

  // Obtener usos únicos de las ubicaciones
  const getUniqueUses = (): string[] => {
    if (!searchResults) return ['School', 'House', 'Bar'];
    const uses = searchResults.locations
      .map(loc => loc.extraInfo?.use)
      .filter((use): use is string => !!use)
      .map(use => use.toLowerCase());
    const uniqueUses = [...new Set(uses)];
    return uniqueUses.length > 0 ? uniqueUses : ['school', 'house', 'bar'];
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
    setSelectedStatus('all');
    setSelectedTown('all');
    setSelectedUse('all');
    setCurrentPage(1);
  };

  // Determinar si mostrar botón de reset
  const shouldShowReset = 
    selectedGender !== 'all' || 
    selectedSeason !== 'all' || 
    selectedStatus !== 'all' ||
    selectedTown !== 'all' ||
    selectedUse !== 'all' ||
    selectedCategory !== 'all';

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
  const uniqueStatuses = getUniqueStatuses();
  const uniqueSeasons = getUniqueSeasons();
  const uniqueTowns = getUniqueTowns();
  const uniqueUses = getUniqueUses();
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
            <div className="filters-header">
              <h3>{t('filters')}</h3>
              {shouldShowReset && (
                <button 
                  onClick={resetFilters}
                  className="reset-filters-btn"
                >
                  {t('resetFilters')}
                </button>
              )}
            </div>
            
            <div className="filters-grid">
              {/* Filtro por Categoría (SIEMPRE visible) */}
              <div className="filter-group">
                <label htmlFor="category-filter">{t('category')}:</label>
                <select 
                  id="category-filter"
                  value={selectedCategory} 
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setSelectedCategory(newCategory);
                    setSelectedGender('all');
                    setSelectedSeason('all');
                    setSelectedStatus('all');
                    setSelectedTown('all');
                    setSelectedUse('all');
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

              {/* FILTROS PARA PERSONAJES (solo si categoría es 'characters') */}
              {selectedCategory === 'characters' && (
                <>
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
                        <option key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="status-filter">{t('status')}:</label>
                    <select 
                      id="status-filter"
                      value={selectedStatus} 
                      onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-select"
                    >
                      <option value="all">{t('all')}</option>
                      {uniqueStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* FILTRO PARA EPISODIOS (solo si categoría es 'episodes') */}
              {selectedCategory === 'episodes' && (
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
                        <option key={season} value={season.toString()}>
                          {t('season')} {season}
                        </option>
                      ))}
                    </select>
                </div>
              )}

              {/* FILTROS PARA UBICACIONES (solo si categoría es 'locations') */}
              {selectedCategory === 'locations' && (
                <>
                  <div className="filter-group">
                    <label htmlFor="town-filter">{t('town')}:</label>
                    <select 
                      id="town-filter"
                      value={selectedTown} 
                      onChange={(e) => {
                        setSelectedTown(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-select"
                    >
                      <option value="all">{t('all')}</option>
                      {uniqueTowns.map(town => (
                        <option key={town} value={town}>
                          {town.charAt(0).toUpperCase() + town.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="use-filter">{t('use')}:</label>
                    <select 
                      id="use-filter"
                      value={selectedUse} 
                      onChange={(e) => {
                        setSelectedUse(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-select"
                    >
                      <option value="all">{t('all')}</option>
                      {uniqueUses.map(use => (
                        <option key={use} value={use}>
                          {use.charAt(0).toUpperCase() + use.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
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