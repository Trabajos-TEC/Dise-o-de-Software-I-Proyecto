import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function LoginGoogle() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        alert("Google login failed: " + error.message);
      } else {
        alert("Unexpected error");
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Login con Google</h1>

      <button className="button" onClick={signInWithGoogle}>
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
