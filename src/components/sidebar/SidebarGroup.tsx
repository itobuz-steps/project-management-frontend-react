import type { SidebarGroupProps } from '../../types/sidebar.types';

export default function SidebarGroup({
  id,
  label,
  icon,
  action,
  children,
  collapsed,
}: SidebarGroupProps) {
  return (
    <li className="relative" id={id}>
      <div className="group hover:bg-primary-200 flex items-center justify-between rounded-lg border border-gray-50 bg-gray-50 p-2 shadow-sm">
        <div className="flex items-center gap-4">
          {icon}
          {!collapsed && (
            <p className="group-hover:text-primary-900 text-lg">{label}</p>
          )}
        </div>
        {!collapsed && action}
      </div>
      {children}
    </li>
  );
}
