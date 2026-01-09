// src/components/CardDetail.tsx
import React, { useState } from 'react';
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
  const [isFavorite] = useState(false);
  
  const { t } = useLanguage();

  const handleFavoriteToggle  = async () => {
  const user = auth.currentUser;
  if (!user || !cardData) {
    console.warn("No hay usuario o carta");
    return;
  }

  // ID ÚNICO → evita sobreescritura
  const favoriteId = `${cardData.type}-${cardData.id}`;

  const favRef = doc(db, "users", user.uid, "favorites", favoriteId);

  try {
    const snapshot = await getDoc(favRef);

    if (snapshot.exists()) {
      // Ya está en favoritos → lo quitamos
      await deleteDoc(favRef);
      alert("Se elimino de favoritos")
      console.log("Eliminado de favoritos");
    } else {
      // No está → lo agregamos
      await setDoc(favRef, {
        ...cardData,
        createdAt: new Date()
      });
      alert("Se agrego a favoritos")
      console.log("Agregado a favoritos");
    }
  } catch (error) {
    console.error("Error manejando favoritos:", error);
  }
  };

  // Función específica para la carta en modo detalle
  const handleCardClickInDetail = () => {
    // En modo detail, solo queremos el efecto flip, no navegar
    console.log('Carta clickeada en modo detalle');
  };

  if (!cardData) {
    return (
      <MainLayout>
        <div className="card-detail-container">
          <h2>Carta no encontrada</h2>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="card-detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← {t('goBack') || 'Volver'}
        </button>
        
        <div className="card-detail-content">
          {/* CARTA A LA IZQUIERDA */}
          <div className="card-detail-left">
              <Card 
              data={cardData}
              size="medium" // Cambia de "large" a "medium"
              flipOnHover={true}
              variant="detail"
              showFavoriteButton={true}
              isFavorite={isFavorite}
              onFavoriteToggle={handleFavoriteToggle}
              onClick={handleCardClickInDetail}
              />
          </div>
          
          {/* INFORMACIÓN A LA DERECHA */}
          <div className="card-detail-right">
            <h1>{cardData.name}</h1>
            <div className="card-type-badge">{cardData.type}</div>
            
            <div className="card-detail-section">
              <h3>Información de la carta</h3>
              <div className="info-placeholder">
                <p><strong>ID:</strong> {cardData.id}</p>
                <p><strong>Tipo:</strong> {cardData.type}</p>
                <p><strong>Imagen:</strong> {cardData.image_path}</p>
                
                {cardData.info1 && <p><strong>Información 1:</strong> {cardData.info1}</p>}
                {cardData.info2 && <p><strong>Información 2:</strong> {cardData.info2}</p>}
                {cardData.info3 && <p><strong>Información 3:</strong> {cardData.info3}</p>}
                
                <div className="api-notice">
                  <h4>Información de la API</h4>
                  <p>La información detallada se cargará aquí desde la API:</p>
                  <ul>
                    <li>Estadísticas completas</li>
                    <li>Historial de apariciones</li>
                    <li>Datos exclusivos</li>
                    <li>Información específica del {cardData.type}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="card-actions">
              <button className="action-button share-button">
                Compartir
              </button>
              <button
                className="action-button collect-button"
                onClick={handleFavoriteToggle}
              >
                Agregar a colección
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CardDetail;