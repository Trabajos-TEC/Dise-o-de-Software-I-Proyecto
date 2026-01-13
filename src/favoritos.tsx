// src/favoritos.tsx
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import Card from "./components/Card";
import type { CardData } from "./components/Card";
import { useNavigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { useLanguage } from "./context/LanguageContext";
import './styles/favoritos.css';

export default function Favoritos() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const ref = collection(db, "users", user.uid, "favorites");

        const unsub = onSnapshot(ref, snap => {
            const data = snap.docs.map(d => d.data() as CardData);
            setCards(data);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleCardClick = (card: CardData) => {
        navigate(`/card/${card.type}-${card.id}`, { 
            state: { 
                cardData: card 
            } 
        });
    };

    const handleBackToProfile = () => {
        navigate("/perfil");
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="favoritos-loading">
                    <h2>{t('loading')}</h2>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="favoritos-container">
                <div className="favoritos-header-container">
                    <div className="favoritos-header">
                        <h1>{t('favorites')}</h1>
                        <p className="favoritos-count">
                            {cards.length} {t('favoriteItems')}
                        </p>
                    </div>
                </div>

                {cards.length === 0 ? (
                    <div className="no-favoritos-message">
                        <p>{t('noFavorites')}</p>
                        <button
                            className="favoritos-back-btn"
                            onClick={() => navigate("/")}
                        >
                            {t('exploreContent')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="favoritos-grid">
                            {cards.map(card => (
                                <div key={`${card.type}-${card.id}`} className="favorito-card-container">
                                    <Card
                                        data={card}
                                        size="medium"
                                        variant="preview"
                                        showFavoriteButton={true}
                                        isFavorite={true}
                                        onClick={() => handleCardClick(card)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="favoritos-actions">
                            <button
                                className="favoritos-back-btn secondary"
                                onClick={handleBackToProfile}
                            >
                                {t('backToProfile')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}