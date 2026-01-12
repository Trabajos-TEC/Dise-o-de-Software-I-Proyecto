// src/components/CardDetail.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import MainLayout from './MainLayout';
import type { CardData } from './Card';
import Card from './Card';
import '../styles/components/CardDetail.css';
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const CardDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cardData = location.state?.cardData as CardData;
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { t } = useLanguage();

  // Depuración: Ver qué datos estamos recibiendo
  useEffect(() => {
    console.log('=== CARD DETAIL DEBUG ===');
    console.log('CardData completo:', cardData);
    console.log('Tipo de carta:', cardData?.type);
    console.log('info1, info2, info3:', cardData?.info1, cardData?.info2, cardData?.info3);
    console.log('additionalInfo:', cardData?.additionalInfo);
    console.log('season (prop directa):', cardData?.season);
    
    if (cardData?.type === 'episode') {
      console.log('=== EPISODIO ESPECÍFICO ===');
      console.log('Tiene info1 (season?):', cardData.info1);
      console.log('Tiene info2 (episode?):', cardData.info2);
      console.log('Tiene info3 (airdate?):', cardData.info3);
      console.log('Tiene season prop:', cardData.season);
    }
  }, [cardData]);

  const handleFavoriteToggle = async () => {
    const user = auth.currentUser;
    if (!user || !cardData) {
      console.warn("No hay usuario o carta");
      return;
    }

    const favoriteId = `${cardData.type}-${cardData.id}`;
    const favRef = doc(db, "users", user.uid, "favorites", favoriteId);

    try {
      const snapshot = await getDoc(favRef);

      if (snapshot.exists()) {
        await deleteDoc(favRef);
        setIsFavorite(false);
        alert(t('removedFromFavorites'));
      } else {
        await setDoc(favRef, {
          ...cardData,
          createdAt: new Date()
        });
        setIsFavorite(true);
        alert(t('addedToFavorites'));
      }
    } catch (error) {
      console.error("Error manejando favoritos:", error);
    }
  };

  const handleCardClickInDetail = () => {
    console.log('Carta clickeada en modo detalle');
  };

  // Función para formatear la fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Función para obtener el tipo traducido
  const getTranslatedType = () => {
    const type = cardData.type?.toLowerCase();
    switch (type) {
      case 'character':
        return t('character');
      case 'episode':
        return t('episode');
      case 'location':
        return t('location');
      default:
        return cardData.type || 'Carta';
    }
  };

  // Renderizar información específica según el tipo
  const renderTypeSpecificInfo = () => {
    if (!cardData) return null;

    console.log('Renderizando info para tipo:', cardData.type);

    const type = cardData.type?.toLowerCase();
    
    switch (type) {
      case 'character':
        return (
          <div className="character-info">
            <h4>{t('characterDetails')}</h4>
            <p>{t('characterDescription')} <strong>{cardData.name}</strong>.</p>
            
            {cardData.info1 && (
              <p>{t('characterCurrently')} <strong>{cardData.info1}</strong>.</p>
            )}
            
            {cardData.info2 && (
              <p>{t('characterGender')} <strong>{cardData.info2}</strong>.</p>
            )}
            
            {cardData.info3 && (
              <p>{t('characterOccupation')} <strong>{cardData.info3}</strong>.</p>
            )}
            
            {cardData.additionalInfo?.age && (
              <p>{t('characterAge')} <strong>{cardData.additionalInfo.age}</strong> {t('characterAgeYears')}.</p>
            )}
            
            {cardData.additionalInfo?.birthdate && (
              <p>{t('characterBorn')} <strong>{formatDate(cardData.additionalInfo.birthdate)}</strong>.</p>
            )}
            
            {cardData.additionalInfo?.phrases && cardData.additionalInfo.phrases.length > 0 && (
              <div className="famous-phrases">
                <p><strong>{t('famousPhrases')}:</strong></p>
                <ul>
                  {cardData.additionalInfo.phrases.slice(0, 3).map((phrase: string, index: number) => (
                    <li key={index}>"{phrase}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'episode':
        console.log('Renderizando episodio con data:', {
          info1: cardData.info1,
          info2: cardData.info2,
          info3: cardData.info3,
          seasonProp: cardData.season,
          additionalInfo: cardData.additionalInfo
        });
        
        return (
          <div className="episode-info">
            <h4>{t('episodeDetails')}</h4>
            <p>{t('episodeDescription')} <strong>"{cardData.name}"</strong>.</p>
            
            {/* PRIMERO BUSCAR EN info1, info2, info3 */}
            {cardData.info1 && (
              <p>{t('episodeSeason')} <strong>{cardData.info1}</strong>.</p>
            )}
            
            {cardData.info2 && (
              <p>{t('episodeNumber')} <strong>{cardData.info2}</strong>.</p>
            )}
            
            {cardData.info3 && (
              <p>{t('episodeAired')} <strong>{formatDate(cardData.info3)}</strong>.</p>
            )}
            
            {/* LUEGO BUSCAR EN additionalInfo */}
            {!cardData.info1 && cardData.additionalInfo?.season && (
              <p>{t('episodeSeason')} <strong>{cardData.additionalInfo.season}</strong>.</p>
            )}
            
            {!cardData.info2 && cardData.additionalInfo?.episodeNumber && (
              <p>{t('episodeNumber')} <strong>{cardData.additionalInfo.episodeNumber}</strong>.</p>
            )}
            
            {!cardData.info3 && cardData.additionalInfo?.airdate && (
              <p>{t('episodeAired')} <strong>{formatDate(cardData.additionalInfo.airdate)}</strong>.</p>
            )}
            
            {/* FINALMENTE BUSCAR EN season PROP DIRECTA */}
            {!cardData.info1 && !cardData.additionalInfo?.season && cardData.season && (
              <p>{t('episodeSeason')} <strong>{cardData.season}</strong>.</p>
            )}
            
            {cardData.additionalInfo?.synopsis && (
              <div className="synopsis">
                <p><strong>{t('synopsis')}:</strong></p>
                <p>{cardData.additionalInfo.synopsis}</p>
              </div>
            )}
            
            {/* MOSTRAR MENSAJE SI NO HAY INFO */}
            {!cardData.info1 && !cardData.info2 && !cardData.info3 && 
             !cardData.season && !cardData.additionalInfo?.season && 
             !cardData.additionalInfo?.episodeNumber && (
              <div className="no-episode-info">
                <p>No hay información de temporada o número de episodio disponible.</p>
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="location-info">
            <h4>{t('locationDetails')}</h4>
            <p>{t('locationDescription')} <strong>{cardData.name}</strong>.</p>
            
            {cardData.info1 && (
              <p>{t('locatedIn')} <strong>{cardData.info1}</strong>.</p>
            )}
            
            {cardData.info2 && (
              <p>{t('mainUse')} <strong>{cardData.info2}</strong>.</p>
            )}
            
            {cardData.additionalInfo?.town && (
              <p>{t('partOfTown')} <strong>{cardData.additionalInfo.town}</strong>.</p>
            )}
            
            {cardData.additionalInfo?.use && (
              <p>{t('usedAs')} <strong>{cardData.additionalInfo.use}</strong>.</p>
            )}
          </div>
        );

      default:
        return (
          <div className="general-info">
            <h4>{t('cardDetails')}</h4>
            <p>{t('cardDescription') || 'Esta carta representa a'} <strong>{cardData.name}</strong>.</p>
            
            {cardData.info1 && <p><strong>{t('status')}:</strong> {cardData.info1}</p>}
            {cardData.info2 && <p><strong>{t('gender')}:</strong> {cardData.info2}</p>}
            {cardData.info3 && <p><strong>{t('occupation')}:</strong> {cardData.info3}</p>}
          </div>
        );
    }
  };

  if (!cardData) {
    return (
      <MainLayout>
        <div className="card-detail-container">
          <h2>{t('cardNotFound')}</h2>
          <button onClick={() => navigate('/')}>
            {t('backToHome')}
          </button>
        </div>
      </MainLayout>
    );
  }

  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';

  return (
    <MainLayout>
      <div className="card-detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← {t('goBack')}
        </button>
        
        <div className="card-detail-content">
          <div className="card-detail-left">
            <Card 
              data={cardData}
              size="medium"
              flipOnHover={true}
              variant="detail"
              showFavoriteButton={true}
              isFavorite={isFavorite}
              onFavoriteToggle={handleFavoriteToggle}
              onClick={handleCardClickInDetail}
            />
          </div>
          
          <div className="card-detail-right">
            <h1>{cardData.name}</h1>
            <div className="card-type-badge">
              {getTranslatedType()}
            </div>
            
            <div className="card-detail-section">
              <h3>{t('detailedInformation')}</h3>
              <div className="info-content">
                {renderTypeSpecificInfo()}
                
                {isDevelopment && (
                  <div className="technical-info">
                    <h5>Información Técnica</h5>
                    <p><small>ID: {cardData.id} | Tipo: {cardData.type}</small></p>
                    <p><small>info1: {cardData.info1 || 'N/A'} | info2: {cardData.info2 || 'N/A'} | info3: {cardData.info3 || 'N/A'}</small></p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card-actions">
              <button className="action-button share-button">
                {t('share')}
              </button>
              <button
                className={`action-button ${isFavorite ? 'remove-button' : 'collect-button'}`}
                onClick={handleFavoriteToggle}
              >
                {isFavorite ? t('removeFromCollection') : t('addToCollection')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CardDetail;