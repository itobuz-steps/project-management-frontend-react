import { useState } from 'react';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import { useSortable } from '@dnd-kit/sortable';
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import { CalendarDays, Flag, Link2, SquareCheckBig, Trash } from 'lucide-react';
import { DeleteTaskModal } from '../../../utils/DeleteTaskModal';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import { PRIORITY_COLORS } from '../../taskModal/constants';

export function TaskCard({
  task,
  column,
  onOpen,
}: {
  task: TaskPopulated;
  column: string;
  onOpen: () => void;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { columns } = useProject();

  const isCompleted = column === columns[columns.length - 1];

  const dueDateText = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'No due date';

  const priorityLabel =
    task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1);

  const linksCount =
    (task.blocks?.length ?? 0) +
    (task.blockedBy?.length ?? 0) +
    (task.relatesTo?.length ?? 0) +
    (task.duplicates?.length ?? 0);

  const subtasksTotal = task.subTasks?.length ?? 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: 'task', column } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onOpen()}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <TaskTypeIcon type={task.type} />
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
          onClick={(event) => {
            event.stopPropagation();
            setIsDeleteOpen(true);
          }}
        >
          <Trash size={16} />
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
        <p className="text-sm text-gray-600">Assignees:</p>
        <div className="flex -space-x-2">
          {[task.assignee, task.reporter]
            .filter(
              (user, index, arr) =>
                user && arr.findIndex((u) => u?._id === user._id) === index
            )
            .map((user) => (
              <span
                key={user?._id}
                className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-100 text-[11px] font-semibold text-gray-700"
                title={user?.name}
              >
                <img
                  src={user?.profileImage ? user.profileImage : '/profile.png'}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              </span>
            ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          {dueDateText}
        </span>

        <span
          className={
            'inline-flex items-center gap-1 rounded-sm px-3 py-1 text-xs font-semibold text-indigo-700 ' +
            `text-${PRIORITY_COLORS[task.priority || 'low']}-400` +
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
          {subtasksTotal}
        </span>
      </div>

      <DeleteTaskModal
        task={task}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
