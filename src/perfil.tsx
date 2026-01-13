// src/Perfil.tsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { signOut } from "firebase/auth";
import Favoritos from "./components/favoritosButton";
import { useLanguage } from "./context/LanguageContext";
import MainLayout from "./components/MainLayout";

export default function Perfil() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        ///////////////////////////////////////////////
        //Cambiar este alert por algo mas bonito etc.//
        ///////////////////////////////////////////////
        alert(t('mustLogin'));
        navigate("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, t]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container">
          <h2>{t('loading')}</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container">
        <h1 className="title">{t('profile')}</h1>

        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={t('profilePicture')}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              marginBottom: 16,
            }}
          />
        )}

        <p><strong>{t('name')}:</strong> {user?.displayName ?? t('notAvailable')}</p>
        <p><strong>{t('email')}:</strong> {user?.email}</p>
        <p>
          <strong>{t('provider')}:</strong>{" "}
          {user?.providerData[0]?.providerId}
        </p>
        
        <button
          className="button secondary"
          style={{ marginTop: 20 }}
          onClick={async () => {
            await signOut(auth);
            navigate("/login");
          }}
        >
          {t('logout')}
        </button>
        
        <Favoritos />
        
        <button
          className="button secondary"
          onClick={() => navigate("/")}
          style={{ marginTop: 10 }}
        >
          {t('backToHome')}
        </button>  
      </div>
    </MainLayout>
  );
}