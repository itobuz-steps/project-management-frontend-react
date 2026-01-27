import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/interceptor';
import { getProjectById } from '../../services/projects.service';
import { getTasks } from '../../services/tasks.service';
import type { Task } from '../../services/types/tasks.types';
import type { Sprint } from '../../types/sprint.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../utils/TaskTypeColor';

function BoardView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const type = searchParams.get('type');
  const isScrum = type === 'scrum';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalize = (value?: string) => (value ?? '').toLowerCase().trim();

  const sprintTaskIds = useMemo(() => {
    if (!isScrum) return null;

    return new Set(
      sprints.filter((sprint) => !sprint.isCompleted).flatMap((s) => s.tasks)
    );
  }, [isScrum, sprints]);

  const visibleTasks = useMemo(() => {
    if (!isScrum) return tasks;
    if (!sprintTaskIds || sprintTaskIds.size === 0) return [];

    return tasks.filter((task) => sprintTaskIds.has(task._id));
  }, [isScrum, sprintTaskIds, tasks]);

  const tasksByColumn = useMemo(() => {
    const map = columns.reduce<Record<string, Task[]>>((acc, col) => {
      acc[col] = [];
      return acc;
    }, {});

    visibleTasks.forEach((task) => {
      const match = columns.find(
        (col) => normalize(col) === normalize(task.status)
      );

      if (match) {
        map[match].push(task);
      } else if (columns.length > 0) {
        map[columns[0]].push(task);
      }
    });

    return map;
  }, [columns, normalize, visibleTasks]);

  useEffect(() => {
    if (!projectId) {
      setColumns([]);
      setTasks([]);
      setSprints([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projectResp, tasksResp, sprintsResp] = await Promise.all([
          getProjectById(projectId),
          getTasks({ projectId }),
          isScrum
            ? fetchWithAuth<{ result?: Sprint[] } | Sprint[]>('/sprint', {
                params: { projectId },
              })
            : Promise.resolve([] as Sprint[]),
        ]);

        const project =
          typeof projectResp === 'object' && projectResp
            ? ((projectResp as { result?: { columns?: string[] } }).result ??
              projectResp)
            : projectResp;

        const projectColumns =
          (project as { columns?: string[] })?.columns ?? [];

        const taskPayload = Array.isArray(tasksResp)
          ? tasksResp
          : ((tasksResp as { result?: Task[] }).result ?? []);

        const sprintPayload = Array.isArray(sprintsResp)
          ? sprintsResp
          : ((sprintsResp as { result?: Sprint[] }).result ?? []);

        if (isMounted) {
          setColumns(projectColumns);
          setTasks(taskPayload);
          setSprints(sprintPayload);
        }
      } catch (err) {
        if (isMounted) setError('Failed to load tasks.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [isScrum, projectId]);

  if (!projectId) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view its board.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 sm:gap-6">
      {columns.map((col) => (
        <div key={col} className="w-72 shrink-0">
          <div className="h-full rounded-lg border bg-white shadow-sm">
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-white px-4 py-2">
              <h2 className="text-sm font-semibold text-gray-900 uppercase">
                {col}
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-900">
                {tasksByColumn[col]?.length ?? 0}
              </span>
            </div>

            <div className="flex flex-col gap-3 p-3">
              {loading && (
                <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                  Loading tasks...
                </div>
              )}

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {!loading && !error && tasksByColumn[col]?.length === 0 && (
                <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                  No tasks
                </div>
              )}

              {!loading &&
                !error &&
                tasksByColumn[col]?.map((task) => (
                  <div
                    key={task._id}
                    className="rounded-md border border-gray-100 bg-white p-3 shadow-sm"
                  >
                    <p
                      className="text-sm font-semibold text-gray-900"
                      onClick={() => {
                        const params = new URLSearchParams(location.search);
                        params.set('taskId', task._id);
                        navigate({
                          pathname: location.pathname,
                          search: params.toString(),
                        });
                      }}
                    >
                      {task.title}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <TaskTypeIcon type={task.type} />
                      <TaskTypeColor type={task.type}>
                        {task.key ?? task._id}
                      </TaskTypeColor>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BoardView;
