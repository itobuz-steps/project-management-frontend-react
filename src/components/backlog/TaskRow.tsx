import { CSS } from '@dnd-kit/utilities';
import { StatusSelect } from '../ui/StatusSelect';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { getPriorityBorder } from '../../utils/utils';
import dayjs from 'dayjs';
import { useSortable } from '@dnd-kit/sortable';
import { AssigneeCell } from '../ui/AssigneeCell';
import type { TaskRowProps } from './type';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import { TaskKeyCell } from '../ui/TaskKeyCell';
import { TaskTitleCell } from '../ui/TaskTitleCell';
import { DueDateCell } from '../ui/DueDateCell';
import { UserCell } from '../ui/UserCell';
import { usePermissions } from '../../hooks/usePermissions';

export function TaskRow({
  task,
  containerId,
  columns,
  members,
  loadingMembers,
  onUpdated,
}: TaskRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: 'task', containerId },
  });

  const { update } = useTaskUpdate(task._id, onUpdated);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const { can } = usePermissions();

  const isCompleted = task.status === columns[columns.length - 1];

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

      <TaskKeyCell
        taskId={task._id}
        type={task.type}
        taskKey={task.key as string}
      />

      <TaskTitleCell
        title={task.title}
        taskId={task._id}
        isCompleted={isCompleted}
      />

      <td className="p-3 px-6 whitespace-nowrap">
        <StatusSelect
          value={task.status}
          columns={columns}
          onChange={(status) => update({ status }, 'Failed to update status')}
        />
      </td>
      <td className="w-[200px] max-w-[200px] truncate p-3 px-6">
        <AssigneeCell
          task={task}
          members={members}
          loading={loadingMembers}
          onUpdated={onUpdated}
        />
      </td>
      <td className="p-3 px-6 whitespace-nowrap">
        <DueDateCell
          dueDate={task.dueDate}
          isCompleted={isCompleted}
          onChange={(dueDate) =>
            update({ dueDate }, 'Failed to update due date')
          }
        />
      </td>

      <td className="p-3 px-6 whitespace-nowrap">
        <div className="flex gap-1">
          {task.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-primary-100 text-primary-700 rounded px-2 py-0.5 text-xs"
            >
              {tag}
            </span>
          ))}

          {task.tags && task.tags.length > 3 && (
            <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      </td>

      <td className="p-3 px-6 text-xs text-gray-500">
        {task.createdAt && dayjs(task.createdAt).format('DD-MM-YYYY')}
      </td>

      <td className="p-3 px-6 text-xs text-gray-500">
        {task.updatedAt && dayjs(task.updatedAt).format('DD-MM-YYYY')}
      </td>

      <td className="w-[200px] max-w-[200px] truncate p-3 px-6 whitespace-nowrap">
        {can('REPORTER_CHANGE') ? (
          <AssigneeCell
            task={task}
            members={members}
            loading={loadingMembers}
            onUpdated={onUpdated}
            field="reporter"
          />
        ) : (
          <UserCell user={task.reporter} emptyText="Unknown" />
        )}
      </td>
    </tr>
  );
}
