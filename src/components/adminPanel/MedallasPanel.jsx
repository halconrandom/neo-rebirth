// src/components/adminPanel/MedallasPanel.jsx
import { useState } from "react";
import { updateDoc, doc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import Medallas from "../../data/Medallas";

export default function MedallasPanel({
  usuarioSeleccionado,
  setUsuarioSeleccionado,
}) {
  const [medallaSeleccionada, setMedallaSeleccionada] = useState("");

  if (!usuarioSeleccionado || !Array.isArray(usuarioSeleccionado.medallas)) {
    return (
      <p className="text-sm text-zinc-400">
        No se ha seleccionado ningún usuario o el usuario no tiene medallas.
      </p>
    );
  }

  const quitarMedalla = async (uid, medalla) => {
    await updateDoc(doc(db, "users", uid), {
      medallas: arrayRemove(medalla),
    });

    setUsuarioSeleccionado((prev) => ({
      ...prev,
      medallas: prev.medallas.filter((m) => m !== medalla),
    }));
  };

  const agregarMedalla = async (uid, medalla) => {
    await updateDoc(doc(db, "users", uid), {
      medallas: arrayUnion(medalla),
    });

    setUsuarioSeleccionado((prev) => ({
      ...prev,
      medallas: [...prev.medallas, medalla],
    }));

    setMedallaSeleccionada("");
  };

  return (
    <div>
      <h3 className="text-orange-400 font-semibold mb-3">
        Medallas Obtenidas
      </h3>

      {usuarioSeleccionado.medallas.length > 0 ? (
        <ul className="flex flex-wrap gap-2 mb-4">
          {usuarioSeleccionado.medallas.map((m, i) => (
            <li
              key={i}
              className="bg-orange-600 px-3 py-1 rounded text-white text-sm cursor-pointer"
              onClick={() => quitarMedalla(usuarioSeleccionado.id, m)}
            >
              {m} ✖
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-400 mb-4">Sin medallas</p>
      )}

      <select
        className="input w-full mb-3 bg-zinc-900 text-white p-2 rounded"
        value={medallaSeleccionada}
        onChange={(e) => setMedallaSeleccionada(e.target.value)}
      >
        <option value="" disabled>
          Selecciona una medalla
        </option>
        {Medallas.filter(
          (m) => !usuarioSeleccionado.medallas.includes(m.nombre)
        ).map((m) => (
          <option key={m.nombre} value={m.nombre}>
            {m.nombre}
          </option>
        ))}
      </select>

      {medallaSeleccionada && (
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
          onClick={() =>
            agregarMedalla(usuarioSeleccionado.id, medallaSeleccionada)
          }
        >
          Confirmar Asignación
        </button>
      )}
    </div>
  );
}
