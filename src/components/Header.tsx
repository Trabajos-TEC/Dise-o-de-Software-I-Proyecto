// src/components/Header.tsx - CON MENÚ HAMBURGUESA
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { searchCards } from './cardUtils';
import LanguageButton from './LanguageButton';
import ThemeButton from './ThemeButton';
import SignIn from './SignInButton';
import Perfil from "./perfilButton";
import AnalyticsButton from './AnalyticsButton';
import '../styles/components/header.css';
import { auth } from '../firebaseConfig'; // Asegúrate de importar auth
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';


interface HeaderProps {
  showSearch?: boolean;
  disableSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = true,
  disableSearch = false
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Estado para el usuario
  const [authLoading, setAuthLoading] = useState(true); // Estado de carga

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogoClick = () => {
    setSearchQuery('');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    setIsSearching(true);
    
    try {
      const results = await searchCards(trimmedQuery);
      
      navigate('/search', { 
        state: { 
          searchQuery: trimmedQuery,
          searchResults: results
        }
      });
      
    } catch (error) {
      console.error('Error searching:', error);
      alert(`${t('searchingFor')}: "${searchQuery}" - Error.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isSearchButtonDisabled = isSearching || disableSearch || !searchQuery.trim();

  // Mostrar spinner mientras se carga la autenticación
  if (authLoading) {
    return (
      <header className="app-header">
        <div className="header-loading">
          <span>Cargando...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="logo-button" 
          onClick={handleLogoClick}
          aria-label="Volver al inicio"
        >
          <img 
            src="/8fd978ef204d80914f6a493c8377415a.png" 
            alt="The Simpsons Logo" 
            className="header-logo" 
          />
        </button>
      </div>
      
      {showSearch && (
        <div className="header-center">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleInputChange}
                disabled={isSearching || disableSearch}
              />
              <button 
                type="submit" 
                className="search-button" 
                disabled={isSearchButtonDisabled}
              >
                {isSearching ? (
                  <span className="search-loading">...</span>
                ) : (
                  <span className="search-icon">⌕</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="header-right">
        {/* BOTONES VISIBLES: Theme */}
        <ThemeButton />
        
        {/* Mostrar SignIn SOLO si NO hay usuario autenticado */}
        {!user && <SignIn />}
        
        {/* MENÚ HAMBURGUESA */}
        <button 
          className="menu-toggle-btn"
          onClick={toggleMenu}
          aria-label="Menú"
          aria-expanded={isMenuOpen}
        >
          <span className="menu-toggle-icon">
            {isMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* MENÚ DESPLEGABLE */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-menu-content">
            
            {/* PERFIL ARRIBA - SOLO SI HAY USUARIO AUTENTICADO */}
            {user && (
              <div className="profile-top-section">
                <Perfil onClick={closeMenu} />
              </div>
            )}
            
            {/* SEPARADOR VISUAL - Solo mostrar si hay usuario */}
            {user && <div className="menu-divider"></div>}
            
            {/* BOTONES ABAJO CON SEPARACIÓN */}
            <div className="menu-buttons-section">
              <div className="menu-button-item">
                <AnalyticsButton onClick={closeMenu} />
              </div>
              <div className="menu-button-item">
                <LanguageButton onClick={closeMenu} />
              </div>
            </div>
            
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;