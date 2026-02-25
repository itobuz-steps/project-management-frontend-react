import { useState } from 'react';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import { useSortable } from '@dnd-kit/sortable';
import { getTypeBorder } from '../../../utils/utils';
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import { Trash } from 'lucide-react';
import { DeleteTaskModal } from '../../../utils/DeleteTaskModal';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';

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
      className={`group rounded-md ${getTypeBorder(task.type)} bg-white p-3 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex cursor-pointer items-start justify-between gap-2">
        <div>
          <p
            className={`mb-4 cursor-pointer text-sm font-medium hover:underline ${
              isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}
            onClick={() => onOpen()}
          >
            {task.title}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <TaskTypeIcon type={task.type} />
            <Link
              to={`/task/${task._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 whitespace-nowrap"
            >
              <TaskTypeColor type={task.type}>
                {task.key ?? task._id}
              </TaskTypeColor>
            </Link>
          </p>
        </div>

        <button
          type="button"
          aria-label="Delete task"
          className="rounded p-1 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-50 hover:text-gray-600"
          onClick={(event) => {
            event.stopPropagation();
            setIsDeleteOpen(true);
          }}
        >
          <Trash size={16} />
        </button>
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
