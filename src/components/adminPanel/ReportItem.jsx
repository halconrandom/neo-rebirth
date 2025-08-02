export default function ReportItem({ tipo, usuario }) {
  return (
    <li className="flex justify-between items-center bg-zinc-900 p-2 rounded">
      <div className="text-orange-300 font-semibold">{tipo}</div>
      <div className="text-sm text-zinc-400">{usuario}</div>
    </li>
  );
}