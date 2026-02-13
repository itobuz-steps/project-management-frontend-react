import { CSS } from '@dnd-kit/utilities';
import { StatusSelect } from '../../utils/StatusSelect';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { formatDateForInput, getPriorityBorder } from '../../utils/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { updateTask } from '../../services/taskService';
import { useSortable } from '@dnd-kit/sortable';
import { message } from 'antd';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { TaskTypeColor } from '../../utils/TaskTypeColor';
import { config } from '../../config/config';

export function TaskRow({
  task,
  containerId,
  columns,
  onPatch,
}: {
  task: TaskPopulated;
  containerId: string;
  columns: string[];
  onPatch: (id: string, patch: Partial<TaskPopulated>) => void;
}) {
  const [, setSearchParams] = useSearchParams();
  // const location = useLocation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: 'task', containerId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      key={task._id}
      ref={setNodeRef}
      className={`whitespace-nowrap hover:bg-gray-50 ${getPriorityBorder(
        task.priority
      )} ${isDragging ? 'opacity-50' : ''}`}
      style={{ ...style, touchAction: 'none' }}
      {...attributes}
      {...listeners}
    >
      <td className="p-2 text-center whitespace-nowrap">
        <div className="flex justify-center">
          <TaskTypeIcon type={task.type} />
        </div>
      </td>
      <td>
        <Link
          to={`/task/${task._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-full w-full cursor-pointer p-2 font-medium whitespace-nowrap text-white hover:underline"
        >
          <TaskTypeColor type={task.type}>{task.key}</TaskTypeColor>
        </Link>
      </td>
      <td
        className="cursor-pointer p-2 px-6 whitespace-nowrap hover:underline"
        onClick={() => {
          setSearchParams({ taskId: task._id }, { replace: true });
        }}
      >
        {task.title}
      </td>
      <td className="p-2 px-6 whitespace-nowrap">
        <StatusSelect
          value={task.status}
          columns={columns}
          onChange={async (newStatus) => {
            onPatch(task._id, { status: newStatus });
            try {
              await updateTask(task._id, { status: newStatus });
            } catch {
              message.error('Failed to update status');
            }
          }}
        />
      </td>
      <td className="p-2 px-6 whitespace-nowrap">
        <div className="flex items-center">
          <img
            className="mr-3 aspect-square h-6 w-6 rounded-full object-cover"
            src={
              task.assignee?.profileImage
                ? `${config.api_base_url}/uploads/${task.assignee?.profileImage}`
                : '/profile.png'
            }
          />
          {task.assignee?.name ?? 'Unassigned'}
        </div>
      </td>
      <td className="p-2 px-6 whitespace-nowrap">
        <input
          type="date"
          value={formatDateForInput(task.dueDate)}
          onChange={async (e) => {
            const newDate = e.target.value;
            if (!newDate) return;

            onPatch(task._id, { dueDate: newDate });
            try {
              await updateTask(task._id, { dueDate: newDate });
            } catch {
              message.error('Failed to update due date');
            }
          }}
          className={`w-28 rounded-md border bg-gray-50 p-1 text-sm outline-none ${
            task.dueDate && new Date(task.dueDate) < new Date()
              ? 'text-red-600'
              : ''
          }`}
        />
      </td>
      <td className="p-2 px-6 whitespace-nowrap">
        <div className="flex gap-1">
          {task.tags?.slice(0, 3).map((label) => (
            <span
              key={label}
              className="bg-primary-100 text-primary-700 rounded px-2 py-0.5 text-xs"
            >
              {label}
            </span>
          ))}

          {task.tags && task.tags.length > 3 && (
            <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="p-2 px-6 text-xs whitespace-nowrap text-gray-500">
        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}
      </td>
      <td className="p-2 px-6 text-xs whitespace-nowrap text-gray-500">
        {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : ''}
      </td>
      <td className="p-2 px-6 whitespace-nowrap">
        <div className="flex items-center">
          <img
            className="mr-3 aspect-square h-6 w-6 rounded-full object-cover"
            src={
              task.reporter?.profileImage
                ? `${config.api_base_url}/uploads/${task.reporter?.profileImage}`
                : '/profile.png'
            }
          />
          {task.reporter?.name ?? 'Unknown'}
        </div>
      </td>
    </tr>
  );
}
