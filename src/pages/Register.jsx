import { useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { query, collection, where, getDocs } from "firebase/firestore";


export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", nombreUsuario: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {1
    // 1. Verifica si el nombre ya existe
    const q = query(
      collection(db, "users"),
      where("nombreUsuario", "==", form.nombreUsuario)
    );
    const querySnapshot = await getDocs(q);

    if (!form.nombreUsuario.trim()) {
      setError("El nombre de usuario no puede estar vacío.");
      return;
    }

    if (!form.email.trim() || !form.password.trim()) {
      setError("Debes completar todos los campos.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Correo inválido.");
      return;
    }

    if (querySnapshot.size > 0) {
      setError("Este nombre de usuario ya está en uso.");
      return;
    }

    // 2. Crea usuario
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );
    const userId = userCredential.user.uid;

    // 3. Guarda en Firestore
    await setDoc(doc(db, "users", userId), {
      nombreUsuario: form.nombreUsuario,
      email: form.email,
      creado: new Date(),
    });

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

            <input
              type="text"
              name="nombreUsuario"
              placeholder="Nombre de usuario"
              value={form.nombreUsuario}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />

          {error && <p className="text-red-500">{error}</p>}

          <button type="submit" className="btn-primary w-full">
            Crear cuenta
          </button>
        </form>
      )}
    </div>
  );
}
