// src/loginEmail.tsx
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import MainLayout from "./components/MainLayout";
import "./login.css";

export default function LoginEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        alert("Login failed: " + error.message);
      } else {
        alert("Unexpected error");
      }
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        alert("Sign up failed: " + error.message);
      } else {
        alert("Unexpected error");
      }
    }
  };

  return (
    <MainLayout 
      headerProps={{
        showSearch: false, // Oculta la barra de búsqueda
      }}
    >
      <div className="container">
        <h1 className="title">Login con Email</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <button className="button" onClick={signIn}>
          Login
        </button>

        <button className="button secondary" onClick={signUp}>
          Create Account
        </button>
        
        <button
          className="button secondary"
          onClick={() => navigate("/login")}
          style={{ marginTop: '10px' }}
        >
          ← Volver
        </button>
      </div>
    </MainLayout>
  );
}