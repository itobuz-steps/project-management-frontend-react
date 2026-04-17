import { useMemo } from 'react';
import type { Workspace } from '../../services/workspaceService';
import { fallbackProjectIcons } from '../../config/constants';

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
  const getProjectIcon = useMemo(() => {
    return (projectId: string, projectIcon?: string) => {
      // If project has an icon, use it
      if (projectIcon) {
        return projectIcon;
      }

      // Check if we already have a stored fallback for this project
      const storedFallback = localStorage.getItem(`fallback-icon-${projectId}`);
      if (storedFallback) {
        return storedFallback;
      }

      // Pick a random fallback and save it
      const randomFallback =
        fallbackProjectIcons[
          Math.floor(Math.random() * fallbackProjectIcons.length)
        ];
      localStorage.setItem(`fallback-icon-${projectId}`, randomFallback);
      return randomFallback;
    };
  }, []);
  return (
    <li
      className={`transition-all duration-300 ease-in-out ${
        collapsed ? '-translate-x-2 opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <ul className="mt-1 ml-2 flex flex-col gap-1.5 border-l border-slate-200 pl-2 transition-all duration-200 dark:border-slate-700">
        {workspace.projects.map((project) => {
          const projectIcon = getProjectIcon(project._id, project.icon);
          return (
            <li
              key={project._id}
              onClick={() => onProjectClick(project._id)}
              className={`flex cursor-pointer items-center gap-2 truncate rounded-md border px-2 py-1.5 text-sm font-semibold transition-all ${
                activeProjectId === project._id
                  ? 'border-primary-200 bg-primary-100 text-primary-900 dark:bg-slate-700 dark:text-white'
                  : 'border-transparent text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {projectIcon && (
                <img
                  src={projectIcon}
                  alt={project.name}
                  className="h-4 w-4 rounded object-cover"
                />
              )}
              {project.name}
            </li>
          );
        })}

        {!workspace.projects.length && (
          <li className="rounded-md border border-dashed border-slate-300 bg-white/70 px-2 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            No projects yet
          </li>
        )}
      </ul>
    </li>
  );
}

export default SidebarWorkspaceItem;
