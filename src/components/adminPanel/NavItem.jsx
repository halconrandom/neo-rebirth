// src/components/adminPanel/NavItem.jsx

export default function NavItem({ icon, label, onClick }) {
  return (
    <button
      className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded transition"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
