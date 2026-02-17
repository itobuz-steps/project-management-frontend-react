import { CSS } from '@dnd-kit/utilities';
import { StatusSelect } from '../../utils/StatusSelect';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { getPriorityBorder } from '../../utils/utils';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { Link, useSearchParams } from 'react-router-dom';
import { updateTask } from '../../services/taskService';
import { useSortable } from '@dnd-kit/sortable';
import { TaskTypeColor } from '../../utils/TaskTypeColor';
import { config } from '../../config/config';
import { AssigneeCell } from '../../utils/AssigneeCell';
import type { TaskRowProps } from './type';

export function TaskRow({
  task,
  containerId,
  columns,
  onPatch,
  members,
  loadingMembers,
  onUpdated,
}: TaskRowProps) {
  const [, setSearchParams] = useSearchParams();
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
        className="space-padding cursor-pointer whitespace-nowrap hover:underline"
        onClick={() => {
          setSearchParams({ taskId: task._id }, { replace: true });
        }}
      >
        {task.title}
      </td>
      <td className="space-padding whitespace-nowrap">
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
      <td className="space-padding px-10 whitespace-nowrap">
        <AssigneeCell
          task={task}
          members={members}
          loading={loadingMembers}
          onUpdated={onUpdated}
        />
      </td>
      <td className="space-padding whitespace-nowrap">
        <DatePicker
          className="w-full max-w-[150px] min-w-[100px] shrink-0"
          value={task.dueDate ? dayjs(task.dueDate) : null}
          placeholder="None"
          format="YYYY-MM-DD"
          size="small"
          status={
            task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day')
              ? 'error'
              : undefined
          }
          onChange={async (date) => {
            if (!date) {
              return;
            }

            const newDate = date.toISOString();
            onPatch(task._id, { dueDate: newDate });

            try {
              await updateTask(task._id, { dueDate: newDate });
            } catch {
              message.error('Failed to update due date');
            }
          }}
        />
      </td>
      <td className="space-padding whitespace-nowrap">
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
      <td className="space-padding text-xs whitespace-nowrap text-gray-500">
        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}
      </td>
      <td className="space-padding text-xs whitespace-nowrap text-gray-500">
        {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : ''}
      </td>
      <td className="space-padding whitespace-nowrap">
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
