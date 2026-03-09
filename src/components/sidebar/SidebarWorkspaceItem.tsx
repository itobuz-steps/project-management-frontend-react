import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Workspace } from '../../services/workspaceService';

type SidebarWorkspaceItemProps = {
  workspace: Workspace;
  collapsed: boolean;
  activeProjectId?: string;
  onProjectClick: (projectId: string) => void;
};

function SidebarWorkspaceItem({
  workspace,
  collapsed,
  activeProjectId,
  onProjectClick,
}: SidebarWorkspaceItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <li
      className={`transition-all duration-300 ease-in-out ${collapsed ? '-translate-x-2 opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="group flex w-full items-center justify-between rounded-lg px-1.5 py-1.5 transition-all duration-200 hover:bg-white/80 hover:shadow-sm"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="group-hover:bg-primary-500 aspect-square h-1.5 w-1.5 rounded-full bg-slate-400 transition-colors" />
          <span className="text-start text-xs font-semibold tracking-[0.08em] text-slate-500 uppercase">
            {workspace.workspaceName}
          </span>
        </span>
        <span className="group-hover:text-primary-700 my-auto text-slate-500 transition-colors">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      <ul
        className={`mt-1 ml-2 flex flex-col gap-1.5 border-l border-slate-200 pl-2 transition-all duration-200 ${
          isExpanded
            ? 'max-h-80 opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        {workspace.projects.map((project) => (
          <li
            key={project._id}
            onClick={() => onProjectClick(project._id)}
            className={`hover:border-primary-200 hover:bg-primary-50 hover:text-primary-900 flex cursor-pointer items-center gap-2 truncate rounded-md border px-2 py-1.5 text-sm font-semibold whitespace-nowrap text-slate-800 transition-all duration-200 ease-in-out ${
              activeProjectId === project._id
                ? 'border-primary-200 bg-primary-100 text-primary-900 shadow-sm'
                : 'border-transparent'
            }`}
          >
            {project.icon && (
              <img
                src={project.icon}
                alt={project.name}
                className="h-4 w-4 object-cover"
              />
            )}
            {project.name}
          </li>
        ))}
        {!workspace.projects.length && (
          <li className="rounded-md border border-dashed border-slate-300 bg-white/70 px-2 py-1 text-xs font-medium tracking-wide text-slate-500">
            No projects yet
          </li>
        )}
      </ul>
    </li>
  );
}

export default SidebarWorkspaceItem;
