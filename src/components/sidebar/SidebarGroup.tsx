import type { SidebarGroupProps } from '../../types/sidebar.types';
import { ChevronDown } from 'lucide-react';

export default function SidebarGroup({
  id,
  label,
  icon,
  action,
  children,
  collapsed,
  collapsible = false,
  expanded = true,
  onToggle,
}: SidebarGroupProps) {
  const isExpanded = collapsed ? false : expanded;

  return (
    <li className="relative" id={id}>
      <div className="group hover:border-primary-200 hover:bg-primary-50/90 flex items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-2.5 py-2 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <button
          type="button"
          onClick={collapsible ? onToggle : undefined}
          className={`flex min-w-0 items-center gap-4 overflow-hidden text-left ${
            collapsible ? 'cursor-pointer' : 'cursor-default'
          }`}
          aria-expanded={collapsible ? isExpanded : undefined}
          aria-label={collapsible ? `Toggle ${label}` : undefined}
        >
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
        </button>
        <div
          className={`flex shrink-0 items-center gap-1.5 transition-all duration-300 ease-in-out ${
            collapsed ? 'w-0 scale-0 opacity-0' : 'w-auto scale-100 opacity-100'
          }`}
        >
          {action}
          {collapsible ? (
            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform duration-300 ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`}
            />
          ) : null}
        </div>
      </div>
      {children}
    </li>
  );
}
