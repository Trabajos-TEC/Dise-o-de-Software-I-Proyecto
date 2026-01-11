// components/SignInButton.jsx
import { useNavigate } from 'react-router-dom';

function favoritosButton() {
  const navigate = useNavigate();

  return (
    <button
      className="button secondary"
      onClick={() => navigate("/favoritos")}
      style={{ marginTop: 20 }}

    >
      Favoritos
    </button>
  );
}

export default favoritosButton;