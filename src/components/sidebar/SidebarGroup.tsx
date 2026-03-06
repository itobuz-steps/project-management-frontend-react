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
      <div className="group hover:border-primary-200 hover:bg-primary-50/90 flex items-center justify-between rounded-lg border border-slate-200/80 bg-white/90 p-2.5 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex min-w-0 items-center gap-4 overflow-hidden">
          <span className="group-hover:text-primary-800 shrink-0 text-slate-700 transition-colors">
            {icon}
          </span>
          <span
            className={`group-hover:text-primary-900 text-[15px] font-semibold tracking-wide whitespace-nowrap text-slate-800 transition-all duration-300 ease-in-out ${
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
