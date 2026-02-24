const StatPill = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) => {
  return (
    <div className="flex flex-col items-center rounded-md border border-[#DCDFE4] bg-white px-5 py-3 text-center">
      <span className="text-xl font-bold" style={{ color: color ?? '#172B4D' }}>
        {value}
      </span>
      <span className="mt-0.5 text-xs text-[#626F86]">{label}</span>
    </div>
  );
};

export default StatPill;
