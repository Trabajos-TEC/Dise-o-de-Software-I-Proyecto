// src/login.tsx (el archivo principal de selección de método)
import { useNavigate } from "react-router-dom";
//import MainLayout from "./components/MainLayout";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    //<MainLayout headerProps={{showSearch: false, // Oculta la barra de búsqueda}}>
      <div className="container">
        <h1 className="title">Iniciar sesión</h1>

        <button
          className="button"
          onClick={() => navigate("/loginEmail")}
        >
          Iniciar sesión con correo
        </button>

        <button
          className="button secondary"
          onClick={() => navigate("/loginGoogle")}
        >
          Iniciar sesión con Google
        </button>
        <button
          className="button secondary"
          onClick={() => navigate("/")}
        >
          Volver
        </button>
      </div>
   // </MainLayout>
  );
}