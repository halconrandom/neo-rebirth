import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="py-24 text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Registro Shinobi</h2>
      <p className="text-gray-400 mb-8">Regístrate con tu correo.</p>

      {success ? (
        <div className="text-green-400 font-semibold">¡Cuenta creada con éxito!</div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-left">
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
            Crear cuenta
          </button>
        </form>
      )}
    </div>
  );
}
