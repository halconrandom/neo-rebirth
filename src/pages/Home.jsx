import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="hero-section">
      <h2 className="hero-title">El Ciclo Comienza Otra Vez</h2>
      <p className="hero-subtitle">
        En un mundo de pactos rotos y clanes antiguos, el legado ninja renace.
      </p>

      <div className="hero-buttons">
        <Link to="/foro" className="btn-primary">Entrar al foro</Link>

        {isLoggedIn && (
          <>
            <Link to="/tienda" className="btn-primary">Ir a la tienda</Link>
            <Link to="/perfil" className="btn-secondary">Ir a mi perfil</Link>
          </>
        )}

        {!isLoggedIn && (
          <Link to="/registro" className="btn-secondary">Registrarse</Link>
        )}
      </div>
    </header>
  );
}
