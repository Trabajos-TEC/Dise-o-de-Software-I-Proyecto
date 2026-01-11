import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import Card from "./components/Card";
import type { CardData } from "./components/Card";
import { useNavigate } from "react-router-dom";
export default function Favoritos() {
    const [cards, setCards] = useState<CardData[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

    const ref = collection(db, "users", user.uid, "favorites");

    const unsub = onSnapshot(ref, snap => {
      const data = snap.docs.map(d => d.data() as CardData);
      setCards(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="container">
      <h1>Favoritos</h1>

      {cards.length === 0
        ? <p>No hay favoritos</p>
        : cards.map(card => (
            <Card
              key={card.id}
              data={card}
              showFavoriteButton
              isFavorite
            />
          ))}
        <button
          className="button secondary"
          onClick={() => navigate("/perfil")}
        >
          Volver
        </button>   
    </div>
  );
}
