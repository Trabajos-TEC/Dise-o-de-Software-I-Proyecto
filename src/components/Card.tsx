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
}

interface CardProps {
  data: CardData;
  size?: 'small' | 'medium' | 'large';
  flipOnHover?: boolean;
  showDetails?: boolean; // Este parámetro ya no afecta el frente, solo si es para búsqueda
}

const Card: React.FC<CardProps> = ({ 
  data, 
  size = 'medium',
  flipOnHover = false,

}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useLanguage();

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMouseEnter = () => {
    if (flipOnHover) {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (flipOnHover) {
      setIsFlipped(false);
    }
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
      className={`card-container ${sizeClass} ${typeClass}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`card-inner ${isFlipped ? 'card-flipped' : ''}`}>
        
        <div className="card-front">
          <div className="card-border">
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
            {/* SIN detalles adicionales en el frente */}
          </div>
        </div>

        <div className="card-back">
          <div className="card-border">
            <div className="card-number">#{data.id}</div>
            <div className="card-header">
              <h3 className="card-title-back">{data.name}</h3>
              {/* Sin badge de tipo */}
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
                {isFlipped ? t('cardClickForImage') : t('cardClickForInfo')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;