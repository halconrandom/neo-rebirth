import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  User,
  Plus,
  Shield,
  Flag,
  Ban,
  FileWarning,
  Cog,
  Scroll,
  LogOut,
  Medal,
  FileText,
  MessageCircle,
  AlertTriangle,
  DollarSign,
  Backpack,
  Skull,
  Activity,
  Settings,
  Flame,
} from "lucide-react";
import Medallas from "../data/Medallas";

export default function AdminPanel() {
  const [seccionActiva, setSeccionActiva] = useState("Dashboard");
  const [usuarios, setUsuarios] = useState([]);
  const [uidActual, setUidActual] = useState(null);
  const navigate = useNavigate();
  const [ryusEditados, setRyusEditados] = useState({});

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [vistaActiva, setVistaActiva] = useState(""); // Controla qué panel se muestra
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState([]);
  const [medallaSeleccionada, setMedallaSeleccionada] = useState("");

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

      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        medallas: doc.data().medallas || [],
      }));
      setUsuarios(lista);
      setFiltro(lista);
    };
    verificarRol();
  }, [navigate]);

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

  const obtenerFichasUsuario = async (uid) => {
    const fichasRef = collection(db, "users", uid, "fichas");
    const snap = await getDocs(fichasRef);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const quitarMedalla = async (uid, medalla) => {
    await updateDoc(doc(db, "users", uid), {
      medallas: arrayRemove(medalla),
    });
    actualizarUsuario(uid, (medallas) => medallas.filter((m) => m !== medalla));
  };

  const agregarMedalla = async (uid, medalla) => {
    await updateDoc(doc(db, "users", uid), {
      medallas: arrayUnion(medalla),
    });
    actualizarUsuario(uid, (medallas) => [...medallas, medalla]);
  };

  const actualizarUsuario = (uid, actualizarMedallas) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === uid ? { ...u, medallas: actualizarMedallas(u.medallas) } : u
      )
    );
    if (usuarioSeleccionado?.id === uid) {
      setUsuarioSeleccionado((prev) => ({
        ...prev,
        medallas: actualizarMedallas(prev.medallas),
      }));
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <aside className="w-64 bg-zinc-950 p-4 flex flex-col gap-4 border-r border-zinc-800">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <NavItem
            icon={<User />}
            label="Dashboard"
            onClick={() => setSeccionActiva("Dashboard")}
          />
          <NavItem
            icon={<Shield />}
            label="User Management"
            onClick={() => setSeccionActiva("User Management")}
          />
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
        {seccionActiva === "Dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-orange-300">
              Dashboard
            </h1>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <SummaryCard
                title="Users"
                value={usuarios.length}
                icon={<User />}
              />
              <SummaryCard title="New Roles" value={5} icon={<Plus />} />
              <SummaryCard
                title="Pending Posts"
                value={16}
                icon={<FileWarning />}
              />
            </div>
            <section className="grid grid-cols-2 gap-6">
              <div className="bg-zinc-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-orange-300">
                  Recent Reports
                </h2>
                <ul className="space-y-3">
                  <ReportItem tipo="Spam" usuario="user123" />
                  <ReportItem tipo="Harassment" usuario="ninja_89" />
                  <ReportItem tipo="Spam" usuario="shadow221" />
                  <ReportItem tipo="Offensive Language" usuario="freestyle99" />
                </ul>
              </div>
              <div className="bg-zinc-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-orange-300">
                  Activity Logs
                </h2>
                <ul className="text-sm space-y-2">
                  <li>✅ Administrator — Role assigned (7 min ago)</li>
                  <li>✅ New user registered (12 min ago)</li>
                  <li>✅ Post approved (25 min ago)</li>
                </ul>
              </div>
            </section>
          </>
        )}

        {seccionActiva === "User Management" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Panel Izquierdo - Usuarios */}
            <div className="bg-zinc-800 p-4 rounded-xl">
              <h3 className="text-orange-400 font-semibold mb-3">Usuarios</h3>
              <input
                className="w-full mb-4 p-2 rounded bg-zinc-900 border border-zinc-700"
                placeholder="Buscar por nombre, email o ficha"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <ul className="space-y-2 max-h-[500px] overflow-y-auto">
                {filtro.map((u) => (
                  <li
                    key={u.id}
                    className={`cursor-pointer p-2 rounded hover:bg-zinc-700 ${
                      usuarioSeleccionado?.id === u.id ? "bg-zinc-700" : ""
                    }`}
                    onClick={async () => {
                      const fichas = await obtenerFichasUsuario(u.id);
                      setUsuarioSeleccionado({ ...u, fichas });
                      setVistaActiva("");
                    }}
                  >
                    {u.nombreUsuario || u.email}
                  </li>
                ))}
              </ul>
            </div>

            {/* Panel Derecho Superior - Botones */}
            <div className="col-span-2">
              <div className="grid grid-cols-5 gap-2 mb-4">
                <ActionButton
                  icon={<Medal />}
                  label="Medallas"
                  onClick={() => setVistaActiva("medallas")}
                  disabled={!usuarioSeleccionado}
                />
                <ActionButton icon={<FileText />} label="Fichas" disabled />
                <ActionButton icon={<MessageCircle />} label="Posts" disabled />
                <ActionButton
                  icon={<AlertTriangle />}
                  label="Advertencias"
                  disabled
                />
                <ActionButton
                  icon={<DollarSign />}
                  label="Dinero"
                  onClick={() => setVistaActiva("dinero")}
                  disabled={!usuarioSeleccionado}
                />

                <ActionButton icon={<Backpack />} label="Objetos" disabled />
                <ActionButton
                  icon={<Skull />}
                  label="Fichas Muertas"
                  disabled
                />
                <ActionButton icon={<Activity />} label="Actividad" disabled />
                <ActionButton
                  icon={<Settings />}
                  label="Editar Datos"
                  disabled
                />
                <ActionButton
                  icon={<Flame />}
                  label="Resetear Cuenta"
                  disabled
                />
              </div>

              {/* Panel Dinámico */}
              <div className="bg-zinc-800 p-4 rounded-xl min-h-[300px]">
                {vistaActiva === "dinero" && usuarioSeleccionado && (
                  <>
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
                                onClick={async () => {
                                  const nuevoValor =
                                    ryusEditados[ficha.id] ?? ficha.ryus ?? 0;
                                  const ref = doc(
                                    db,
                                    "users",
                                    usuarioSeleccionado.id,
                                    "fichas",
                                    ficha.id
                                  );
                                  await updateDoc(ref, { ryus: nuevoValor });

                                  // Refrescar estado local
                                  const nuevasFichas =
                                    usuarioSeleccionado.fichas.map((f) =>
                                      f.id === ficha.id
                                        ? { ...f, ryus: nuevoValor }
                                        : f
                                    );
                                  setUsuarioSeleccionado((prev) => ({
                                    ...prev,
                                    fichas: nuevasFichas,
                                  }));
                                }}
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
                  </>
                )}
                {vistaActiva === "medallas" && usuarioSeleccionado && (
                  <>
                    <h3 className="text-orange-400 font-semibold mb-3">
                      Medallas Obtenidas
                    </h3>
                    {usuarioSeleccionado.medallas.length > 0 ? (
                      <ul className="flex flex-wrap gap-2 mb-4">
                        {usuarioSeleccionado.medallas.map((m, i) => (
                          <li
                            key={i}
                            className="bg-orange-600 px-3 py-1 rounded text-white text-sm cursor-pointer"
                            onClick={() =>
                              quitarMedalla(usuarioSeleccionado.id, m)
                            }
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
                        onClick={() => {
                          agregarMedalla(
                            usuarioSeleccionado.id,
                            medallaSeleccionada
                          );
                          setMedallaSeleccionada("");
                        }}
                      >
                        Confirmar Asignación
                      </button>
                    )}
                  </>
                )}
                {!vistaActiva && (
                  <p className="text-sm text-zinc-500">
                    Selecciona una acción para comenzar.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, onClick }) {
  return (
    <button
      className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded transition"
      onClick={onClick}
    >
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

function ActionButton({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded text-sm ${
        disabled
          ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
          : "bg-zinc-900 hover:bg-zinc-800 text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
