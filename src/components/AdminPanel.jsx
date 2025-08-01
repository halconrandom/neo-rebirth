import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { User, Plus, Shield, Flag, Ban, FileWarning, Cog, Scroll, LogOut } from "lucide-react";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uidActual, setUidActual] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarRol = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/");
      setUidActual(user.uid);

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
      const ordenados = lista.sort((a, b) => b.creado?.toMillis?.() - a.creado?.toMillis?.());
      setUsuarios(ordenados);
      setLoading(false);
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (!busqueda) setFiltro(usuarios);
    else {
      const q = busqueda.toLowerCase();
      setFiltro(
        usuarios.filter(
          (u) =>
            u.nombreUsuario?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.fichaDestacada?.toLowerCase().includes(q)
        )
      );
    }
  }, [busqueda, usuarios]);

  const cambiarRol = async (id, nuevoRol) => {
    if (id === uidActual) return alert("No puedes cambiar tu propio rol.");
    try {
      await updateDoc(doc(db, "users", id), { rol: nuevoRol });
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u)));
    } catch (err) {
      console.error("Error al cambiar el rol:", err);
      alert("No se pudo cambiar el rol. Verifica permisos o reglas.");
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <aside className="w-64 bg-zinc-950 p-4 flex flex-col gap-4 border-r border-zinc-800">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <NavItem icon={<User />} label="Dashboard" />
          <NavItem icon={<Shield />} label="User Management" />
          <NavItem icon={<Plus />} label="Role Assignment" />
          <NavItem icon={<Flag />} label="Content Moderation" />
          <NavItem icon={<Ban />} label="Ban List" />
          <NavItem icon={<FileWarning />} label="Reports" />
          <NavItem icon={<Cog />} label="Settings" />
          <NavItem icon={<Scroll />} label="Logs" />
          <NavItem icon={<LogOut />} label="Logout" />
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-orange-300">Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <SummaryCard title="Users" value={usuarios.length} icon={<User />} />
          <SummaryCard title="New Roles" value={5} icon={<Plus />} />
          <SummaryCard title="Pending Posts" value={16} icon={<FileWarning />} />
        </div>

        <section className="grid grid-cols-2 gap-6">
          <div className="bg-zinc-800 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-orange-300">Recent Reports</h2>
            <ul className="space-y-3">
              <ReportItem tipo="Spam" usuario="user123" />
              <ReportItem tipo="Harassment" usuario="ninja_89" />
              <ReportItem tipo="Spam" usuario="shadow221" />
              <ReportItem tipo="Offensive Language" usuario="freestyle99" />
            </ul>
          </div>

          <div className="bg-zinc-800 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-orange-300">Activity Logs</h2>
            <ul className="text-sm space-y-2">
              <li>✅ Administrator — Role assigned (7 min ago)</li>
              <li>✅ New user registered (12 min ago)</li>
              <li>✅ Post approved (25 min ago)</li>
            </ul>
          </div>
        </section>

        <div className="mt-6 bg-zinc-800 p-4 rounded-xl flex gap-4 justify-end">
          <button className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600">Add User</button>
          <button className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600">Create Role</button>
          <button className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600">Settings</button>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded transition">
      {icon} <span>{label}</span>
    </button>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-xl flex items-center gap-4 shadow">
      <div className="bg-orange-500 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-zinc-300">{title}</p>
      </div>
    </div>
  );
}

function ReportItem({ tipo, usuario }) {
  return (
    <li className="flex justify-between items-center bg-zinc-900 p-2 rounded">
      <div className="text-orange-300 font-semibold">{tipo}</div>
      <div className="text-sm text-zinc-400">{usuario}</div>
    </li>
  );
}
