import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
// ... imports sin cambios

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uidActual, setUidActual] = useState(null); // 👈 Guardar UID del admin actual

  useEffect(() => {
    const verificarRol = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/");
      setUidActual(user.uid); // 👈 Guardar UID para validar cambios propios

      const ref = doc(db, "users", user.uid);
      const snap = await getDocs(collection(db, "users"));
      const usuarioActual = snap.docs.find((d) => d.id === user.uid);

      if (!usuarioActual || usuarioActual.data().rol !== "admin") {
        return navigate("/");
      }
    };
    verificarRol();
  }, [navigate]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const snap = await getDocs(collection(db, "users"));
      const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const ordenados = lista.sort(
        (a, b) => b.creado?.toMillis?.() - a.creado?.toMillis?.()
      );
      setUsuarios(ordenados);
      setLoading(false);
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (!busqueda) {
      setFiltro(usuarios);
    } else {
      const query = busqueda.toLowerCase();
      const filtrados = usuarios.filter(
        (u) =>
          u.nombreUsuario?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.fichaDestacada?.toLowerCase().includes(query)
      );
      setFiltro(filtrados);
    }
  }, [busqueda, usuarios]);

  const cambiarRol = async (id, nuevoRol) => {
    if (id === uidActual) {
      alert("No puedes cambiar tu propio rol.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", id), { rol: nuevoRol });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      );
    } catch (error) {
      console.error("Error al cambiar el rol:", error);
      alert("No se pudo cambiar el rol. Verifica tus permisos y reglas de Firestore.");
    }
  };

  const resetearPassword = async (email) => {
    alert(`Contraseña de ${email} fue reseteada a 'reboot123' (mock)`);
  };

  return (
    <div className="min-h-screen p-6 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">Panel de Administración</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por usuario, correo o personaje"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white placeholder-gray-400"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-zinc-800 text-sm text-left">
                <th className="p-2 border-b border-zinc-700">Usuario</th>
                <th className="p-2 border-b border-zinc-700">Correo</th>
                <th className="p-2 border-b border-zinc-700">Rol</th>
                <th className="p-2 border-b border-zinc-700">Miembro desde</th>
                <th className="p-2 border-b border-zinc-700">Ficha destacada</th>
                <th className="p-2 border-b border-zinc-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtro.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800 text-sm">
                  <td className="p-2 border-b border-zinc-700 font-semibold text-orange-300">
                    {u.nombreUsuario}
                  </td>
                  <td className="p-2 border-b border-zinc-700">{u.email}</td>
                  <td className="p-2 border-b border-zinc-700">
                    <select
                      value={u.rol || "user"}
                      onChange={(e) => cambiarRol(u.id, e.target.value)}
                      className="bg-zinc-700 rounded text-white text-sm"
                      disabled={u.id === uidActual} // 👈 Bloquear edición de su propio rol
                    >
                      <option value="admin">Admin</option>
                      <option value="mod">Mod</option>
                      <option value="lider">Líder de Aldea</option>
                      <option value="user">Usuario</option>
                    </select>
                  </td>
                  <td className="p-2 border-b border-zinc-700">
                    {u.creado?.toDate?.().toLocaleDateString("es-ES") || "-"}
                  </td>
                  <td className="p-2 border-b border-zinc-700">
                    {u.fichaDestacada || "Ninguna"}
                  </td>
                  <td className="p-2 border-b border-zinc-700">
                    <button
                      onClick={() => resetearPassword(u.email)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Reset pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
