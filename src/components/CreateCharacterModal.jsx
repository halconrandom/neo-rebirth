import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import konohagakure from "../data/aldeas/konohagakure";
import kumogakure from "../data/aldeas/kumogakure";
import Especializaciones from "../data/especializaciones";

const aldeas = [konohagakure, kumogakure];

export default function FichaWizard({ isOpen, onClose, onCreate }) {
  const [paso, setPaso] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombrePersonaje: "",
    edad: "",
    apodo: "",
    aldeaNacimiento: "",
    aldeaResidencia: "",
    clan: "",
    rango: "",
    invocacion: "",
    especializacion: "",
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setIsVisible(false);
    setTimeout(() => {
      setFormData({
        nombrePersonaje: "",
        edad: "",
        apodo: "",
        aldeaNacimiento: "",
        aldeaResidencia: "",
        clan: "",
        rango: "",
        invocacion: "",
        especializacion: "",
      });
      setPaso(1);
      onClose();
    }, 200);
  };

  const handleFinish = () => setPaso(5);
  const handleConfirm = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const fichasRef = collection(db, "users", user.uid, "fichas");
      await addDoc(fichasRef, {
        ...formData,
        createdAt: new Date(),
      });
      alert("Ficha creada con éxito");
      handleReset();
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
      alert("Hubo un error al guardar la ficha. Intenta nuevamente.");
    }
  };

  if (!isOpen && !isVisible) return null;

  const aldeaNacimientoSeleccionada = aldeas.find(
    (a) => a.nombre === formData.aldeaNacimiento
  );
  const clanesDisponibles = aldeaNacimientoSeleccionada
    ? aldeaNacimientoSeleccionada.clanes
    : [];
  const clanSeleccionado = clanesDisponibles.find(
    (c) => c.nombre === formData.clan
  );
  const especializacionesDisponibles = clanSeleccionado
    ? Especializaciones.filter((esp) =>
        clanSeleccionado.especializaciones.includes(esp.nombre)
      )
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-2xl text-white relative transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={handleReset}
        >
          ✕
        </button>

        {/* Barra de progreso */}
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
          <div
            className="bg-orange-400 h-full transition-all duration-300"
            style={{ width: `${paso * 20}%` }}
          />
        </div>

        <h2 className="text-2xl font-bold text-orange-400 mb-4">
          Crear Personaje
        </h2>

        {/* Paso 1: Información Personal */}
        {paso === 1 && (
          <div>
            <h3 className="text-lg text-orange-300 mb-2">
              Información Personal
            </h3>

            <input
              name="nombrePersonaje"
              placeholder="Nombre del Personaje"
              className="input mb-3 w-full"
              onChange={handleChange}
            />

            <div className="flex gap-3">
              <input
                type="number"
                name="edad"
                placeholder="Edad"
                className="input mb-3 w-full"
                onChange={handleChange}
              />
              <input
                type="text"
                name="apodo"
                placeholder="Apodo (solo obtenible mediante rol)"
                className="input mb-3 w-full text-gray-400 italic"
                readOnly
                disabled
              />
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Este campo se asigna durante el rol y no puede editarse aquí.
            </p>

            <div className="flex gap-3">
              <select
                name="aldeaNacimiento"
                onChange={handleChange}
                className="input mb-3 w-full"
              >
                <option value="">Aldea de Nacimiento</option>
                {aldeas.map((a) => (
                  <option key={a.nombre} value={a.nombre}>
                    {a.nombre}
                  </option>
                ))}
              </select>

              <select
                name="aldeaResidencia"
                onChange={handleChange}
                className="input mb-3 w-full"
              >
                <option value="">Aldea de Residencia</option>
                {aldeas.map((a) => (
                  <option key={a.nombre} value={a.nombre}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <select
              name="clan"
              onChange={handleChange}
              className="input mb-3 w-full"
              disabled={!formData.aldeaNacimiento}
            >
              <option value="">Selecciona un Clan</option>
              {clanesDisponibles.map((c) => (
                <option key={c.nombre} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <div className="flex justify-end">
              <button
                onClick={() => setPaso(2)}
                className="bg-orange-500 px-4 py-2 rounded"
                disabled={
                  !formData.nombrePersonaje ||
                  !formData.edad ||
                  !formData.aldeaNacimiento ||
                  !formData.clan ||
                  !formData.aldeaResidencia
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
        {/* Paso 2: Información Ninja */}
        {paso === 2 && (
          <div>
            <h3 className="text-lg text-orange-300 mb-2">Información Ninja</h3>
            <input
              name="rango"
              placeholder="Rango Ninja"
              className="input mb-3 w-full"
              onChange={handleChange}
            />
            <input
              name="invocacion"
              placeholder="Contrato de Invocación"
              className="input mb-3 w-full"
              onChange={handleChange}
            />
            <div className="flex justify-between">
              <button onClick={() => setPaso(1)} className="btn">
                Anterior
              </button>
              <button onClick={() => setPaso(3)} className="btn">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Especializaciones */}
        {paso === 3 && (
          <div>
            <h3 className="text-lg text-orange-300 mb-2">Especializaciones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {especializacionesDisponibles.map((esp) => (
                <div
                  key={esp.nombre}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      especializacion: esp.nombre,
                    }))
                  }
                  className={`cursor-pointer border rounded-lg p-3 transition hover:shadow ${
                    formData.especializacion === esp.nombre
                      ? "border-orange-400 bg-zinc-800"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                >
                  <h4 className="text-orange-400 font-semibold">
                    {esp.nombre}
                  </h4>
                  <p className="text-sm text-gray-300">{esp.descripcion}</p>
                  <p className="text-xs text-green-400 mt-1">{esp.ventaja}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setPaso(2)} className="btn">
                Anterior
              </button>
              <button
                onClick={() => setPaso(4)}
                className="btn"
                disabled={!formData.especializacion}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Estadísticas */}
        {paso === 4 && (
          <div>
            <h3 className="text-lg text-orange-300 mb-2">Estadísticas</h3>
            <p className="text-sm text-gray-400 mb-4">
              (Aquí irá el sistema de estadísticas)
            </p>
            <div className="flex justify-between">
              <button onClick={() => setPaso(3)} className="btn">
                Anterior
              </button>
              <button onClick={handleFinish} className="btn bg-green-600">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 5: Confirmación Final */}
        {paso === 5 && (
          <div>
            <h3 className="text-lg text-orange-300 mb-4">Confirmación Final</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="text-orange-400 font-semibold">Nombre:</span>{" "}
                  {formData.nombrePersonaje}
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">Edad:</span>{" "}
                  {formData.edad}
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">
                    Aldea de Nacimiento:
                  </span>{" "}
                  {formData.aldeaNacimiento}
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">Clan:</span>{" "}
                  {formData.clan}
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">
                    Aldea de Residencia:
                  </span>{" "}
                  {formData.aldeaResidencia}
                </p>
              </div>
              <div>
                <p>
                  <span className="text-orange-400 font-semibold">Rango:</span>{" "}
                  {formData.rango || "-"}
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">
                    Invocación:
                  </span>{" "}
                  {formData.invocacion || "-"}
                </p>
                <p>
                  <span className="text-orange-400 font-semibold">
                    Especialización:
                  </span>{" "}
                  {formData.especializacion}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setPaso(4)} className="btn">
                Anterior
              </button>
              <button onClick={handleConfirm} className="btn bg-blue-600">
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
