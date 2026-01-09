// src/components/Header.tsx - SIMPLIFICADO
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { searchCards } from './cardUtils';
import LanguageButton from './LanguageButton';
import ThemeButton from './ThemeButton';
import SignIn from './SignInButton';
import '../styles/components/header.css';
import Perfil from "./perfilButton"
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
      
      // Navegar a SearchResults con los resultados
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

  const isSearchButtonDisabled = isSearching || disableSearch || !searchQuery.trim();

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
        <LanguageButton />
        <span className="separator">|</span>
        <ThemeButton />
        <span className="separator">|</span>
        <SignIn />
        <Perfil />
      </div>
    </header>
  );
};

export default Header;