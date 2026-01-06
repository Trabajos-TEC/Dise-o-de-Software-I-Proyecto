import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function LoginGoogle() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">Login con Google</h1>

      <button className="button">
        Continuar con Google
      </button>

      <button
        className="button secondary"
        onClick={() => navigate("/login")}
      >
        Volver
      </button>
    </div>
  );
}
