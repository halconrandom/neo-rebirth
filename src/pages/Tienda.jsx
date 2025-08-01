import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const mockProductos = {
  Armas: [
    { id: 1, nombre: "Katana Convencional", descripcion: "Espada afilada de corto alcance. La vieja y confiable", precio: 200 },
    { id: 2, nombre: "Shuriken", descripcion: "Lanzables de metal afilado.", precio: 50 },
  ],
  Medicina: [
    { id: 3, nombre: "Píldora roja", descripcion: "Recupera 50 HP.", precio: 100 },
    { id: 4, nombre: "Pomada", descripcion: "Cura heridas leves.", precio: 70 },
  ],
};

export default function Tienda() {
  const [categoria, setCategoria] = useState("Armas");
  const [carrito, setCarrito] = useState([]);
  const [personajes, setPersonajes] = useState([]);
  const [personajeId, setPersonajeId] = useState("");
  const [personajeActivo, setPersonajeActivo] = useState(null);

  // Cargar personajes del usuario
  useEffect(() => {
    const cargarPersonajes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const fichasRef = collection(db, "users", user.uid, "fichas");
      const snap = await getDocs(fichasRef);
      const personajesCargados = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPersonajes(personajesCargados);
      if (personajesCargados.length > 0) {
        setPersonajeId(personajesCargados[0].id); // seleccionar el primero por defecto
      }
    };

    cargarPersonajes();
  }, []);

  // Cargar datos del personaje seleccionado
  useEffect(() => {
    const fetchPersonaje = async () => {
      const user = auth.currentUser;
      if (!user || !personajeId) return;

      const docRef = doc(db, "users", user.uid, "fichas", personajeId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setPersonajeActivo({ id: snap.id, ...snap.data() });
      }
    };

    fetchPersonaje();
  }, [personajeId]);

  const agregarAlCarrito = (producto) => {
    const yaExiste = carrito.find((item) => item.id === producto.id);
    if (yaExiste) {
      setCarrito((prev) =>
        prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito((prev) => [...prev, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const resetearCarrito = () => setCarrito([]);

  const totalCompra = carrito.reduce(
    (acc, obj) => acc + obj.precio * obj.cantidad,
    0
  );

  // Confirmar compra y actualizar Ryus
  const handleCompra = async () => {
    const user = auth.currentUser;
    if (!user || !personajeActivo) return;

    const nuevoTotal = personajeActivo.ryus - totalCompra;

    if (nuevoTotal < 0) {
      alert("No tienes suficiente dinero.");
      return;
    }

    try {
      const fichaRef = doc(db, "users", user.uid, "fichas", personajeActivo.id);
      await setDoc(
        fichaRef,
        { ryus: nuevoTotal },
        { merge: true }
      );

      alert("¡Compra realizada!");
      setCarrito([]);
      setPersonajeActivo((prev) => ({ ...prev, ryus: nuevoTotal }));
    } catch (error) {
      console.error("Error al procesar compra:", error);
      alert("Error al procesar la compra.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen text-white">
      {/* Sidebar */}
      <div className="w-full sm:w-1/4 p-4 bg-zinc-900 border-b sm:border-b-0 sm:border-r border-zinc-700">
        <h2 className="text-lg font-semibold mb-2">Personaje</h2>

        <select
          className="w-full mb-4 p-2 bg-zinc-800 text-white rounded"
          value={personajeId}
          onChange={(e) => setPersonajeId(e.target.value)}
        >
          {personajes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombrePersonaje}
            </option>
          ))}
        </select>

        <p className="mb-2 text-orange-400 font-bold">
          Dinero: ${personajeActivo ? personajeActivo.ryus - totalCompra : "Cargando..."}
        </p>

        <h3 className="text-md mb-2">Objetos seleccionados:</h3>
        <ul className="text-sm mb-4">
          {carrito.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-1">
              <span>{item.nombre} x{item.cantidad}</span>
              <button
                className="text-red-500 hover:text-red-300"
                onClick={() => eliminarDelCarrito(item.id)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between gap-2">
          <button
            onClick={resetearCarrito}
            className="w-1/2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
          >
            Reset
          </button>
          <button
            onClick={handleCompra}
            className="w-1/2 py-1 bg-green-600 hover:bg-green-500 rounded"
            disabled={!personajeActivo}
          >
            Comprar
          </button>
        </div>
      </div>

      {/* Zona principal */}
      <div className="w-full sm:w-3/4 p-6 bg-zinc-800 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Tienda</h1>

        <div className="flex gap-2 mb-4">
          {Object.keys(mockProductos).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-1 rounded text-sm transition ${
                categoria === cat
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mockProductos[categoria].map((producto) => (
            <div
              key={producto.id}
              className="p-4 bg-zinc-700 rounded hover:bg-zinc-600 cursor-pointer"
              onClick={() => agregarAlCarrito(producto)}
            >
              <h4 className="font-semibold text-lg mb-1">{producto.nombre}</h4>
              <p className="text-sm text-gray-300 mb-2">{producto.descripcion}</p>
              <p className="text-orange-400 font-bold">${producto.precio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
