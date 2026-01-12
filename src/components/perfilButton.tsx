import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface PerfilButtonProps {
  onClick?: () => void;
}

function PerfilButton({ onClick }: PerfilButtonProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    navigate("/perfil");
    if (onClick) onClick();
  };

  return (
    <button
      className="perfil-btn"
      onClick={handleClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="Perfil"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <span className="btn-text">Perfil</span>
      )}
    </button>
  );
}

export default PerfilButton;