import type { SidebarItemProps } from "../../types/sidebar.types";

export default function SidebarItem({
  id,
  label,
  icon,
  collapsed,
  buttonId,
}: SidebarItemProps) {
  return (
    <li className="relative" id={id}>
      <div
        id={buttonId}
        className="group hover:bg-primary-200 flex items-center gap-4 rounded-lg border border-gray-50 bg-gray-50 p-2 shadow-sm"
      >
        {icon}
        {!collapsed && (
          <p className="group-hover:text-primary-900 text-lg">{label}</p>
        )}
      </div>
    </li>
  );
}
