// src/components/adminPanel/DineroPanel.jsx
import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DineroPanel({ usuarioSeleccionado, setUsuarioSeleccionado }) {
  const [ryusEditados, setRyusEditados] = useState({});

  const actualizarRyus = async (fichaId, nuevoValor) => {
    const ref = doc(
      db,
      "users",
      usuarioSeleccionado.id,
      "fichas",
      fichaId
    );
    await updateDoc(ref, { ryus: nuevoValor });

    // Actualizar el estado local
    const nuevasFichas = usuarioSeleccionado.fichas.map((f) =>
      f.id === fichaId ? { ...f, ryus: nuevoValor } : f
    );

    setUsuarioSeleccionado((prev) => ({
      ...prev,
      fichas: nuevasFichas,
    }));

    // Limpiar el valor editado de ese input (opcional)
    setRyusEditados((prev) => {
      const nuevo = { ...prev };
      delete nuevo[fichaId];
      return nuevo;
    });
  };

  return (
    <div>
      <h3 className="text-orange-400 font-semibold mb-3">
        Gestión de Ryus
      </h3>

      {usuarioSeleccionado.fichas?.length > 0 ? (
        <ul className="space-y-4">
          {usuarioSeleccionado.fichas.map((ficha) => (
            <li
              key={ficha.id}
              className="bg-zinc-900 p-3 rounded flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-white">
                  {ficha.nombrePersonaje || "Sin Nombre"}
                </p>
                <p className="text-sm text-zinc-400">
                  Ryus actuales: {(ficha.ryus ?? 0).toLocaleString("en-US")}
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  className="bg-zinc-800 p-1 rounded text-white w-40 text-sm"
                  value={
                    ryusEditados[ficha.id] !== undefined
                      ? ryusEditados[ficha.id]
                      : ficha.ryus ?? 0
                  }
                  onChange={(e) => {
                    const valor = parseInt(e.target.value);
                    if (!isNaN(valor)) {
                      setRyusEditados((prev) => ({
                        ...prev,
                        [ficha.id]: valor,
                      }));
                    }
                  }}
                />

                <button
                  className="bg-orange-500 px-3 py-1 rounded text-sm text-white hover:bg-orange-600"
                  onClick={() =>
                    actualizarRyus(
                      ficha.id,
                      ryusEditados[ficha.id] ?? ficha.ryus ?? 0
                    )
                  }
                >
                  Guardar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-400">
          Este usuario no tiene fichas creadas.
        </p>
      )}
    </div>
  );
}
