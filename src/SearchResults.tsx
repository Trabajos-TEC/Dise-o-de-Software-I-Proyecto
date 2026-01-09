// src/SearchResults.tsx - VERSIÓN MÍNIMA FUNCIONAL
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Card from './components/Card';
import type { SearchResult } from './components/cardUtils';
import './styles/SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  // Cargar resultados del estado de navegación
  useEffect(() => {
    console.log(' location.state en SearchResults:', location.state);
    
    if (location.state?.searchQuery && location.state?.searchResults) {
      console.log(' Datos recibidos correctamente');
      setSearchQuery(location.state.searchQuery);
      setSearchResults(location.state.searchResults);
    } else {
      console.log(' No hay datos, redirigiendo...');
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!searchResults) {
    return (
      <MainLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Cargando resultados...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <h1>Resultados para: "{searchQuery}"</h1>
        <p>Total resultados: {searchResults.characters.length + searchResults.episodes.length + searchResults.locations.length}</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px', 
          marginTop: '20px' 
        }}>
          {searchResults.characters.map(character => (
            <div key={`character-${character.id}`} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <Card 
                data={character} 
                size="medium"
                variant="preview"
              />
            </div>
          ))}
          
          {searchResults.episodes.map(episode => (
            <div key={`episode-${episode.id}`} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <Card 
                data={episode} 
                size="medium"
                variant="preview"
              />
            </div>
          ))}
          
          {searchResults.locations.map(location => (
            <div key={`location-${location.id}`} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <Card 
                data={location} 
                size="medium"
                variant="preview"
              />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => navigate('/')}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          ← Volver al inicio
        </button>
      </div>
    </MainLayout>
  );
}

export default SearchResults;