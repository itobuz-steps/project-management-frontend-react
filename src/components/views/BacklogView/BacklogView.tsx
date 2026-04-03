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
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import SearchBar from '../../navbar/SearchBar';
import { Users } from 'lucide-react';
import { InviteUserContainer } from '../../common/InviteUserContainer';
import { ProjectMembersModal } from '../../common/ProjectMembersModal';

function BacklogView() {
  const { projectId } = useParams();
  const { project, columns, tasks, setTasks } = useProject();
  const sprintService = useMemo(
    () => (projectId ? createSprintService(projectId) : null),
    [projectId]
  );

  const [searchParams] = useSearchParams();

  const type = project?.projectType;
  const isScrum = type === 'scrum';

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completedSprintId, setCompletedSprintId] = useState<string | null>(
    null
  );
  const [isMembersOpen, setIsMembersOpen] = useState(false);

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

  const searchInput = searchParams.get('searchInput') || undefined;

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
            searchInput,
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
  }, [type, searchInput, projectId, sprintService]);

  const sprintTaskIds = new Set(sprints.flatMap((s) => s.tasks));

  const backlogTasks = tasks.filter(
    (task) =>
      !sprintTaskIds.has(task._id) &&
      task.status !== 'done' &&
      matchesFilters(task)
  );

  const activeTask = activeTaskId ? taskById.get(activeTaskId) : null;

  const priorityChipClass = (priority?: string) => {
    const normalized = (priority ?? '').toLowerCase();
    if (normalized.includes('highest') || normalized.includes('high')) {
      return 'bg-red-50 text-red-700 border-red-200';
    }

    if (normalized.includes('medium')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }

    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:justify-start lg:gap-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:justify-start">
          <div className="min-w-60 sm:min-w-70">
            <SearchBar />
          </div>
          {project && (
            <>
              <button
                onClick={() => setIsMembersOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none dark:text-slate-200 dark:hover:bg-[#2a2a33] dark:hover:text-white dark:focus-visible:ring-slate-600"
                aria-label="Show members"
              >
                <Users size={16} strokeWidth={1.9} />
              </button>
              <InviteUserContainer />
            </>
          )}
        </div>
      </div>

      {!projectId ? (
        <div className="rounded-lg border bg-white p-6 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-slate-200">
            No project selected
          </h2>
          <p className="text-sm">
            Select a project from the sidebar or create a new one to get
            started.
          </p>
        </div>
      ) : loading ? (
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
      ) : (
        <div className="rounded-lg bg-white p-1 dark:bg-slate-900">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(event) => setActiveTaskId(String(event.active.id))}
            onDragEnd={({ active, over }) => {
              if (!sprintService) {
                return;
              }

              setActiveTaskId(null);
              if (!over) {
                return;
              }

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
                    <div className="rounded border bg-gray-50 p-6 text-center text-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      <h2 className="mb-2 font-semibold text-gray-500 dark:text-slate-300">
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
                          (t) =>
                            sprint.tasks.includes(t._id) && matchesFilters(t)
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
              {activeTask ? (
                <div className="w-80 cursor-move rounded-xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/95">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <TaskTypeIcon type={activeTask.type} />
                      <TaskTypeColor type={activeTask.type}>
                        <span className="rounded px-2 py-0.5 text-xs font-semibold text-white">
                          {activeTask.key || 'TASK'}
                        </span>
                      </TaskTypeColor>
                    </div>
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 capitalize dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {activeTask.status || 'todo'}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm leading-5 font-semibold text-gray-800 dark:text-slate-100">
                    {activeTask.title || 'Untitled task'}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                    {activeTask.priority ? (
                      <span
                        className={`rounded-full border px-2 py-0.5 font-medium capitalize ${priorityChipClass(activeTask.priority)}`}
                      >
                        {activeTask.priority}
                      </span>
                    ) : null}
                    <span className="truncate text-gray-500 dark:text-slate-400">
                      {activeTask.assignee?.name || 'Unassigned'}
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
      <ProjectMembersModal
        open={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </>
  );
}

export default BacklogView;
