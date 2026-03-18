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

  if (normalized === 'high') {
    return 'bg-violet-200 text-violet-950';
  }

  if (normalized === 'medium') {
    return 'bg-orange-100 text-orange-900';
  }

  return 'bg-emerald-100 text-emerald-900';
}

function getDaysLeftText(dueDate?: string) {
  if (!dueDate) {
    return 'No due date';
  }

  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) {
    return 'No due date';
  }

  const oneDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.ceil(
    (startDue.getTime() - startToday.getTime()) / oneDay
  );

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  }

  if (diffDays === 0) {
    return 'Due today';
  }

  return `${diffDays} day${diffDays === 1 ? '' : 's'} left`;
}

function getProgressPercent(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized.includes('done') || normalized.includes('complete')) {
    return 100;
  }

  return 0;
}

export function TaskItem({ task }: { task: TaskPopulated }) {
  const [, setSearchParams] = useSearchParams();
  const projectName =
    typeof task.projectId === 'string'
      ? 'Project'
      : ((task.projectId as Project).name ?? 'Project');

  console.log(task.projectId);
  const linksCount =
    (task.blocks?.length ?? 0) +
    (task.blockedBy?.length ?? 0) +
    (task.relatesTo?.length ?? 0) +
    (task.duplicates?.length ?? 0);

  const priorityLabel = toTitleCase(task.priority || 'low');
  const daysLeft = getDaysLeftText(task.dueDate);
  const progressPercent = getProgressPercent(task.status || 'todo');

  return (
    <li
      onClick={() => setSearchParams({ taskId: task._id }, { replace: true })}
      className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-neutral-50 px-3 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:cursor-pointer hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
    >
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="mb-1 min-w-0">
          <div className="flex items-center gap-2">
            <TaskTypeIcon type={task.type} />
            <p className="truncate text-lg leading-7 font-semibold text-gray-900 sm:text-xl dark:text-slate-100">
              {task.title}
            </p>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs! text-gray-500 dark:text-slate-400">
            <span className="bg-primary-400 rounded-sm px-1 py-0.5 text-[10px]! font-semibold text-white">
              {task.key}
            </span>
            <span>{projectName}</span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-end gap-3 text-sm sm:flex-row sm:items-center">
          <span className="hidden w-15 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-gray-700 sm:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Link2 size={14} />
            {linksCount}
          </span>

          <span
            className={`w-21 rounded-md px-3 py-1 text-center text-sm font-semibold ${getPriorityBadgeClass(task.priority || 'low')}`}
          >
            {priorityLabel}
          </span>

          <span className="inline-flex w-36 items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-slate-300">
            <Clock3 size={14} />
            {daysLeft}
          </span>
        </div>
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <div className="flex min-w-33 items-center gap-3">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
            <div
              className="hidden h-full rounded-full bg-black sm:block dark:bg-slate-200"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
            <span
              className="absolute top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white bg-black sm:inline dark:border-slate-900 dark:bg-slate-200"
              style={{ left: `calc(${Math.max(progressPercent, 4)}% - 5px)` }}
            />
          </div>

          <span className="hidden w-8 text-right text-sm font-semibold text-slate-600 sm:inline dark:text-slate-300">
            {progressPercent}%
          </span>
        </div>
      </div>
    </li>
  );
}
