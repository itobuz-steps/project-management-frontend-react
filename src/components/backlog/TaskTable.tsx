import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StatusSelect } from '../../utils/StatusSelect';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { getPriorityBorder } from '../../utils/utils';
import type { TaskTableProps } from './type';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTask } from '../../services/taskService';
import type { Task } from '../../types/tasks.types';
import { message } from 'antd';

const formatDateForInput = (date?: string) => {
  if (!date) return '';
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
};

function TaskRow({
  task,
  containerId,
  columns,
  onPatch,
}: {
  task: Task;
  containerId: string;
  columns: string[];
  onPatch: (id: string, patch: Partial<Task>) => void;
}) {
  const navigate = useNavigate();
  const { projectId } = useParams();
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

      <td className="p-2 font-medium whitespace-nowrap text-blue-600">
        {task.key}
      </td>

      <td
        className="cursor-pointer p-2 px-6 whitespace-nowrap hover:underline"
        onClick={() => {
          navigate(`/dashboard/${projectId}/${task._id}`);
        }}
      >
        {task.title}
      </td>

      <td className="p-2 px-6 whitespace-nowrap">
        <StatusSelect
          taskId={task._id}
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
            src={`${task.assignee?.profileImage}`}
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
              className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
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
            src={`${task.reporter?.profileImage}
                            ? config.API_BASE_URL + '/uploads/profile/' + task.reporter.avatarUrl
                            : '../../../assets/img/profile.png'}`}
          />
          {task.reporter?.name ?? 'Unknown'}
        </div>
      </td>
    </tr>
  );
}

export function TaskTable({
  sprint,
  tasks,
  columns,
  title,
  containerId,
}: TaskTableProps) {
  const [open, setOpen] = useState(true);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const updateTaskInState = (id: string, patch: Partial<Task>) => {
    setLocalTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...patch } : t))
    );
  };

  const { setNodeRef, isOver } = useDroppable({
    id: `container:${containerId}`,
    data: { type: 'container', containerId },
  });

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {/* Sprint Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-t-lg bg-gray-50 px-4 py-2 text-left hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`h-4 w-4 transition ${open ? '' : '-rotate-90'}`}
          />
          <span className="font-semibold">{title || sprint?.key}</span>
        </div>

        <div className="space-x-4">
          <span className="text-xs text-gray-400">
            {tasks.length} issue{tasks.length !== 1 && 's'}
          </span>
          {/* 
          <button
            type="button"
            id={`${sprint.key}-sprint-start-button`}
            className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 font-medium text-white shadow-xs focus:outline-none"
          >
            Start Sprint
          </button> */}
        </div>
      </button>

      {/* Sprint Table */}
      {open && (
        <div
          ref={setNodeRef}
          className={`no-scrollbar relative mt-2 w-full overflow-x-auto rounded-md border border-gray-200 ${
            isOver ? 'bg-blue-50' : ''
          }`}
        >
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="sticky top-0 z-10 border-b bg-gray-100 text-xs text-gray-600 uppercase">
              <tr>
                <th scope="col" className="p-2 text-center">
                  Type
                </th>
                <th scope="col" className="p-2">
                  Key
                </th>
                <th scope="col" className="p-2 px-6">
                  Summary
                </th>
                <th scope="col" className="p-2 px-6">
                  Status
                </th>
                <th scope="col" className="p-2 px-6">
                  Assignee
                </th>
                <th scope="col" className="p-2 px-6">
                  Due Date
                </th>
                <th scope="col" className="p-2 px-6">
                  Labels
                </th>
                <th scope="col" className="p-2 px-6">
                  Created
                </th>
                <th scope="col" className="p-2 px-6">
                  Updated
                </th>
                <th scope="col" className="p-2 px-6">
                  Reporter
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <SortableContext
                items={localTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                {tasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="py-10 text-center text-sm text-gray-400"
                    >
                      Drop tasks here…
                    </td>
                  </tr>
                ) : (
                  localTasks.map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      containerId={containerId}
                      columns={columns}
                      onPatch={updateTaskInState}
                    />
                  ))
                )}
              </SortableContext>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
