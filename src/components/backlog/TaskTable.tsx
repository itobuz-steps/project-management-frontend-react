import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
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
import { DatePicker, message, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { Can } from '../../utils/PermissionHoc';
import { usePermissions } from '../../hooks/usePermissions';

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
  const [editingDueDate, setEditingDueDate] = useState(false);
  const { project } = useProject();

  const { can } = usePermissions();
  const canEditDueDate = can('EDIT_SPRINT');

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Listen for global task updates (e.g., from TaskDrawer) and update localTasks
  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent;
      const updated = custom.detail as TaskPopulated;
      if (!updated) {
        return;
      }

      setLocalTasks((prev) =>
        prev.map((task) => (task._id === updated._id ? updated : task))
      );
    };

    window.addEventListener('task-updated', handler as EventListener);
    return () =>
      window.removeEventListener('task-updated', handler as EventListener);
  }, []);

  const { members, loadingMembers } = useProjectMetaData(project?._id);

  const {
    dueDateRef,
    startSprint,
    completeSprint,
    updateSprintDates,
    createSprint,
    deleteSprint,
  } = useSprintActions(project?._id, setSprints);

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

  const sprintStarted = sprint?.isStarted === true;

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
            {sprint?.dueDate &&
              (editingDueDate && canEditDueDate ? (
                <div className="relative">
                  <DatePicker
                    defaultValue={dayjs(sprint.dueDate)}
                    size="small"
                    className="rounded border text-xs"
                    autoFocus
                    onChange={(date) => {
                      if (!date || !dueDateRef.current) {
                        return;
                      }

                      dueDateRef.current.value = date.toISOString();
                    }}
                    onOpenChange={async (open) => {
                      if (!open) {
                        if (sprint.isStarted && dueDateRef.current?.value) {
                          const updatedDueDate = new Date(
                            dueDateRef.current.value
                          );
                          const currentStartDate = sprint.startDate
                            ? new Date(sprint.startDate)
                            : new Date();
                          await updateSprintDates(
                            sprint,
                            currentStartDate,
                            updatedDueDate
                          );
                        } else {
                          await startSprint(sprint);
                        }
                        setEditingDueDate(false);
                      }
                    }}
                  />

                  <input
                    ref={dueDateRef}
                    type="hidden"
                    defaultValue={dayjs(sprint.dueDate).toISOString()}
                  />
                </div>
              ) : (
                <span
                  onClick={() => canEditDueDate && setEditingDueDate(true)}
                  className={`group relative inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    canEditDueDate
                      ? 'bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer'
                      : 'cursor-default bg-gray-100 text-gray-500'
                  }`}
                >
                  Due {dayjs(sprint.dueDate).format('MMM D')}
                  {canEditDueDate && (
                    <Pencil className="absolute -right-4 h-3 w-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                  )}
                </span>
              ))}
          </div>
        </div>
        <span className="mr-1 ml-auto hidden text-xs text-gray-400 sm:mr-4 sm:block">
          {tasks.length} issue{tasks.length !== 1 && 's'}
        </span>
        <div className="xs:flex-row xs:gap-4 flex flex-col items-center gap-1">
          {sprint && (
            <SprintMenu
              sprint={sprint}
              dueDateRef={dueDateRef}
              sprintStarted={!!sprintStarted}
              canEditDates={canEditDueDate}
              startSprint={() => startSprint(sprint)}
              updateSprintDates={(startDate, endDate) =>
                updateSprintDates(sprint, startDate, endDate)
              }
              completeSprint={() => handleCompleteSprint()}
            />
          )}

          <Can permission="DELETE_SPRINT">
            {sprint && (
              <Popconfirm
                title="Delete sprint"
                description="Are you sure you want to delete this sprint?"
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{
                  style: {
                    backgroundColor: 'var(--color-primary-500)',
                    color: 'white',
                  },
                }}
                cancelButtonProps={{
                  style: {
                    border: 'var(--color-primary-500) solid 1px',
                  },
                  type: 'text',
                }}
                onConfirm={() => deleteSprint(sprint)}
              >
                <button
                  title="Delete Sprint"
                  className="flex items-center gap-1 text-red-500 hover:cursor-pointer hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </Popconfirm>
            )}
          </Can>

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
