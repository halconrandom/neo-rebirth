import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function FichaDetalle() {
  const { fichaId } = useParams();
  const [ficha, setFicha] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchFicha = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const fichaRef = doc(db, "users", user.uid, "fichas", fichaId);
      const fichaSnap = await getDoc(fichaRef);
      if (fichaSnap.exists()) {
        setFicha(fichaSnap.data());
      }
    };

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    fetchFicha();
    fetchUserData();
  }, [fichaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFicha((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const fichaRef = doc(db, "users", user.uid, "fichas", fichaId);
    await updateDoc(fichaRef, ficha);
    setEditMode(false);
  };

  if (!ficha || !userData) return <div className="text-white p-6">Cargando ficha...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-900 text-white">
      {/* Panel Izquierdo */}
      <div className="md:w-1/4 p-6 border-r border-zinc-700">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4 rounded-full border-4 border-orange-500 overflow-hidden">
            {/* Imagen editable futura */}
            <img
              src={ficha.avatarURL || "https://via.placeholder.com/150"}
              alt="avatar personaje"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold">{userData.nombreUsuario}</h2>
            <p className="text-xs text-gray-400 mt-1">Rango: Sannin</p>
          </div>
        </div>
      </div>

      {/* Panel Central */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-orange-400">Ficha de {ficha.nombrePersonaje}</h1>
          {!editMode ? (
            <button className="btn" onClick={() => setEditMode(true)}>
              Editar
            </button>
          ) : (
            <button className="btn bg-green-600" onClick={handleSave}>
              Guardar
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-orange-300 font-semibold">Nombre</label>
            {editMode ? (
              <input name="nombrePersonaje" value={ficha.nombrePersonaje} onChange={handleChange} className="input" />
            ) : (
              <p>{ficha.nombrePersonaje}</p>
            )}

            <label className="block text-orange-300 font-semibold mt-2">Edad</label>
            {editMode ? (
              <input name="edad" value={ficha.edad} onChange={handleChange} className="input" />
            ) : (
              <p>{ficha.edad}</p>
            )}

            <label className="block text-orange-300 font-semibold mt-2">Clan</label>
            <p>{ficha.clan}</p>

            <label className="block text-orange-300 font-semibold mt-2">Especialización</label>
            <p>{ficha.especializacion}</p>
          </div>
          <div>
            <label className="block text-orange-300 font-semibold">Rango</label>
            {editMode ? (
              <input name="rango" value={ficha.rango} onChange={handleChange} className="input" />
            ) : (
              <p>{ficha.rango}</p>
            )}

            <label className="block text-orange-300 font-semibold mt-2">Invocación</label>
            {editMode ? (
              <input name="invocacion" value={ficha.invocacion} onChange={handleChange} className="input" />
            ) : (
              <p>{ficha.invocacion}</p>
            )}

            <label className="block text-orange-300 font-semibold mt-2">Aldea</label>
            <p>{ficha.aldeaNacimiento}</p>
          </div>
        </div>

        {/* Sección de Comentarios */}
        <div className="mt-6 border-t pt-4 border-zinc-700">
          <h3 className="text-orange-300 text-lg mb-2">Comentarios</h3>
          <p className="text-sm text-gray-400">(Sistema de comentarios próximamente...)</p>
        </div>
      </div>
    </div>
  );
}
