import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api/interceptor';
import { useSearchParams } from 'react-router-dom';
import type { Sprint } from '../../types/sprint.types';
import type { Task } from '../../types/tasks.types';
import { RenderTaskTable } from '../sprint/RenderTaskTable';

interface BacklogViewProps {
  columns?: string[];
}

function BacklogView({ columns }: BacklogViewProps) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const type = searchParams.get('type');
  const isScrum = type === 'scrum';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData(projectId: string) {
      try {
        setLoading(true);

        const tasksPromise = fetchWithAuth<{ result: Task[] }>('/tasks', {
          params: { projectId },
        });

        const sprintsPromise =
          type === 'scrum'
            ? fetchWithAuth<{ result: Sprint[] }>('/sprint', {
                params: { projectId },
              })
            : Promise.resolve({ result: [] as Sprint[] });

        const [tasksRes, sprintsRes] = await Promise.all([
          tasksPromise,
          sprintsPromise,
        ]);

        setTasks(tasksRes.result);
        setSprints(sprintsRes.result.filter((s) => !s.isCompleted));
      } catch (err) {
        console.error('Failed to load backlog', err);
      } finally {
        setLoading(false);
      }
    }

    if (!projectId) {
      return;
    }

    loadData(projectId);
  }, [projectId, type]);

  if (!projectId) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar or create a new one to get started.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading backlog...</div>;
  }

  const sprintTaskIds = new Set(sprints.flatMap((s) => s.tasks));

  const backlogTasks = tasks.filter(
    (task) => !sprintTaskIds.has(task._id) && task.status !== 'done'
  );

  return (
    <div className="rounded-lg border bg-white p-4">
      {/* SPRINTS */}
      {isScrum && (
        <section className="mb-4 w-full">
          {sprints.length === 0 ? (
            <div className="rounded border bg-gray-50 p-6 text-center text-gray-400">
              <h2 className="mb-2 font-semibold text-gray-500">
                No sprints found
              </h2>
              <p className="text-sm">Create a sprint to organize your tasks.</p>
            </div>
          ) : (
            <div className="w-full space-y-4 overflow-x-auto">
              {sprints.map((sprint) => {
                const sprintTasks = tasks.filter((t) =>
                  sprint.tasks.includes(t._id)
                );

                return (
                  <RenderTaskTable
                    key={sprint._id}
                    sprint={sprint}
                    tasks={sprintTasks}
                    columns={columns || []}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* BACKLOG */}
      {backlogTasks.length === 0 ? (
        <section className="rounded border bg-gray-50 p-6 text-center text-gray-400">
          <h2 className="mb-2 font-semibold text-gray-500">No backlog tasks</h2>
          <p className="text-sm">Create a sprint to organize your tasks.</p>
        </section>
      ) : (
        <>
          {/* <h2 className="mb-2 font-semibold">Backlog</h2> */}
          <RenderTaskTable
            key={'Backlog'}
            sprint={undefined}
            tasks={backlogTasks}
            columns={columns || []}
            title="Backlog"
          />
        </>
      )}
    </div>
  );
}

export default BacklogView;
