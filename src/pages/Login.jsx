// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/perfil");
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="py-24 text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Iniciar Sesión</h2>
      <p className="text-gray-400 mb-8">Accede con tu cuenta de Shinobi Legacy</p>

      <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4 text-left">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="btn-primary w-full">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
