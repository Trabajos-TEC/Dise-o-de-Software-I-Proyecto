// src/loginGoogle.tsx
import { useNavigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import "./Login.css";

export default function LoginGoogle() {
  const navigate = useNavigate();

  return (
    <MainLayout 
      headerProps={{
        showSearch: false, // Oculta la barra de búsqueda
      }}
    >
      <div className="container">
        <h1 className="title">Login con Google</h1>

        <button className="button">
          Continuar con Google
        </button>

        <button
          className="button secondary"
          onClick={() => navigate("/login")}
        >
          ← Volver
        </button>
      </div>
    </MainLayout>
  );
}