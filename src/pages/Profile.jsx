import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import UploadAvatar from "../components/UploadAvatar";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

import CreateCharacterModal from "../components/CreateCharacterModal";
import UploadCharacterAvatar from "../components/UploadCharacterAvatar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fichas, setFichas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        // Aquí agregamos la escucha en tiempo real para las fichas
        const fichasRef = collection(db, "users", firebaseUser.uid, "fichas");
        const unsubscribeFichas = onSnapshot(fichasRef, (snapshot) => {
          const fichasData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFichas(fichasData);
        });

        // Retorna ambos unsubscribe cuando el componente se desmonta
        return () => {
          unsubscribeFichas();
        };
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Solo para cerrar el listener de auth si se desmonta
  }, [navigate]);

  const handleCreateCharacter = (ficha) => {
    console.log("Crear ficha:", ficha);
    setShowModal(false);
  };

  if (!user || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p className="text-lg animate-pulse text-orange-400">
          Cargando perfil...
        </p>
      </div>
    );
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative min-h-screen py-16 px-6 md:px-16 lg:px-32 text-white">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="relative group w-40 h-40 mx-auto">
            <img
              src={userData.avatarURL || "https://via.placeholder.com/150"}
              alt="avatar"
              className="w-full h-full object-cover rounded-full border-4 border-gray-600"
            />
            <div className="absolute top-1/2 left-0 w-full h-1/2 bg-black bg-opacity-60 rounded-b-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <UploadAvatar />
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <Link
              to={`/perfil-publico/${auth.currentUser?.uid}`}
              className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-400 rounded text-white transition"
            >
              Ver perfil público
            </Link>
          </div>

          <div className="flex justify-center mt-2">
<Link
  to="/ajustes"
  className="flex items-center gap-1 px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 rounded text-white transition"
>
  <Settings size={16} />
  Configuración
</Link>

          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold">{userData.nombreUsuario}</h2>
            <p className="text-gray-400 text-sm mt-2">
              Miembro desde:{" "}
              {user.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString(
                    "es-ES",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "-"}
            </p>
            <p className="text-sm text-yellow-400 mt-1">Rango: Sannin</p>
          </div>
        </div>

        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Roles abiertos</h3>
            <p className="text-gray-400 text-sm">
              (Aquí irá la lista de roles)
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-center items-center mb-2 relative">
              <h3 className="text-xl font-semibold">Fichas de personaje</h3>
              <button
                onClick={() => setShowModal(true)}
                className="absolute right-0 text-orange-400 hover:text-orange-200 text-2xl font-bold transform hover:scale-110 transition"
                title="Crear nuevo personaje"
              >
                ＋
              </button>
            </div>
            {fichas.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay fichas aún.</p>
            ) : (
              <ul className="text-sm space-y-2">
                {fichas.map((ficha) => (
                  <li
                    key={ficha.id}
                    className="bg-zinc-800 p-3 rounded border border-zinc-700 flex items-center justify-between"
                  >
                    <div
                      onClick={() => navigate(`/fichas/${ficha.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {ficha.avatarURL && (
                          <img
                            src={ficha.avatarURL}
                            alt="avatar ficha"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <p className="text-orange-300 font-semibold">
                          {ficha.nombrePersonaje}
                        </p>
                      </div>

                      <p className="text-gray-400 text-xs">
                        {ficha.clan} – {ficha.rango || "Sin rango"}
                      </p>
                    </div>

                    {/* Componente para cambiar el avatar de la ficha */}
                    <UploadCharacterAvatar characterId={ficha.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <CreateCharacterModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onCreate={handleCreateCharacter}
      />
    </div>
  );
}
