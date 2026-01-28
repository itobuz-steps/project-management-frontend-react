import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '../api/interceptor';
import { useSearchParams } from 'react-router-dom';
import type { Sprint } from '../../types/sprint.types';
import type { Task } from '../../types/tasks.types';
import { TaskTable } from '../backlog/TaskTable';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  addTasksToSprint,
  removeTaskFromSprint,
} from '../../services/sprints.service';

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
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const taskById = useMemo(
    () => new Map(tasks.map((t) => [t._id, t])),
    [tasks]
  );

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

    if (projectId) {
      loadData(projectId);
    }
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => setActiveTaskId(String(event.active.id))}
        onDragEnd={({ active, over }) => {
          setActiveTaskId(null);
          if (!over || active.id === over.id) return;

          const activeContainer = active.data.current?.containerId as
            | string
            | undefined;

          const overContainer =
            (over.data.current?.containerId as string | undefined) ??
            (typeof over.id === 'string' && over.id.startsWith('container:')
              ? over.id.replace('container:', '')
              : undefined);

          if (!activeContainer || !overContainer) return;
          if (activeContainer === overContainer) return;

          const taskId = String(active.id);

          const previousSprints = sprints;

          const nextSprints = sprints.map((sprint) => {
            if (sprint._id === activeContainer) {
              return {
                ...sprint,
                tasks: sprint.tasks.filter((id) => id !== taskId),
              };
            }

            if (sprint._id === overContainer) {
              return {
                ...sprint,
                tasks: sprint.tasks.includes(taskId)
                  ? sprint.tasks
                  : [...sprint.tasks, taskId],
              };
            }

            return sprint;
          });

          setSprints(nextSprints);

          const sourceSprint =
            activeContainer !== 'backlog'
              ? sprints.find((s) => s._id === activeContainer)
              : null;

          const targetSprint =
            overContainer !== 'backlog'
              ? sprints.find((s) => s._id === overContainer)
              : null;

          const calls: Promise<unknown>[] = [];

          if (sourceSprint) {
            calls.push(removeTaskFromSprint(sourceSprint._id, taskId));
          }

          if (targetSprint) {
            calls.push(addTasksToSprint(targetSprint._id, [taskId]));
          }

          if (calls.length > 0) {
            void Promise.all(calls).catch(() => {
              setSprints(previousSprints);
            });
          }
        }}
      >
        {/* SPRINTS */}
        {isScrum && (
          <section className="mb-4 w-full">
            {sprints.length === 0 ? (
              <div className="rounded border bg-gray-50 p-6 text-center text-gray-400">
                <h2 className="mb-2 font-semibold text-gray-500">
                  No sprints found
                </h2>
                <p className="text-sm">
                  Create a sprint to organize your tasks.
                </p>
              </div>
            ) : (
              <div className="w-full space-y-4 overflow-x-auto">
                {sprints.map((sprint) => {
                  const sprintTasks = tasks.filter((t) =>
                    sprint.tasks.includes(t._id)
                  );

                  return (
                    <TaskTable
                      key={sprint._id}
                      sprint={sprint}
                      tasks={sprintTasks}
                      columns={columns || []}
                      containerId={sprint._id}
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
            <h2 className="mb-2 font-semibold text-gray-500">
              No backlog tasks
            </h2>
            <p className="text-sm">Create a sprint to organize your tasks.</p>
          </section>
        ) : (
          <TaskTable
            key="Backlog"
            sprint={undefined}
            tasks={backlogTasks}
            columns={columns || []}
            title="Backlog"
            containerId="backlog"
          />
        )}

        <DragOverlay>
          {activeTaskId ? (
            <div className="w-64 cursor-move rounded-md border bg-white p-3 shadow-lg">
              {taskById.get(activeTaskId)?.title || 'Dragging...'}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default BacklogView;
