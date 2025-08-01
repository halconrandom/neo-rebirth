import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import UploadCharacterAvatar from "../components/UploadCharacterAvatar";

export default function FichaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("Equipo");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !id) return;

    const fetchFicha = async () => {
      const docRef = doc(db, "users", userId, "fichas", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFicha({ id, ...docSnap.data() });
      }
    };

    fetchFicha();
  }, [id, userId]);

  const actualizarAvatarEnFicha = (url) => {
    setFicha((prev) => ({ ...prev, avatarURL: url }));
  };

  if (!ficha) return <div className="p-4 text-white">Cargando ficha...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-white">
      {/* Sidebar Lateral */}
      <div className="w-full md:w-1/4 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-700 bg-zinc-900 flex flex-col items-center">
        <button
          onClick={() => navigate("/perfil")}
          className="mb-4 self-start text-sm text-orange-400 hover:text-orange-200 transition"
        >
          ← Volver
        </button>

        <div className="flex flex-col items-center mb-4">
          <img
            src={
              ficha.avatarURL || "https://placehold.co/150x150?text=Sin+Avatar"
            }
            alt="Avatar"
            className="rounded-full object-cover w-32 h-32"
          />
          <div className="mt-2 text-xs">
            <UploadCharacterAvatar
              characterId={ficha.id}
              onUploadSuccess={actualizarAvatarEnFicha}
            />
          </div>
        </div>

        <div className="w-full text-sm">
          {/* Datos generales */}
          <p className="mb-1">
            <span className="text-orange-300 font-semibold">Nombre:</span>{" "}
            {ficha.nombrePersonaje}
          </p>
          <p className="mb-1">
            <span className="text-orange-300 font-semibold">Edad:</span>{" "}
            {ficha.edad || "—"}
          </p>
          <p className="mb-1">
            <span className="text-orange-300 font-semibold">Rango:</span>{" "}
            {ficha.rango || "—"}
          </p>
          <p className="mb-1">
            <span className="text-orange-300 font-semibold">Clan:</span>{" "}
            {ficha.clan}
          </p>
          <p className="mb-1">
            <span className="text-orange-300 font-semibold">
              Aldea de Nacimiento:
            </span>{" "}
            {ficha.aldeaNacimiento}
          </p>
          <p className="mb-4">
            <span className="text-orange-300 font-semibold">
              Aldea de Residencia:
            </span>{" "}
            {ficha.aldeaResidencia}
          </p>

          <div>
            <p className="text-orange-300 font-semibold mb-1">
              Especialización:
            </p>
            <p className="mb-1">
              <span className="text-gray-300">Tipo:</span>{" "}
              {ficha.especializacion}
            </p>
            {ficha.elemento && (
              <p className="mb-1">
                <span className="text-gray-300">Elemento:</span>{" "}
                {ficha.elemento}
              </p>
            )}
            {ficha.kekkeiGenkai && (
              <p className="mb-1">
                <span className="text-gray-300">Kekkei Genkai:</span>{" "}
                {ficha.kekkeiGenkai}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => alert("Funcionalidad de edición aún no implementada.")}
          className="mt-6 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-sm font-semibold rounded transition"
        >
          Editar ficha
        </button>
      </div>

      {/* Zona derecha */}
      <div className="w-full md:w-3/4 p-4 md:p-6 bg-zinc-800 overflow-y-auto">
        {/* Tabs superiores */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {["Equipo", "Cronología", "Técnicas", "Estadísticas"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-base font-semibold rounded ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido dinámico por pestaña */}
        <div className="mb-4 border border-gray-700 rounded p-4 min-h-[200px]">
          {activeTab === "Equipo" && (
            <p className="text-gray-300">[Equipo del personaje aquí]</p>
          )}
          {activeTab === "Cronología" && (
            <p className="text-gray-300">[Cronología de eventos aquí]</p>
          )}
          {activeTab === "Técnicas" && (
            <p className="text-gray-300">[Lista de técnicas aquí]</p>
          )}
          {activeTab === "Estadísticas" && (
            <p className="text-gray-300">[Estadísticas aquí]</p>
          )}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-500 italic">
            Zona reservada para añadir comentarios nuevos en el futuro.
          </p>
        </div>
      </div>
    </div>
  );
}
