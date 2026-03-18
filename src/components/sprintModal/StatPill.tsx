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
    <div className="flex flex-col items-center rounded-md border border-[#DCDFE4] bg-white px-5 py-3 text-center dark:border-neutral-700 dark:bg-neutral-900">
      <span className="text-xl font-bold" style={{ color: color ?? '#172B4D' }}>
        {value}
      </span>
      <span className="mt-0.5 text-xs text-[#626F86] dark:text-neutral-300">
        {label}
      </span>
    </div>
  );
};

export default StatPill;
