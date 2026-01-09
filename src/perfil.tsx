// src/Perfil.tsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { signOut } from "firebase/auth";
import Favoritos from "./components/favoritosButton"
export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        ///////////////////////////////////////////////
        //Cambiar este alert por algo mas bonito etc.//
        ///////////////////////////////////////////////
        alert("Debes iniciar sesion")
        navigate("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="container">Cargando...</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Perfil</h1>

      {user?.photoURL && (
        <img
          src={user.photoURL}
          alt="Foto de perfil"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            marginBottom: 16,
          }}
        />
      )}

      <p><strong>Nombre:</strong> {user?.displayName ?? "No disponible"}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p>
        <strong>Proveedor:</strong>{" "}
        {user?.providerData[0]?.providerId}
      </p>
      <button
        className="button secondary"
        style={{ marginTop: 20 }}
        onClick={async () => {await signOut(auth);navigate("/login");}}>
        Cerrar sesión
        </button>
        <Favoritos/>
        <button
          className="button secondary"
          onClick={() => navigate("/")}
        >
          Volver
        </button>  
    </div>
    
  );
}
