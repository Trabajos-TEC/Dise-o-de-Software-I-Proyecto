// src/components/SearchResults.tsx
import { useState, useEffect } from 'react';
import Card from './components/Card';
import type { CardData } from './components/Card';
import type { SearchResult } from './components/cardUtils';
import './SearchResults.css';

interface SearchResultsProps {
  searchQuery: string;
  searchResults: SearchResult;
  onClearSearch: () => void;
  isLoading?: boolean;
  onNewSearch?: () => void;
}

function SearchResults({ 
  searchQuery, 
  searchResults, 
  onClearSearch,
  isLoading = false,
  onNewSearch
}: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Combinar todos los resultados en un solo array
  const getAllSearchResults = (): CardData[] => {
    if (!searchResults) return [];
    return [
      ...searchResults.characters,
      ...searchResults.episodes,
      ...searchResults.locations
    ];
  };

  const allSearchResults = getAllSearchResults();
  const totalResults = allSearchResults.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Obtener resultados para la página actual
  const getPaginatedResults = (): CardData[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allSearchResults.slice(startIndex, endIndex);
  };

  const paginatedResults = getPaginatedResults();

  // Resetear a página 1 cuando cambian los resultados
  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Renderizar controles de paginación
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container">
        <button
          className="pagination-button prev"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          ◀ Anterior
        </button>

        <div className="page-numbers">
          {startPage > 1 && (
            <>
              <button
                className="page-number"
                onClick={() => handlePageClick(1)}
              >
                1
              </button>
              {startPage > 2 && <span className="page-ellipsis">...</span>}
            </>
          )}

          {pageNumbers.map(page => (
            <button
              key={page}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="page-ellipsis">...</span>}
              <button
                className="page-number"
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-button next"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente ▶
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="search-results-page">
        <div className="loading-results">
          <div className="loading-spinner-large"></div>
          <p>Buscando "{searchQuery}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <div className="search-results-title">
          <h1>Resultados de búsqueda para: "{searchQuery}"</h1>
        </div>
        
        <div className="search-results-stats">
          <div className="results-summary">
            <span className="total-results">{totalResults} resultados encontrados</span>
            <div className="results-by-type">
              <span className="type-badge character-badge">
                {searchResults.characters.length} Personajes
              </span>
              <span className="type-badge episode-badge">
                {searchResults.episodes.length} Episodios
              </span>
              <span className="type-badge location-badge">
                {searchResults.locations.length} Lugares
              </span>
            </div>
          </div>
          
          {onNewSearch && (
            <button className="new-search-button" onClick={onNewSearch}>
              ← Volver al inicio
            </button>
          )}
        </div>
      </div>

      <div className="search-results-content">
        {totalResults === 0 ? (
          <div className="no-results-message">
            <h3>No se encontraron resultados para "{searchQuery}"</h3>
            <p>Intenta con otros términos de búsqueda.</p>
            <button className="retry-search-button" onClick={onClearSearch}>
              Nueva búsqueda
            </button>
          </div>
        ) : (
          <>
            <div className="search-results-grid">
              {paginatedResults.map(card => (
                <div key={`${card.type}-${card.id}`} className="search-result-card">
                  <Card 
                    data={card} 
                    size="medium" 
                    flipOnHover={true}
                    showDetails={true}
                  />
                </div>
              ))}
            </div>
            
            {renderPagination()}
            
            <div className="pagination-info">
              <span>
                Mostrando {paginatedResults.length} de {totalResults} resultados
              </span>
              <span>
                Página {currentPage} de {totalPages}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;