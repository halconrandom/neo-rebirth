// PerfilPublico.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PerfilPublico() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const ref = doc(db, "users", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData(snap.data());
      }
    };
    fetchUser();
  }, [id]);

  if (!data)
    return <div className="p-10 text-white">Cargando perfil público...</div>;

  return (
    <div className="p-10 text-white max-w-xl mx-auto">
      <img
        src={data.avatarURL || "https://placehold.co/150x150?text=Avatar"}
        alt="Avatar"
        className="w-32 h-32 rounded-full object-cover border mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-center">{data.nombreUsuario}</h2>
      <p className="text-center text-gray-400 mt-2">
        Miembro desde: {data.creado?.toDate?.().toLocaleDateString("es-ES") || "-"}
      </p>
    </div>
  );
}
