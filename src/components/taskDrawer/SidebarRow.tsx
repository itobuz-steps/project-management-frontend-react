export function SidebarRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-md px-1 py-1 transition hover:bg-gray-50">
      <div className="text-[11px] font-medium tracking-wide text-gray-500">
        {label}
      </div>

      <div className="mt-0.5 text-sm">{children}</div>
    </div>
  );
}
