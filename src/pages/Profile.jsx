import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import UploadAvatar from "../components/UploadAvatar";
import CreateCharacterModal from "../components/CreateCharacterModal";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
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
            <p className="text-gray-400 text-sm">(Aquí irán las fichas)</p>
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
