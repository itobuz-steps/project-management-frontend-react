import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TaskTableProps } from './type';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { SprintMenu } from './SprintMenu';
import { TaskRow } from './TaskRow';
import { SprintButton } from './SprintButton';
import { useProject } from '../../context/ProjectContext';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { useSprintActions } from '../../hooks/useSprintActions';
import { taskTableColumns } from '../../config/constants';

export function TaskTable({
  sprint,
  setSprints,
  tasks,
  columns,
  title,
  containerId,
}: TaskTableProps) {
  const [open, setOpen] = useState(true);
  const [localTasks, setLocalTasks] = useState(tasks);
  const { project } = useProject();

  const { members, loadingMembers } = useProjectMetaData(project?._id);

  const { dueDateRef, startSprint, completeSprint, createSprint } =
    useSprintActions(project?._id, setSprints);

  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: { containerId },
  });

  const handleTaskUpdated = (updated: TaskPopulated) => {
    setLocalTasks((prev) =>
      prev.map((task) => (task._id === updated._id ? updated : task))
    );
  };

  const sprintStarted = Boolean(sprint?.dueDate);

  return (
    <div className="rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg bg-gray-100 px-4 py-2">
        <div
          onClick={() => setOpen((dropdown) => !dropdown)}
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

          {sprint ? (
            <SprintMenu
              dueDateRef={dueDateRef}
              sprintStarted={sprintStarted}
              startSprint={() => startSprint(sprint)}
              completeSprint={() => completeSprint(sprint)}
            />
          ) : (
            <SprintButton onClick={createSprint}>Create Sprint</SprintButton>
          )}
        </div>
      </div>

      {/* Table */}
      {open && (
        <div className="relative mt-2 overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="sticky top-0 z-10 border-b bg-gray-100 text-xs text-gray-600 uppercase">
              <tr>
                {taskTableColumns.map(({ label, className }) => (
                  <th key={label} className={className}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody
              ref={setNodeRef}
              className={`divide-y ${isOver ? 'bg-primary-50' : ''}`}
            >
              <SortableContext
                items={localTasks.map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                {localTasks.length === 0 ? (
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
                      members={members}
                      loadingMembers={loadingMembers}
                      onUpdated={handleTaskUpdated}
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
