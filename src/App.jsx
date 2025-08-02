import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ForumsPage from "./forums/ForumsPage";
import FichaDetalle from "./pages/FichaDetalle";
import Tienda from "./pages/Tienda";
import PerfilPublico from "./components/PerfilPublico";
import AdminPanel from "./components/adminPanel/AdminPanel";
import UserSettings from "./components/ProfileSettings";


import "./App.css";

function App() {
  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/foro" element={<ForumsPage />} />
          <Route path="/fichas/:id" element={<FichaDetalle />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/perfil-publico/:id" element={<PerfilPublico />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/ajustes" element={<UserSettings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
