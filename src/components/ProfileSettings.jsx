// UserSettings.jsx — Configuración del perfil con soporte para organización de medallas
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Lock,
  User,
  Globe,
  Bell,
  Shield,
  FlaskConical,
  AlertTriangle,
  LayoutGrid,
} from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Medallas from "../data/Medallas";

export default function UserSettings() {
  // Estado actual de cada sección del panel
  const [seccion, setSeccion] = useState("Seguridad");

  // Preferencias del usuario
  const [bio, setBio] = useState("");
  const [idioma, setIdioma] = useState("es");
  const [tema, setTema] = useState("oscuro");

  // Seguridad: cambio de contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Medallas personalizadas
  const [medallasPersonalizadas, setMedallasPersonalizadas] = useState([]);

  // Ítems de navegación
  const opciones = [
    "Seguridad",
    "Perfil",
    "Redes Sociales",
    "Preferencias",
    "Notificaciones",
    "Privacidad",
    "Betas",
    "Zona Peligrosa",
  ];

  const iconos = {
    Seguridad: <Lock size={18} />,
    Perfil: <User size={18} />,
    "Redes Sociales": <Globe size={18} />,
    Preferencias: <LayoutGrid size={18} />,
    Notificaciones: <Bell size={18} />,
    Privacidad: <Shield size={18} />,
    Betas: <FlaskConical size={18} />,
    "Zona Peligrosa": <AlertTriangle size={18} className="text-red-400" />,
  };

  // Cargar preferencias y medallas al iniciar
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setBio(data.bio || "");
        setIdioma(data.idioma || "es");
        setTema(data.tema || "oscuro");

        // ✅ Preferir `medallasPersonalizadas` si existe
        if (Array.isArray(data.medallasPersonalizadas)) {
          setMedallasPersonalizadas(data.medallasPersonalizadas);
        } else {
          // si no existe, crear estructura a partir de `medallas`
          const baseMedallas = (data.medallas || []).map((nombre) => ({
            nombre,
            visible: true,
          }));
          setMedallasPersonalizadas(baseMedallas);
        }
      }
    });
  }, []);

  // Guardar preferencias generales
  const guardarPreferencias = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { bio, idioma, tema });
      toast.success("Preferencias actualizadas correctamente.");
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
      toast.error("No se pudieron guardar los cambios.");
    }
  };

  // Guardar medallas personalizadas
  const guardarMedallas = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { medallasPersonalizadas });
      toast.success("Orden de medallas actualizado");
    } catch (error) {
      toast.error("No se pudieron guardar las medallas");
    }
  };

  // Cambio de contraseña
  const actualizarContrasena = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Las nuevas contraseñas no coinciden.");
      return;
    }
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast.error("Usuario no autenticado o sin correo.");
      return;
    }
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("La contraseña actual es incorrecta.");
      } else {
        toast.error("No se pudo actualizar la contraseña.");
      }
    }
  };

  // Reordenamiento de medallas
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(medallasPersonalizadas);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setMedallasPersonalizadas(items);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-900 text-white">
      <aside className="w-full md:w-64 bg-zinc-950 p-4 border-b md:border-b-0 md:border-r border-zinc-800">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <nav className="grid grid-cols-2 md:flex md:flex-col gap-2 text-sm">
          {opciones.map((op) => (
            <button
              key={op}
              onClick={() => setSeccion(op)}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-zinc-800 transition ${
                seccion === op ? "bg-zinc-800 text-orange-300" : ""
              }`}
            >
              {iconos[op]} <span>{op}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-zinc-100">
          User Settings
        </h1>

        {/* Sección Seguridad */}
        {seccion === "Seguridad" && (
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-semibold text-orange-300 flex items-center gap-2">
              <Lock /> Seguridad de la Cuenta
            </h2>
            <div className="bg-zinc-800 p-4 md:p-6 rounded-lg space-y-4">
              <h3 className="text-base md:text-lg font-medium text-white">
                Cambio de Contraseña
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña Actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-900 rounded p-2 text-sm text-white"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva Contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-900 rounded p-2 text-sm text-white"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmar Nueva Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-900 rounded p-2 text-sm text-white sm:col-span-2"
                />
              </div>
              <label className="inline-flex items-center text-sm text-gray-300 mt-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />{" "}
                Mostrar contraseña
              </label>
              <button
                onClick={actualizarContrasena}
                className="w-full sm:w-auto mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                Actualizar Contraseña
              </button>
            </div>
          </div>
        )}

        {/* Sección Perfil + Medallas */}
        {seccion === "Perfil" && (
          <div className="mb-10">
            <div className="text-lg md:text-xl font-semibold mb-4 text-orange-300 flex items-center gap-2">
              <User /> Perfil
            </div>
            <div className="grid gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <label className="block text-sm mb-1">
                  Biografía / Descripción
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-zinc-900 rounded p-2 text-sm text-white"
                />
              </div>

              {/* Organización de medallas */}
              <div className="bg-zinc-800 p-4 rounded-lg">
                <label className="block text-sm mb-3 text-orange-300">
                  Organizar Medallas
                </label>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="medallas">
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {medallasPersonalizadas.map((medalla, index) => (
                          <Draggable
                            key={medalla.nombre}
                            draggableId={medalla.nombre}
                            index={index}
                          >
                            {(provided) => {
                              const datos =
                                Medallas.find(
                                  (m) => m.nombre === medalla.nombre
                                ) || {};
                              return (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center gap-4 bg-zinc-900 p-2 rounded"
                                >
                                  {datos?.imagen && (
                                    <img
                                      src={datos.imagen}
                                      alt={medalla.nombre}
                                      className="w-8 h-8 object-contain"
                                    />
                                  )}

                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">
                                      {medalla.nombre}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                      {datos?.descripcion}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-8 h-4 rounded-full cursor-pointer flex items-center px-1 transition-colors ${
                                      medalla.visible
                                        ? "bg-green-400"
                                        : "bg-red-400"
                                    }`}
                                    onClick={() => {
                                      const nuevo = [...medallasPersonalizadas];
                                      nuevo[index].visible = !medalla.visible;
                                      setMedallasPersonalizadas(nuevo);
                                    }}
                                  >
                                    <div
                                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                                        medalla.visible
                                          ? "translate-x-3"
                                          : "translate-x-0"
                                      }`}
                                    />
                                  </div>
                                </li>
                              );
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
                <button
                  onClick={guardarMedallas}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white"
                >
                  Guardar orden y visibilidad
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sección Preferencias */}
        {seccion === "Preferencias" && (
          <div className="mb-10">
            <div className="text-lg md:text-xl font-semibold mb-4 text-orange-300 flex items-center gap-2">
              <LayoutGrid /> Preferencias de Cuenta
            </div>
            <div className="grid gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <label className="block text-sm mb-1">Idioma del sitio</label>
                <select
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                  className="w-full bg-zinc-900 rounded p-2 text-sm text-white"
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </select>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <label className="block text-sm mb-1">Tema</label>
                <select
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="w-full bg-zinc-900 rounded p-2 text-sm text-white"
                >
                  <option value="oscuro">Oscuro</option>
                  <option value="claro">Claro</option>
                </select>
              </div>
              <button
                onClick={guardarPreferencias}
                className="w-full sm:w-auto bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 text-white mt-2"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
