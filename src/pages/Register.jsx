import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombreUsuario: "",
    biografia: "",
    twitter: "",
    discord: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    if (!form.nombreUsuario.trim()) {
      setUsernameAvailable(null);
      return;
    }

    const delay = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const q = query(
          collection(db, "users"),
          where("nombreUsuario", "==", form.nombreUsuario.trim())
        );
        const snap = await getDocs(q);
        setUsernameAvailable(snap.empty);
      } catch (err) {
        console.error("Error al verificar nombre:", err);
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 600);

    return () => clearTimeout(delay);
  }, [form.nombreUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password, nombreUsuario } = form;

    if (!nombreUsuario.trim() || !email.trim() || !password.trim()) {
      setError("Debes completar todos los campos obligatorios.");
      return;
    }

    if (!email.includes("@")) {
      setError("Correo inválido.");
      return;
    }

    // Verificación del nombre de usuario
    setIsCheckingUsername(true);
    const q = query(
      collection(db, "users"),
      where("nombreUsuario", "==", nombreUsuario.trim())
    );
    const snap = await getDocs(q);
    const available = snap.empty;
    setIsCheckingUsername(false);

    if (!available) {
      setError("Ese nombre de usuario ya está en uso.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        nombreUsuario: nombreUsuario.trim(),
        email,
        creado: new Date(),
        rol: "user",
        avatarURL: "", // default o se puede generar automáticamente
        biografia: form.biografia.trim(),
        redes: {
          twitter: form.twitter.trim(),
          discord: form.discord.trim(),
        },
        fichaDestacada: null,
        ultimaActividad: new Date(),
      });

      setSuccess(true);
    } catch (err) {
      setError("Error al crear cuenta: " + err.message);
    }
  };

  return (
    <div className="py-24 text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Registro Shinobi</h2>
      <p className="text-gray-400 mb-8">Regístrate con tu correo.</p>

      {success ? (
        <div className="text-green-400 font-semibold">
          ¡Cuenta creada con éxito!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-4 text-left"
        >
          <input
            type="text"
            name="nombreUsuario"
            placeholder="Nombre de usuario"
            value={form.nombreUsuario}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {form.nombreUsuario && (
            <p className="text-sm mt-1">
              {isCheckingUsername ? (
                <span className="text-yellow-400">
                  Verificando disponibilidad...
                </span>
              ) : usernameAvailable === true ? (
                <span className="text-green-400">Nombre disponible</span>
              ) : usernameAvailable === false ? (
                <span className="text-red-400">Nombre ya está en uso</span>
              ) : null}
            </p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <textarea
            name="biografia"
            placeholder="Biografía pública (opcional)"
            value={form.biografia}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <input
            type="text"
            name="twitter"
            placeholder="Twitter (opcional)"
            value={form.twitter}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <input
            type="text"
            name="discord"
            placeholder="Discord (opcional)"
            value={form.discord}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="btn-primary w-full disabled:opacity-50"
            disabled={isCheckingUsername || usernameAvailable === false}
          >
            {isCheckingUsername ? "Verificando..." : "Crear cuenta"}
          </button>
        </form>
      )}
    </div>
  );
}
