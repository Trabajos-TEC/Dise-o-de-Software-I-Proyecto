// components/perfilButton.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebaseConfig";

function PerfilButton() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <button
      className="perfil-button"
      onClick={() => navigate("/perfil")}
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
        "Perfil"
      )}
    </button>
  );
}

export default PerfilButton;
