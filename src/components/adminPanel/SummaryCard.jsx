export default function SummaryCard({ title, value, icon }) {
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
