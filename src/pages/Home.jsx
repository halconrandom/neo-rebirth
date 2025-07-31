import { Link } from "react-router-dom";

export default function Home() {
  return (
    <header className="hero-section">
      <h2 className="hero-title">El Ciclo Comienza Otra Vez</h2>
      <p className="hero-subtitle">
        En un mundo de pactos rotos y clanes antiguos, el legado ninja renace.
      </p>
      <div className="hero-buttons">
        <Link to="/foro" className="btn-primary">Entrar al foro</Link>
        <a href="/registro" className="btn-secondary">Registrarse</a>
      </div>
    </header>
  );
}
