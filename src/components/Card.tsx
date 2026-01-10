// src/components/Card.tsx
import React, { useState } from 'react';
import '../styles/components/Card.css';
import { useLanguage } from '../context/LanguageContext';
// Export types
export type CardType = 'character' | 'episode' | 'location';

export interface CardData {
  id: number;
  name: string;
  image_path: string;
  type: CardType;
  info1?: string;
  info2?: string;
  info3?: string;
  extraInfo?: Record<string, any>;
  gender?: string;
  season?: number;
}

interface CardProps {
  data: CardData;
  size?: 'small' | 'medium' | 'large';
  flipOnHover?: boolean;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  variant?: 'preview' | 'detail'; // 'preview' para página principal, 'detail' para página de detalles
}

const Card: React.FC<CardProps> = ({ 
  data, 
  size = 'medium',
  flipOnHover = false,
  showFavoriteButton = false,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  variant = 'preview'
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useLanguage();

  const handleCardClick = (e: React.MouseEvent) => {
    // En modo preview, el click en toda la carta ejecuta onClick
    // En modo detail, solo el efecto flip
    if (variant === 'preview' && onClick) {
      e.stopPropagation();
      onClick();
    } else {
      // En modo detail, solo hace flip
      setIsFlipped(!isFlipped);
    }
  };

  const handleMouseEnter = () => {
    if (flipOnHover && variant === 'detail') {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (flipOnHover && variant === 'detail') {
      setIsFlipped(false);
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!onFavoriteToggle) return;

    if (isFavorite) {
      alert("No está en favoritos");
    } else {
      alert("Está en favoritos");
    }

    onFavoriteToggle();
};

  const sizeClass = `card-${size}`;
  const typeClass = `card-type-${data.type}`;

  const getImageUrl = () => {
    let sizeParam = '';
    switch (size) {
      case 'small': sizeParam = '200'; break;
      case 'large': sizeParam = '800'; break;
      default: sizeParam = '500'; break;
    }
    return `https://cdn.thesimpsonsapi.com/${sizeParam}${data.image_path}`;
  };

  // Labels EN INGLÉS (contenido de la carta)
  const getEnglishLabels = (type: CardType): string[] => {
    switch (type) {
      case 'character':
        return ['Status', 'Gender', 'Occupation'];
      case 'episode':
        return ['Season', 'Episode', 'Air Date'];
      case 'location':
        return ['City', 'Type', 'Use'];
      default:
        return ['Info 1', 'Info 2', 'Info 3'];
    }
  };

  const englishLabels = getEnglishLabels(data.type);

  // Limitar a máximo 3 elementos de información (parte trasera)
  const getLimitedInfoItems = () => {
    const items = [];
    
    // 1. Info1 si existe
    if (data.info1) {
      items.push({ 
        key: englishLabels[0], 
        value: data.info1 
      });
    }
    
    // 2. Info2 si existe
    if (data.info2 && items.length < 3) {
      items.push({ 
        key: englishLabels[1], 
        value: data.info2 
      });
    }
    
    // 3. Info3 si existe - para ocupaciones, tomar solo la primera
    if (data.info3 && items.length < 3) {
      let value = data.info3;
      if (data.type === 'character' && englishLabels[2] === 'Occupation') {
        const parts = value.split(',');
        value = parts[0].trim();
        if (value.length > 30) {
          value = value.slice(0, 27) + '...';
        }
      }
      items.push({ 
        key: englishLabels[2], 
        value: value 
      });
    }
    
    return items.slice(0, 3); // Máximo 3 items
  };

  const infoItems = getLimitedInfoItems();

  return (
    <div 
      className={`card-container ${sizeClass} ${typeClass} card-${variant}`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={variant === 'preview' ? 'button' : undefined}
      tabIndex={variant === 'preview' ? 0 : undefined}
      onKeyDown={variant === 'preview' ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      } : undefined}
    >
      <div className={`card-inner ${isFlipped ? 'card-flipped' : ''}`}>
        
        <div className="card-front">
          <div className="card-border">
            {/* Botón de favoritos (solo en preview) */}
            {variant === 'preview' && showFavoriteButton && (
              <button 
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {isFavorite ? '★' : '☆'}
              </button>
            )}
            
            <div className="card-number">#{data.id}</div>
            <div className="card-image-wrapper">
              <img 
                src={getImageUrl()} 
                alt={data.name}
                className="card-image"
                loading="lazy"
              />
            </div>
            <div className="card-title-front">{data.name}</div>
            
            {/* Indicador de click (solo en preview) */}
            {variant === 'preview' && !isFlipped && (
              <div className="card-click-hint">
                {t('cardClickForDetails') || 'Click para ver detalles'}
              </div>
            )}
          </div>
        </div>

        <div className="card-back">
          <div className="card-border">
            <div className="card-number">#{data.id}</div>
            <div className="card-header">
              <h3 className="card-title-back">{data.name}</h3>
            </div>
            
            <div className="card-info">
              {infoItems.map((item, index) => (
                <div key={index} className="info-row">
                  <span className="info-label">{item.key}:</span>
                  <span 
                    className="info-value"
                    title={item.value}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="card-footer">
              <span className="flip-hint">
                {variant === 'detail' 
                  ? (isFlipped ? 'Pasa el cursor para ver la imagen' : 'Pasa el cursor para ver los detalles') 
                  : (isFlipped ? t('cardClickForImage') || 'Click para ver imagen' : t('cardClickForInfo') || 'Click para ver información')
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;