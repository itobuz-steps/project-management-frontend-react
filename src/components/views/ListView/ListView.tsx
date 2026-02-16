import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getTasks } from '../../../services/taskService';
import { updateTask } from '../../../services/taskService';
import type {
  Task,
  TaskPopulated,
  TaskStatus,
} from '../../../services/types/tasks.types';
import { useProject } from '../../../context/ProjectContext';
import { listViewHeaders } from './listView.constants';
import { TaskRow } from '../../backlog/TaskRow';

function ListView() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { columns } = useProject();

  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalize = (value?: string) => (value ?? '').toLowerCase().trim();
  const statusFilter = normalize(searchParams.get('status') || '');
  const priorityFilter = normalize(searchParams.get('priority') || '');

  const visibleTasks = useMemo(() => {
    if (!statusFilter && !priorityFilter) return tasks;
    return tasks.filter((task) => {
      if (statusFilter && normalize(task.status) !== statusFilter) {
        return false;
      }
      if (priorityFilter && normalize(task.priority) !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [priorityFilter, statusFilter, tasks]);

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
        const result = await getTasks({
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
  }, [projectId, searchParams.get('searchInput')]);

  const handleUpdate = (taskId: string, patch: Partial<TaskPopulated>) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === taskId ? { ...task, ...patch } : task))
    );

    void updateTask(taskId, patch).catch(() => {
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? { ...task, ...patch } : task))
      );
    });
  };

  if (!projectId) {
    return (
      <div className="bg-primary-50 rounded-lg border p-6 text-center text-gray-500">
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
    <div className="no-scrollbar relative mt-2 w-full overflow-x-auto rounded-md border border-gray-200">
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
              <TaskRow
                key={task._id}
                task={task}
                onPatch={handleUpdate}
                columns={columns}
                containerId={projectId}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListView;
