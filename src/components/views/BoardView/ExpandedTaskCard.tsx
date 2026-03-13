import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import type { MouseEvent } from 'react';
import { Tooltip } from 'antd';
import { CalendarDays, Flag, Link2, SquareCheckBig, Trash } from 'lucide-react';
import type { TaskPopulated, User } from '../../../services/types/tasks.types';
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import { PRIORITY_COLORS } from '../../taskModal/constants';
import { AssigneeCell } from '../../ui/AssigneeCell';

interface ExpandedTaskCardProps {
  task: TaskPopulated;
  isCompleted: boolean;
  linksCount: number;
  subtasksTotal: number;
  priorityLabel: string;
  onDeleteClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onUpdated: (task: TaskPopulated) => void;
  members: User[];
  loadingMembers: boolean;
}

export function ExpandedTaskCard({
  task,
  isCompleted,
  linksCount,
  subtasksTotal,
  priorityLabel,
  onDeleteClick,
  onUpdated,
  members,
  loadingMembers,
}: ExpandedTaskCardProps) {
  const dueDateText = task.dueDate
    ? dayjs(task.dueDate).format('DD MMM YYYY')
    : 'No due date';

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <Tooltip title={task.type} placement="top">
            <span className="inline-flex">
              <TaskTypeIcon type={task.type} />
            </span>
          </Tooltip>
          <Link
            to={`/task/${task._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded px-1 py-0.5 whitespace-nowrap hover:bg-gray-50"
            onClick={(event) => event.stopPropagation()}
          >
            <TaskTypeColor type={task.type}>{task.key}</TaskTypeColor>
          </Link>
        </span>

        <button
          type="button"
          aria-label="Task actions"
          className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          onClick={onDeleteClick}
        >
          <Trash
            size={16}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>
      </div>

      <div className="mt-3">
        <p
          className={`line-clamp-2 text-lg leading-tight font-semibold ${
            isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {task.title}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Assignee:</p>
        <div className="flex -space-x-2">
          <div
            className="h-7 w-45 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <AssigneeCell
              task={task}
              members={members}
              loading={loadingMembers}
              onUpdated={onUpdated}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          {dueDateText}
        </span>

        <span
          className={
            'inline-flex items-center gap-1 rounded-sm px-3 py-1 text-xs font-semibold ' +
            `text-${PRIORITY_COLORS[task.priority || 'low']}-700` +
            ` bg-${PRIORITY_COLORS[task.priority || 'low']}-50`
          }
        >
          <Flag size={13} />
          {priorityLabel}
        </span>
      </div>

      <div className="mt-3 h-px bg-gray-100" />

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <Link2 size={14} />
          {linksCount} Links
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SquareCheckBig size={14} />
          {subtasksTotal} Subtasks
        </span>
      </div>
    </>
  );
}
