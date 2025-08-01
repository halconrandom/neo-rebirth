import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const cerrarSesion = () => {
    auth.signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar sticky top-0 z-50 bg-zinc-900 text-white px-6 py-4 border-b border-zinc-700 shadow-md animate-fadeIn">
      <div className="flex items-center justify-between w-full">
        {/* Logo + Botón juntos a la izquierda */}
        <div className="flex items-center gap-5">
          {/* Botón hamburguesa */}
          <button
            className="sm:hidden text-orange-400 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Título */}
          <h1 className="text-base sm:text-xl font-bold tracking-wide text-orange-400 whitespace-nowrap">
            Shinobi Legacy: Neo Rebirth
          </h1>
        </div>

        {/* Enlaces desktop */}
        <div className="hidden sm:flex gap-6 items-center">
          <Link
            to="/"
            className="nav-link text-orange-400 hover:text-orange-300"
          >
            Inicio
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/registro"
                className="nav-link text-orange-400 hover:text-orange-300"
              >
                Registro
              </Link>
              <Link
                to="/login"
                className="nav-link text-orange-400 hover:text-orange-300"
              >
                Iniciar sesión
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/foro"
                className="nav-link text-orange-400 hover:text-orange-300"
              >
                Foro
              </Link>
              <Link
                to="/perfil"
                className="nav-link text-orange-400 hover:text-orange-300"
              >
                Perfil {nombreUsuario}
              </Link>
              <Link
                to="/tienda"
                className="nav-link text-orange-400 hover:text-orange-300"
              >
                Tienda
              </Link>
              <button
                onClick={cerrarSesion}
                className="text-red-400 hover:text-red-300"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {/* Sidebar móvil lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 z-50 transform transition-transform duration-300 ease-in-out sm:hidden shadow-lg border-r border-orange-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col gap-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="self-end text-orange-400 text-xl font-bold"
          >
            ✕
          </button>

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-orange-400"
          >
            Inicio
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/registro"
                onClick={() => setIsMenuOpen(false)}
                className="text-orange-400"
              >
                Registro
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-orange-400"
              >
                Iniciar sesión
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/foro"
                onClick={() => setIsMenuOpen(false)}
                className="text-orange-400"
              >
                Foro
              </Link>
              <Link
                to="/perfil"
                onClick={() => setIsMenuOpen(false)}
                className="text-orange-400"
              >
                Perfil {nombreUsuario}
              </Link>
              <Link
                to="/tienda"
                onClick={() => setIsMenuOpen(false)}
                className="text-orange-400"
              >
                Tienda
              </Link>
              <button onClick={cerrarSesion} className="text-red-400 text-left">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
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
