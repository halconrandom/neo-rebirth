import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Medallas from "../data/Medallas";

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
    <div className="p-10 max-w-xl mx-auto bg-zinc-900 rounded-3xl shadow-xl text-white">
      <img
        src={data.avatarURL || "https://placehold.co/150x150?text=Avatar"}
        alt="Avatar"
        className="w-32 h-32 rounded-full object-cover border mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-center">{data.nombreUsuario}</h2>
      <p className="text-center text-gray-400 mt-2">
        Miembro desde:{" "}
        {data.createdAtLocal
          ? new Date(data.createdAtLocal).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "-"}
      </p>

      {data.medallasPersonalizadas &&
        data.medallasPersonalizadas.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-4 text-center">
              Medallas Obtenidas
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {data.medallasPersonalizadas
                .filter((m) => m.visible !== false)
                .map((m) => {
                  const medalla = Medallas.find((d) => d.nombre === m.nombre);
                  if (!medalla) return null;

                  return (
                    <div key={m.nombre} className="relative group w-10 h-10">
                      {medalla.imagen && (
                        <img
                          src={medalla.imagen}
                          alt={m.nombre}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-zinc-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <strong>{medalla.nombre}</strong>
                        <p className="text-zinc-300">{medalla.descripcion}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
    </div>
  );
}
