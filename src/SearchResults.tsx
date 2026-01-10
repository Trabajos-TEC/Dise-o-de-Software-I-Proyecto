// src/SearchResults.tsx - VERSIÓN CON FILTROS AVANZADOS Y PAGINACIÓN
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Card from './components/Card';
import type { SearchResult } from './components/cardUtils';
import type { CardData } from './components/Card';
import './styles/SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  
  // Estados para filtros
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // characters, episodes, locations
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
          <h2>Cargando resultados...</h2>
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
        {/* Header con título y estadísticas */}
        <div className="search-header">
          <h1>Resultados para: "{searchQuery}"</h1>
          <p className="results-count">
            {filteredResults.length} de {totalResults} resultados
            {filteredResults.length !== totalResults && ' (filtrados)'}
          </p>
        </div>

        {/* Panel de Filtros */}
        <div className="filters-panel">
          <h3>Filtros</h3>
          
          <div className="filters-grid">
            {/* Filtro por Categoría */}
            <div className="filter-group">
              <label htmlFor="category-filter">Categoría:</label>
              <select 
                id="category-filter"
                value={selectedCategory} 
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="all">Todas</option>
                <option value="characters">Personajes ({searchResults.characters.length})</option>
                <option value="episodes">Episodios ({searchResults.episodes.length})</option>
                <option value="locations">Ubicaciones ({searchResults.locations.length})</option>
              </select>
            </div>

            {/* Filtro por Género (solo para personajes) */}
            {(selectedCategory === 'all' || selectedCategory === 'characters') && uniqueGenders.length > 0 && (
              <div className="filter-group">
                <label htmlFor="gender-filter">Género:</label>
                <select 
                  id="gender-filter"
                  value={selectedGender} 
                  onChange={(e) => {
                    setSelectedGender(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-select"
                >
                  <option value="all">Todos</option>
                  {uniqueGenders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro por Temporada (solo para episodios) */}
            {(selectedCategory === 'all' || selectedCategory === 'episodes') && uniqueSeasons.length > 0 && (
              <div className="filter-group">
                <label htmlFor="season-filter">Temporada:</label>
                <select 
                  id="season-filter"
                  value={selectedSeason} 
                  onChange={(e) => {
                    setSelectedSeason(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-select"
                >
                  <option value="all">Todas</option>
                  {uniqueSeasons.map(season => (
                    <option key={season} value={season.toString()}>Temporada {season}</option>
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
                Resetear Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {currentResults.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron resultados con los filtros seleccionados.</p>
            <button onClick={resetFilters} className="button">
              Resetear Filtros
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
                  ← Anterior
                </button>
                
                <div className="pagination-info">
                  <span>Página {currentPage} de {totalPages}</span>
                  
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
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
        
        <button 
          onClick={() => navigate('/')}
          className="back-btn"
        >
          ← Volver al inicio
        </button>
      </div>
    </MainLayout>
  );
}

export default SearchResults;