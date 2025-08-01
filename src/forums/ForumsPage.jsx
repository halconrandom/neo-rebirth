import { useEffect, useState } from "react";
import {
  query,
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function ForumsPage() {
  const [forums, setForums] = useState([]);
  const [nuevasFichas, setNuevasFichas] = useState([]);
  const [nuevosUsuarios, setNuevosUsuarios] = useState([]);

  useEffect(() => {
    const fetchForums = async () => {
      const forumSnapshot = await getDocs(collection(db, "forums"));
      const forumList = forumSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setForums(forumList);
    };

    const obtenerFichas = async () => {
      const fichasQuery = query(
        collectionGroup(db, "fichas"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(fichasQuery);
      const fichasOrdenadas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNuevasFichas(fichasOrdenadas);
    };

    const obtenerUsuarios = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const usuariosOrdenados = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort(
          (a, b) =>
            new Date(b.creado?.toDate?.() || 0) -
            new Date(a.creado?.toDate?.() || 0)
        )
        .slice(0, 5);
      setNuevosUsuarios(usuariosOrdenados);
    };

    fetchForums();
    obtenerFichas();
    obtenerUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 md:p-10">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-[#121212] p-4 rounded-lg border border-gray-800">
            <h3 className="text-white text-sm font-semibold mb-3">
              Categorías
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="#">Publicaciones recientes</Link>
              </li>
              <li>
                <Link to="#">Mis temas</Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg text-white font-semibold mb-2">Anuncios</h2>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
              <Link to="#" className="text-white font-bold">
                Reglas del Foro
              </Link>
              <p className="text-sm text-gray-500 mt-1">Admin • hace 2 días</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg text-white font-semibold mb-2">
              Foros de Roleplay
            </h2>
            <div className="space-y-4">
              {forums.map((forum) => (
                <div
                  key={forum.id}
                  className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800"
                >
                  <div className="flex justify-between">
                    <div>
                      <Link
                        to={`/foro/${forum.id}`}
                        className="text-white text-lg font-semibold hover:text-orange-400"
                      >
                        {forum.title}
                      </Link>
                      <p className="text-sm text-gray-400">
                        {forum.description}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <p>
                        <span className="text-orange-400 font-semibold">
                          {forum.topics || 0}
                        </span>{" "}
                        temas
                      </p>
                      <p>Último mensaje {forum.lastMessage || "-"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Temas recientes */}
          <div className="bg-[#121212] p-4 rounded-lg border border-gray-800">
            <h3 className="text-white text-sm font-semibold mb-3">
              Temas recientes
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-orange-400 text-xl">&#9679;</span>
                <span>Nombre del tema</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 text-xl">&#9679;</span>
                <span>Nombre del tema</span>
              </li>
            </ul>
          </div>

          {/* Fichas nuevas */}
          <div className="bg-[#121212] p-4 rounded-lg border border-gray-800">
            <h3 className="text-white text-sm font-semibold mb-3">
              Fichas nuevas
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {nuevasFichas.map((ficha) => (
                <li key={ficha.id} className="flex flex-col">
                  <Link
                    to={`/fichas/${ficha.id}`}
                    className="hover:text-orange-300 font-medium"
                  >
                    {ficha.nombrePersonaje || "Sin nombre"}
                  </Link>
                  <span className="text-xs text-gray-500">
                    Creado:{" "}
                    {ficha.createdAt?.toDate?.().toLocaleDateString("es-ES") ||
                      "-"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Usuarios nuevos */}
          <div className="bg-[#121212] p-4 rounded-lg border border-gray-800">
            <h3 className="text-white text-sm font-semibold mb-3">
              Usuarios nuevos
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {nuevosUsuarios.map((user) => (
                <li key={user.id} className="flex flex-col">
                  <Link
                    to={`/perfil-publico/${user.id}`}
                    className="hover:text-orange-300 font-medium"
                  >
                    {user.nombreUsuario || "Usuario"}
                  </Link>
                  <span className="text-xs text-gray-500">
                    Registrado:{" "}
                    {user.creado?.toDate?.().toLocaleDateString("es-ES") || "-"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
