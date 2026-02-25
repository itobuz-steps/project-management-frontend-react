import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TaskTableProps } from './type';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { SprintMenu } from './SprintMenu';
import { TaskRow } from './TaskRow';
import { useProject } from '../../context/ProjectContext';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { useSprintActions } from '../../hooks/useSprintActions';
import { taskTableColumns } from '../../config/constants';
import { CreateSprintForm } from './CreateSprintForm';
import { message } from 'antd';

export function TaskTable({
  sprint,
  setSprints,
  tasks,
  columns,
  title,
  containerId,
  onSprintCompleted,
}: TaskTableProps) {
  const [open, setOpen] = useState(true);
  const [localTasks, setLocalTasks] = useState(tasks);
  const { project } = useProject();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const { members, loadingMembers } = useProjectMetaData(project?._id);

  const { dueDateRef, startSprint, completeSprint, createSprint } =
    useSprintActions(project?._id, setSprints);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: { containerId },
  });

  const handleTaskUpdated = (updated: TaskPopulated) => {
    setLocalTasks((prev) =>
      prev.map((task) => (task._id === updated._id ? updated : task))
    );
  };

  const handleCompleteSprint = async () => {
    if (!sprint) {
      message.error('No sprint to complete');
      return;
    }
    try {
      await completeSprint(sprint);
      onSprintCompleted?.(sprint._id);
      message.success('Sprint completed successfully');
    } catch (error) {
      console.error('Error completing sprint:', error);
      message.error('Failed to complete sprint');
    }
  };

  const sprintStarted = Boolean(sprint?.dueDate);

  return (
    <div className="rounded-lg bg-white shadow-sm">
      {/* Sprint Header */}
      <div className="flex w-full items-center justify-between rounded-t-lg bg-gray-100 px-1 py-2 text-left hover:bg-gray-100 sm:px-4">
        <div
          onClick={() => setOpen(!open)}
          className="xs:gap-2 flex cursor-pointer items-center gap-1"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${open ? '' : '-rotate-90'}`}
          />
          <div className="xs:flex-row xs:items-center xs:gap-2 flex flex-col items-start gap-1">
            <span className="font-semibold">{title || sprint?.key}</span>
            {sprint?.dueDate && (
              <span className="bg-primary-50 text-primary-600 rounded-full py-0.5 text-xs font-medium">
                Due {new Date(sprint.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <span className="xs:mr-4 xs:block mr-1 ml-auto hidden text-xs text-gray-400">
          {tasks.length} issue{tasks.length !== 1 && 's'}
        </span>
        <div className="xs:flex-row xs:gap-4 flex flex-col items-center gap-1">
          {sprint && (
            <SprintMenu
              dueDateRef={dueDateRef}
              sprintStarted={!!sprintStarted}
              startSprint={() => startSprint(sprint)}
              completeSprint={() => handleCompleteSprint()}
            />
          )}

          {!sprint && project?.projectType == 'scrum' && (
            <CreateSprintForm createSprintHandler={createSprint} />
          )}
        </div>
      </div>

      {/* Table */}
      {open && (
        <div className="relative mt-2 overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full table-fixed text-left text-sm">
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
