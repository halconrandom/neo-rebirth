import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import fondoHome from "../assets/fondo-home.jpg";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header
      className="relative hero-section text-white"
      style={{
        backgroundImage: `url(${fondoHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 z-0" />

      {/* Contenido por encima del overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">
        <h2 className="text-4xl font-bold mb-4">El Ciclo Comienza Otra Vez</h2>
        <p className="text-lg mb-8">
          En un mundo de pactos rotos y clanes antiguos, el legado ninja renace.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/foro" className="btn-primary">
            Entrar al foro
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/tienda" className="btn-primary">
                Ir a la tienda
              </Link>
              <Link
                to="/perfil"
                className="btn-primary"
              >
                Ir a mi perfil
              </Link>
            </>
          )}

          {!isLoggedIn && (
            <Link to="/registro" className="btn-secondary">
              Registrarse
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
