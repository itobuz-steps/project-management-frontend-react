export function StatusSelect({
//   taskId,
  value,
  columns,
  onChange,
}: {
  taskId: string;
  value: string;
  columns: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-primary-400 rounded-md px-2 py-1 text-white outline-none"
    >
      {columns.map((col) => (
        <option key={col} value={col}>
          {col}
        </option>
      ))}
    </select>
  );
}
