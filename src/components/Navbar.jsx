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
    <nav className="navbar sticky top-0 z-50 bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-700 shadow-md animate-fadeIn">
      <h1 className="text-2xl font-bold tracking-wide text-orange-400">
        Shinobi Legacy: Neo Rebirth
      </h1>
      <div className="flex gap-6 items-center">
        <Link to="/" className="nav-link text-orange-400 hover:text-orange-300">Inicio</Link>
        {!isLoggedIn && (
          <>
            <Link to="/registro" className="nav-link text-orange-400 hover:text-orange-300">Registro</Link>
            <Link to="/login" className="nav-link text-orange-400 hover:text-orange-300">Iniciar sesión</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/foro" className="nav-link text-orange-400 hover:text-orange-300">Foro</Link>
            <Link to="/perfil" className="nav-link text-orange-400 hover:text-orange-300">
              Perfil {nombreUsuario}
            </Link>
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

      <style jsx>{`
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 2px;
          background-color: #f97316;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </nav>
  );
}
