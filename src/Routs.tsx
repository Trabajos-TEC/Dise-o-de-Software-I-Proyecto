import { Routes, Route } from "react-router-dom";
import Login from "./login";
import LoginEmail from "./loginEmail";
import LoginGoogle from "./loginGoogle";
import App from "./App";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/loginEmail" element={<LoginEmail />} />
      <Route path="/loginGoogle" element={<LoginGoogle />} />
      <Route path="/" element={<App />} />
    </Routes>
  );
}
