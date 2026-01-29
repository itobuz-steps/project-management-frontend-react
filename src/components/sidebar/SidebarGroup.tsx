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
        <div className="flex min-w-0 items-center gap-4 overflow-hidden">
          <span className="shrink-0">{icon}</span>
          <span
            className={`group-hover:text-primary-900 whitespace-nowrap transition-all duration-300 ease-in-out ${
              collapsed
                ? 'w-0 -translate-x-2 opacity-0'
                : 'w-auto translate-x-0 opacity-100'
            }`}
          >
            {label}
          </span>
        </div>
        <span
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            collapsed ? 'w-0 scale-0 opacity-0' : 'w-auto scale-100 opacity-100'
          }`}
        >
          {action}
        </span>
      </div>
      {children}
    </li>
  );
}
