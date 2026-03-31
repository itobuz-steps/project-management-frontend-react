import { useSearchParams } from 'react-router-dom';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import type { Project } from '../../types/project.types';
import { Clock3, Link2 } from 'lucide-react';

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function getPriorityBadgeClass(priority: string) {
  const normalized = priority.trim().toLowerCase();
  if (normalized === 'high') return 'bg-violet-200 text-violet-950';
  if (normalized === 'medium') return 'bg-orange-100 text-orange-900';
  return 'bg-emerald-100 text-emerald-900';
}

function getDaysLeftText(dueDate?: string) {
  if (!dueDate) return 'No due date';
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return 'No due date';

  const oneDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.ceil(
    (startDue.getTime() - startToday.getTime()) / oneDay
  );

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  return `${diffDays} day${diffDays === 1 ? '' : 's'} left`;
}

export function TaskItem({ task }: { task: TaskPopulated }) {
  const [, setSearchParams] = useSearchParams();
  const projectName =
    typeof task.projectId === 'string'
      ? 'Project'
      : ((task.projectId as Project).name ?? 'Project');

  const linksCount =
    (task.blocks?.length ?? 0) +
    (task.blockedBy?.length ?? 0) +
    (task.relatesTo?.length ?? 0) +
    (task.duplicates?.length ?? 0);

  const priorityLabel = toTitleCase(task.priority || 'low');
  const daysLeft = getDaysLeftText(task.dueDate);

  return (
    <li
      onClick={() => setSearchParams({ taskId: task._id }, { replace: true })}
      className="group flex flex-col gap-2 rounded-lg border border-gray-200 bg-neutral-50 px-3 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-px hover:cursor-pointer hover:border-gray-300 hover:shadow-[0_3px_10px_rgba(16,24,40,0.08)] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:shadow-[0_3px_10px_rgba(0,0,0,0.3)]"
    >
      <div className="min-w-0 flex-1 sm:mb-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0">
            <TaskTypeIcon type={task.type} />
          </span>
          <p className="min-w-0 truncate text-lg leading-7 font-semibold text-gray-900 sm:text-xl dark:text-slate-100">
            {task.title}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span className="bg-primary-400 shrink-0 rounded-sm px-1 py-0.5 text-[10px] font-semibold text-white">
            {task.key}
          </span>
          <span className="truncate">{projectName}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-row sm:flex-nowrap sm:items-end sm:justify-end sm:gap-3">
        {linksCount > 0 && (
          <span className="hidden items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm text-gray-700 sm:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Link2 size={14} />
            {linksCount}
          </span>
        )}

        <span
          className={`inline-flex items-center justify-center rounded-sm px-2.5 py-1 text-xs font-semibold sm:w-18 ${getPriorityBadgeClass(task.priority || 'low')}`}
        >
          {priorityLabel}
        </span>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 sm:w-24 dark:text-slate-300">
          <Clock3 size={14} className="shrink-0" />
          <span className="text-xs whitespace-nowrap">{daysLeft}</span>
        </span>
      </div>
    </li>
  );
}
