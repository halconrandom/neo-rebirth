import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Shinobi Legacy: Neo Rebirth</h1>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/registro">Registro</Link>
      </div>
    </nav>
  );
}
