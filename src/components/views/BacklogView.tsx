import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api/interceptor';
import { useSearchParams } from 'react-router-dom';
import type { Sprint } from '../../types/sprint.types';
import type { Task } from '../../types/tasks.types';

function BacklogView() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!projectId) {
      return;
    }

    loadData(projectId);
    
  }, [projectId]);

  async function loadData(projectId: string) {
    try {
      setLoading(true);

      const [tasksRes, sprintsRes] = await Promise.all([
        fetchWithAuth<{ result: Task[] }>('/tasks', { params: { projectId } }),
        fetchWithAuth<{ result: Sprint[] }>('/sprint', {
          params: { projectId },
        }),
      ]);

      setTasks(tasksRes.result);
      setSprints(sprintsRes.result.filter((s) => !s.isCompleted));
    } catch (err) {
      console.error('Failed to load backlog', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-4">Loading backlog...</div>;
  }

  const sprintTaskIds = new Set(sprints.flatMap((s) => s.tasks));

  const backlogTasks = tasks.filter(
    (task) => !sprintTaskIds.has(task._id) && task.status !== 'done'
  );

  return (
    <div className="space-y-6 rounded-lg border bg-white p-4">
      {/* SPRINTS */}
      <section className="space-y-4">
        {sprints.map((sprint) => {
          const sprintTasks = tasks.filter((task) =>
            sprint.tasks.includes(task._id)
          );

          return (
            <div key={sprint._id} className="rounded border bg-gray-50 p-3">
              <h3 className="mb-2 font-semibold">{sprint.key}</h3>

              {sprintTasks.length === 0 ? (
                <p className="text-sm text-gray-400">No tasks in this sprint</p>
              ) : (
                <ul className="space-y-1">
                  {sprintTasks.map((task) => (
                    <li key={task._id} className="rounded bg-white p-2 text-sm">
                      {task.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>

      {/* BACKLOG */}
      <section className="rounded border bg-gray-50 p-3">
        <h2 className="mb-2 font-semibold">Backlog</h2>

        {backlogTasks.length === 0 ? (
          <p className="text-sm text-gray-400">No backlog tasks</p>
        ) : (
          <ul className="space-y-1">
            {backlogTasks.map((task) => (
              <li key={task._id} className="rounded border p-2 text-sm">
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BacklogView;
