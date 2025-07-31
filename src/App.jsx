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

import "./App.css";

function App() {
  return (
    <div className="app-container">

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/foro" element={<ForumsPage />} />
        <Route path="/fichas/:id" element={<FichaDetalle />} />
        <Route path="/tienda" element={<Tienda />} /> 
      </Routes>
    </div>
  );
}

export default App;
