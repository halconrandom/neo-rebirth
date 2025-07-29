import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setNombreUsuario(userSnap.data().nombreUsuario);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="py-24 text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Bienvenido, {nombreUsuario || "Shinobi"}!</h2>
      <p className="text-gray-300 mb-2">{user.email}</p>
    </div>
  );
}
