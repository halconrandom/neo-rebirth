import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setNombreUsuario(snap.data().nombreUsuario);
        }
      } else {
        setNombreUsuario("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Shinobi Legacy: Neo Rebirth</h1>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        {!isLoggedIn && <Link to="/registro">Registro</Link>}
        {!isLoggedIn && <Link to="/login">Iniciar sesión</Link>}

        {isLoggedIn && (
          <>
            <Link to="/perfil">Perfil {nombreUsuario}</Link>
            <button
              onClick={() => {
                auth.signOut();
              }}
              className="ml-4 text-red-400 hover:text-red-200 transition"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
