import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getTasks } from '../../../services/taskService';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import { useProject } from '../../../context/ProjectContext';
import { TaskRow } from '../../backlog/TaskRow';
import { useProjectMetaData } from '../../../hooks/useProjectMetaData';
import { taskTableColumns } from '../../../config/constants';

function ListView() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { columns } = useProject();

  const { members, loadingMembers } = useProjectMetaData(projectId);

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

  const handleTaskUpdated = (updated: TaskPopulated) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updated._id ? updated : task))
    );
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
      <table className="min-w-full table-auto overflow-x-auto rounded-lg bg-white p-4 text-left text-sm shadow-sm">
        <thead className="z-10 bg-[#f8f8f8] text-xs font-semibold text-gray-500 uppercase">
          <tr>
            {taskTableColumns.map(({ label, className }) => (
              <th key={label} className={className}>
                {label}
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
              <TaskRow
                key={task._id}
                task={task}
                columns={columns}
                containerId={projectId}
                members={members}
                loadingMembers={loadingMembers}
                onUpdated={handleTaskUpdated}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListView;
