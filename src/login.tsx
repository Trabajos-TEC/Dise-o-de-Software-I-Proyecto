import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
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
    </div>
  );
}
