import { ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TaskTableProps } from './type';
import type { TaskPopulated, User } from '../../services/types/tasks.types';
import { createSprintService } from '../../services/sprints.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { SprintMenu } from './SprintMenu';
import { TaskRow } from './TaskRow';
import { SprintButton } from './SprintButton';
import { useProject } from '../../context/ProjectContext';
import { getProjectMembers } from '../../services/projectService';

export function TaskTable({
  sprint,
  setSprints,
  tasks,
  columns,
  title,
  containerId,
}: TaskTableProps) {
  const [open, setOpen] = useState(true);
  const [localTasks, setLocalTasks] = useState<TaskPopulated[]>(tasks);
  const { project } = useProject();

  const sprintService = createSprintService(project?._id as string);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const [members, setMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadMembers() {
      if (!project?._id) return;

      setLoadingMembers(true);
      try {
        const res = await getProjectMembers(project._id);
        if (mounted) setMembers(res);
      } finally {
        setLoadingMembers(false);
      }
    }

    loadMembers();
    return () => {
      mounted = false;
    };
  }, [project?._id]);

  const onTaskUpdated = (updated: TaskPopulated) => {
    setLocalTasks((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
  };

  const updateTaskInState = (id: string, patch: Partial<TaskPopulated>) => {
    setLocalTasks((previous) =>
      previous.map((task) => (task._id === id ? { ...task, ...patch } : task))
    );
  };

  const dueDateRef = useRef<HTMLInputElement>(null);
  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: { containerId },
  });
  const sprintStarted = sprint?.dueDate;

  async function startSprint() {
    if (!sprint) return;
    if (!dueDateRef.current || !dueDateRef.current.value) return;

    const dueDateValue = dueDateRef.current.value;

    try {
      await sprintService.updateSprint(sprint._id, {
        dueDate: new Date(dueDateValue),
      });
      setSprints?.((prevSprints) =>
        prevSprints.map((s) =>
          s._id === sprint._id ? { ...s, dueDate: new Date(dueDateValue) } : s
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to start sprint');
      }
    }
  }

  async function completeSprint() {
    if (!sprint) return;

    try {
      await sprintService.updateSprint(sprint._id, {
        isCompleted: true,
      });
      setSprints?.((prevSprints) =>
        prevSprints.map((s) =>
          s._id === sprint._id ? { ...s, isCompleted: true } : s
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Failed to complete sprint'
        );
      }
    }
  }

  async function createSprintHandler() {
    try {
      const sprint = await sprintService.createSprint({
        projectId: project?._id || '',
      });

      setSprints?.((prevSprints) => [sprint, ...prevSprints]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to create sprint');
      }
    }
  }

  return (
    <div className="rounded-lg bg-white shadow-sm">
      {/* Sprint Header */}
      <div className="flex w-full items-center justify-between rounded-t-lg bg-gray-100 px-4 py-2 text-left hover:bg-gray-100">
        <div
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${open ? '' : '-rotate-90'}`}
          />
          <span className="font-semibold">{title || sprint?.key}</span>
          {sprint?.dueDate && (
            <span className="bg-primary-50 text-primary-600 rounded-full px-2 py-0.5 text-xs font-medium">
              Due {new Date(sprint.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="space-x-4">
          <span className="text-xs text-gray-400">
            {tasks.length} issue{tasks.length !== 1 && 's'}
          </span>
          {sprint && (
            <SprintMenu
              dueDateRef={dueDateRef}
              sprintStarted={!!sprintStarted}
              startSprint={startSprint}
              completeSprint={completeSprint}
            />
          )}

          {!sprint && (
            <SprintButton onClick={createSprintHandler}>
              Create Sprint
            </SprintButton>
          )}
        </div>
      </div>

      {/* Sprint Table */}
      {open && (
        <div
          className={`no-scrollbar relative mt-2 w-full overflow-x-auto rounded-md border border-gray-200`}
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

            <tbody
              ref={setNodeRef}
              className={`${isOver ? 'bg-primary-50' : ''} divide-y`}
            >
              <SortableContext
                items={localTasks.map((task) => task._id)}
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
                      members={members}
                      loadingMembers={loadingMembers}
                      onUpdated={onTaskUpdated}
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
