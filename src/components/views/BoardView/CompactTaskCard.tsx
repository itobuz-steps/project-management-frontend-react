import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import type { MouseEvent } from 'react';
import { Tooltip } from 'antd';
import { CalendarDays, Flag, Link2, SquareCheckBig } from 'lucide-react';
import { DeleteOutlined } from '@ant-design/icons';
import type { TaskPopulated, User } from '../../../services/types/tasks.types';
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import { PRIORITY_COLORS } from '../../taskModal/constants';
import { AssigneeCell } from '../../ui/AssigneeCell';

interface CompactTaskCardProps {
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

export function CompactTaskCard({
  task,
  isCompleted,
  linksCount,
  subtasksTotal,
  priorityLabel,
  onDeleteClick,
  onUpdated,
  members,
  loadingMembers,
}: CompactTaskCardProps) {
  const dueDateText = task.dueDate
    ? dayjs(task.dueDate).format('DD MMM')
    : 'No due date';

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
          <Tooltip title={task.type} placement="top">
            <span className="inline-flex">
              <TaskTypeIcon type={task.type} />
            </span>
          </Tooltip>
          <Link
            to={`/task/${task._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded px-1 py-0.5 whitespace-nowrap hover:bg-gray-50 dark:hover:bg-slate-700"
            onClick={(event) => event.stopPropagation()}
          >
            <TaskTypeColor type={task.type}>{task.key}</TaskTypeColor>
          </Link>
          <Tooltip title={`Priority: ${priorityLabel}`} placement="top">
            <span
              className={
                'inline-flex items-center rounded-sm p-1 ' +
                `text-${PRIORITY_COLORS[task.priority || 'low']}-700` +
                ` bg-${PRIORITY_COLORS[task.priority || 'low']}-50`
              }
            >
              <Flag size={13} />
            </span>
          </Tooltip>

          <Tooltip title={`Links: ${linksCount}`} placement="top">
            <span className="inline-flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs text-gray-600 dark:text-slate-300">
              <Link2 size={13} />
              {linksCount}
            </span>
          </Tooltip>

          <Tooltip title={`Subtasks: ${subtasksTotal}`} placement="top">
            <span className="inline-flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs text-gray-600 dark:text-slate-300">
              <SquareCheckBig size={13} />
              {subtasksTotal}
            </span>
          </Tooltip>
        </span>

        <button
          type="button"
          aria-label="Task actions"
          className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          onClick={onDeleteClick}
        >
          <DeleteOutlined
            size={16}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>
      </div>

      <div className="mt-3">
        <p
          className={`line-clamp-2 text-lg leading-tight font-semibold ${
            isCompleted
              ? 'text-gray-400 line-through dark:text-slate-500'
              : 'text-gray-900 dark:text-slate-100'
          }`}
        >
          {task.title}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          {dueDateText}
        </span>
        <div
          className="h-7 w-30 overflow-hidden"
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
    </>
  );
}
