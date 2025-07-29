import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import UploadAvatar from "../components/UploadAvatar";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Aquí almacenamos datos de Firestore
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data()); // Guardamos toda la data del usuario
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user || !userData) return null;

  return (
    <div className="py-24 text-center px-4">
      <h2 className="text-3xl font-bold mb-4">
        Bienvenido, {userData.nombreUsuario || "Shinobi"}!
      </h2>

      <img
        src={userData.avatarURL || "https://via.placeholder.com/150"}
        alt="Avatar"
        className="w-32 h-32 rounded-full mx-auto mb-4 border"
      />

      <p className="text-gray-300 mb-4">{user.email}</p>

      <UploadAvatar />
    </div>
  );
}
