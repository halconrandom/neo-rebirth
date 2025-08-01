import { useState } from "react";
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
import { doc, updateDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function UserSettings() {
  const [seccion, setSeccion] = useState("Seguridad");
  const [bio, setBio] = useState("");
  const [idioma, setIdioma] = useState("es");
  const [tema, setTema] = useState("oscuro");

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
                />
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
            </div>
          </div>
        )}

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
