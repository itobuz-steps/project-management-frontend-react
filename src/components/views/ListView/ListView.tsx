import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { getTasks, updateTask } from '../../../services/tasks.service';
import type { Task, TaskStatus } from '../../../services/types/tasks.types';
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import { StatusSelect } from '../../../utils/StatusSelect';
import { getPriorityBorder } from '../../../utils/utils';
import { useProject } from '../../../context/ProjectContext';
import { listViewHeaders } from './listView.constants';

const priorityStyles: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-yellow-100 text-yellow-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-green-100 text-green-700',
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

function ListView() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { columns } = useProject();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleTasks = useMemo(() => tasks, [tasks]);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      setError(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { result } = await getTasks({
          projectId,
          searchInput: searchParams.get('searchInput') || '',
        });
        setTasks(result);
      } catch {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId, searchParams]);

  const handleStatusChange = (
    taskId: string,
    nextStatus: TaskStatus,
    previousStatus: TaskStatus
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: nextStatus } : task
      )
    );

    void updateTask(taskId, { status: nextStatus }).catch(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: previousStatus } : task
        )
      );
    });
  };

  if (!projectId) {
    return (
      <div className="rounded-lg border bg-blue-50 p-6 text-center text-gray-500">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view its list.
        </p>
      </div>
    );
  }

  return (
    <table className="min-w-full table-auto overflow-x-auto rounded-lg bg-white p-4 text-left text-sm shadow-sm">
      <thead className="z-10 bg-[#f8f8f8] text-xs font-semibold text-gray-500 uppercase">
        <tr>
          {listViewHeaders.map((header) => (
            <th key={header.key} className="p-3">
              {header.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y whitespace-nowrap">
        {loading && (
          <tr>
            <td colSpan={11} className="p-4 text-center text-gray-500">
              Loading tasks...
            </td>
          </tr>
        )}

        {error && !loading && (
          <tr>
            <td colSpan={11} className="p-4 text-center text-red-600">
              {error}
            </td>
          </tr>
        )}

        {!loading && !error && visibleTasks.length === 0 && (
          <tr>
            <td colSpan={11} className="p-4 text-center text-gray-500">
              No tasks available
            </td>
          </tr>
        )}

        {!loading &&
          !error &&
          visibleTasks.map((task) => (
            <tr
              key={task._id}
              className={`cursor-pointer hover:bg-gray-50 ${getPriorityBorder(
                task.priority
              )}`}
              onClick={() => {
                navigate(`/dashboard/${projectId}/${task._id}`);
              }}
            >
              <td className="p-3">
                <TaskTypeIcon type={task.type} />
              </td>
              <td className="p-3 whitespace-nowrap">
                <TaskTypeColor type={task.type}>
                  {task.key ?? task._id}
                </TaskTypeColor>
              </td>
              <td className="p-3 font-medium whitespace-nowrap text-gray-900">
                {task.title}
              </td>
              <td className="p-3" onClick={(event) => event.stopPropagation()}>
                <StatusSelect
                  taskId={task._id}
                  value={task.status}
                  columns={columns}
                  onChange={(value) =>
                    handleStatusChange(
                      task._id,
                      value as TaskStatus,
                      task.status as TaskStatus
                    )
                  }
                />
              </td>
              <td className="p-3 whitespace-nowrap text-gray-700">
                {task.assignee ? String(task.assignee) : 'Unassigned'}
              </td>
              <td className="p-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                    priorityStyles[task.priority] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="p-3 whitespace-nowrap text-gray-700">
                {task.reporter ? String(task.reporter) : 'Unknown'}
              </td>
              <td className="w-full p-3">
                <div className="flex flex-wrap gap-1 whitespace-nowrap">
                  {task.tags?.slice(0, 1).map((label) => (
                    <span
                      key={label}
                      className="rounded bg-blue-100 px-2 py-0.5 text-xs whitespace-nowrap text-blue-700"
                    >
                      {label}
                    </span>
                  ))}
                  {task.tags && task.tags.length > 1 && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-xs whitespace-nowrap">
                      +{task.tags.length - 1}
                    </span>
                  )}
                  {!task.tags?.length && (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </td>
              <td className="p-3 whitespace-nowrap text-gray-600">
                {formatDate(task.createdAt)}
              </td>
              <td className="p-3 whitespace-nowrap text-gray-600">
                {formatDate(task.dueDate)}
              </td>
              <td className="p-3 whitespace-nowrap text-gray-600">
                {formatDate(task.updatedAt)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default ListView;
