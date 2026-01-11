// src/Routs.tsx - VERSIÓN COMPLETA
import { Routes, Route } from "react-router-dom";
import Login from "./login";
import LoginEmail from "./loginEmail";
import LoginGoogle from "./loginGoogle";
import App from "./App";
import CardDetail from "./components/CardDetail";
import SearchResults from "./SearchResults";
import Perfil from "./perfil"
import Favoritos from "./favoritos"
import Analytics from "./Analytics"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/loginEmail" element={<LoginEmail />} />
      <Route path="/loginGoogle" element={<LoginGoogle />} />
      <Route path="/" element={<App />} />
      <Route path="/card/:id" element={<CardDetail />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/perfil" element={<Perfil/>} />
      <Route path="/favoritos" element={<Favoritos/>} />
      <Route path="/analytics" element={<Analytics/>} />
    </Routes>
  );
}