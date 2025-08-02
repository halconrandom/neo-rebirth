export default function ActionButton({ icon, label, onClick, disabled }) {
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