import type { SidebarItemProps } from '../../types/sidebar.types';

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
        className="group hover:bg-primary-200 flex items-center gap-4 overflow-hidden rounded-lg border border-gray-50 bg-gray-50 p-2 shadow-sm"
      >
        <span className="shrink-0">{icon}</span>

        <span
          className={`group-hover:text-primary-900 text-lg whitespace-nowrap transition-all duration-300 ease-in-out ${
            collapsed
              ? 'w-0 -translate-x-2 opacity-0'
              : 'w-auto translate-x-0 opacity-100'
          }`}
        >
          {label}
        </span>
      </div>
    </li>
  );
}
