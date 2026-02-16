export function SidebarRow({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const hasLabel = Boolean(label);

  return (
    <div
      className={`grid items-start text-sm ${
        hasLabel
          ? 'grid-cols-1 sm:grid-cols-[112px_minmax(0,1fr)]'
          : 'grid-cols-1'
      } `}
    >
      {hasLabel && (
        <div className="mr-4 flex px-2 py-1 text-[11px] leading-6 font-medium tracking-wide text-gray-500 hover:bg-gray-100">
          {label}
        </div>
      )}

      <div className="flex rounded px-2 py-1 leading-6 hover:bg-gray-100">
        {children}
      </div>
    </div>
  );
}
