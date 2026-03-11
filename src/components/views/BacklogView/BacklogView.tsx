import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { Sprint } from '../../../services/types/sprints.types';
import { TaskTable } from '../../backlog/TaskTable';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import SprintModal from '../../sprintModal/SprintModal';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createSprintService } from '../../../services/sprints.service';
import { useProject } from '../../../context/ProjectContext';
import { useSearchParams } from 'react-router-dom';
import { getTasks } from '../../../services/taskService';
import { message, Skeleton } from 'antd';

function BacklogView() {
  const { projectId } = useParams();
  const { project, columns } = useProject();
  const sprintService = useMemo(
    () => (projectId ? createSprintService(projectId) : null),
    [projectId]
  );

  const [searchParams] = useSearchParams();

  const type = project?.projectType;
  const isScrum = type === 'scrum';

  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completedSprintId, setCompletedSprintId] = useState<string | null>(
    null
  );

  const handleSprintCompleted = useCallback((sprintId: string) => {
    setCompletedSprintId(sprintId);
  }, []);

  const handleCloseSprintModal = useCallback(() => {
    setCompletedSprintId(null);
  }, []);

  const normalize = (value?: string) => (value ?? '').toLowerCase().trim();
  const statusFilters = (searchParams.get('status') || '')
    .split(',')
    .filter(Boolean)
    .map(normalize);
  const priorityFilters = (searchParams.get('priority') || '')
    .split(',')
    .filter(Boolean)
    .map(normalize);
  const assigneeFilters = (searchParams.get('assignee') || '')
    .split(',')
    .filter(Boolean)
    .map(normalize);

  const matchesFilters = (task: TaskPopulated) => {
    if (
      statusFilters.length &&
      !statusFilters.includes(normalize(task.status))
    ) {
      return false;
    }
    if (
      priorityFilters.length &&
      !priorityFilters.includes(normalize(task.priority))
    ) {
      return false;
    }
    if (
      assigneeFilters.length &&
      !assigneeFilters.includes(normalize(task.assignee?._id || ''))
    ) {
      return false;
    }
    return true;
  };

  const searchInput = searchParams.get('searchInput');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const taskById = useMemo(
    () => new Map(tasks.map((t) => [t._id, t])),
    [tasks]
  );

  const containerIds = useMemo(
    () => ['backlog', ...sprints.map((s) => s._id)],
    [sprints]
  );

  useEffect(() => {
    if (!projectId) {
      return;
    }

    if (!type) {
      return;
    }

    async function loadData(projectId: string) {
      try {
        setLoading(true);

        const [tasksRes, sprintsRes] = await Promise.all([
          getTasks({
            projectId,
            searchInput: searchParams.get('searchInput') || '',
          }),
          type === 'scrum' && sprintService
            ? sprintService.getSprints()
            : Promise.resolve([]),
        ]);

        setTasks(tasksRes);
        setSprints(sprintsRes.filter((sprint) => !sprint.isCompleted));
      } catch (err) {
        console.error('Failed to load backlog', err);
        message.error('Failed to load backlog data');
      } finally {
        setLoading(false);
      }
    }

    loadData(projectId);
  }, [type, searchInput, projectId, sprintService, searchParams]);

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
    return (
      <div className="rounded-lg p-4">
        <div className="flex flex-col gap-3">
          <Skeleton.Input active={true} size="large" block={true} />
          <div className="flex flex-col gap-2">
            <Skeleton.Input active={true} size="default" block={true} />
            <Skeleton.Input active={true} size="default" block={true} />
            <Skeleton.Input active={true} size="default" block={true} />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton.Input active={true} size="large" block={true} />
          <div className="flex flex-col gap-2">
            <Skeleton.Input active={true} size="default" block={true} />
            <Skeleton.Input active={true} size="default" block={true} />
            <Skeleton.Input active={true} size="default" block={true} />
          </div>
        </div>
      </div>
    );
  }

  const sprintTaskIds = new Set(sprints.flatMap((s) => s.tasks));

  const backlogTasks = tasks.filter(
    (task) =>
      !sprintTaskIds.has(task._id) &&
      task.status !== 'done' &&
      matchesFilters(task)
  );

  return (
    <div className="rounded-lg bg-white p-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => setActiveTaskId(String(event.active.id))}
        onDragEnd={({ active, over }) => {
          if (!sprintService) {
            return;
          }

          setActiveTaskId(null);
          if (!over) return;

          const activeContainer = active.data.current?.containerId as
            | string
            | undefined;

          const overContainer =
            (over.data.current?.containerId as string | undefined) ??
            (typeof over.id === 'string' && over.id.startsWith('container:')
              ? over.id.replace('container:', '')
              : undefined);

          if (!activeContainer || !overContainer) {
            return;
          }
          if (activeContainer === overContainer) {
            return;
          }

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
            calls.push(
              sprintService.removeTaskFromSprint(sourceSprint._id, taskId)
            );
          }

          if (targetSprint) {
            calls.push(
              sprintService.addTasksToSprint(targetSprint._id, [taskId])
            );
          }

          if (calls.length) {
            void Promise.all(calls).catch(() => {
              setSprints(previousSprints);
            });
          }
        }}
      >
        {/* CONTAINER LAYER */}
        <SortableContext
          items={containerIds}
          strategy={verticalListSortingStrategy}
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
                    const sprintTasks = tasks.filter(
                      (t) => sprint.tasks.includes(t._id) && matchesFilters(t)
                    );

                    return sprint.isCompleted ? null : (
                      <TaskTable
                        key={sprint._id}
                        sprint={sprint}
                        setSprints={setSprints}
                        tasks={sprintTasks}
                        columns={columns || []}
                        containerId={sprint._id}
                        onSprintCompleted={handleSprintCompleted}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* BACKLOG */}
          <TaskTable
            key="backlog"
            sprint={undefined}
            setSprints={
              project?.projectType === 'scrum' ? setSprints : undefined
            }
            tasks={backlogTasks}
            columns={columns || []}
            title="Backlog"
            containerId="backlog"
          />
        </SortableContext>

        {/* Sprint Completion Modal */}
        {completedSprintId && (
          <SprintModal
            visible={!!completedSprintId}
            onClose={handleCloseSprintModal}
            sprintId={completedSprintId}
            projectId={projectId}
          />
        )}

        {/* DRAG PREVIEW */}
        <DragOverlay>
          {activeTaskId ? (
            <div className="w-64 cursor-move rounded-md border bg-white p-3 shadow-lg">
              {taskById.get(activeTaskId)?.title ?? 'Dragging...'}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default BacklogView;
