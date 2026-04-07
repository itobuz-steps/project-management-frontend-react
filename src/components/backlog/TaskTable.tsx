import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TableColumnsType } from 'antd';
import { message, Table } from 'antd';
import dayjs from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { useSprintActions } from '../../hooks/useSprintActions';
import { updateTask } from '../../services/taskService';
import type { TaskPopulated, User } from '../../services/types/tasks.types';
import { TaskTypeColor } from '../../utils/TaskTypeColor';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { getPriorityBorder } from '../../utils/utils';
import { AssigneeCell } from '../ui/AssigneeCell';
import { DueDateCell } from '../ui/DueDateCell';
import { StatusSelect } from '../ui/StatusSelect';
import { UserCell } from '../ui/UserCell';
import { CreateSprintForm } from './CreateSprintForm';
import { SprintMenu } from './SprintMenu';
import type { TaskTableProps } from './type';

const normalize = (value?: string | null) => (value ?? '').toLowerCase().trim();

const compareText = (a?: string | null, b?: string | null) =>
  normalize(a).localeCompare(normalize(b));

const compareDate = (a?: string | null, b?: string | null) => {
  const first = a ? dayjs(a).valueOf() : 0;
  const second = b ? dayjs(b).valueOf() : 0;
  return first - second;
};

const uniqueFilters = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).map((value) => ({
    text: value,
    value,
  }));

type SelectFilterOption = {
  text: string;
  value: string;
};

const buildMemberFilters = (
  members: User[],
  fallbackLabel: string,
  fallbackValue: string
): SelectFilterOption[] => {
  const names = members
    .filter((member) => member != null)
    .map((member) => member.name);

  return uniqueFilters([...names, fallbackLabel]).map((option) => ({
    ...option,
    value:
      option.value === fallbackLabel
        ? fallbackValue
        : (members.find((member) => member.name === option.value)?._id ??
          option.value),
  }));
};

type BuildTaskColumnsParams = {
  columns: string[];
  localTasks: TaskPopulated[];
  assigneeFilters: SelectFilterOption[];
  reporterFilters: SelectFilterOption[];
  members: User[];
  loadingMembers: boolean;
  canChangeReporter: boolean;
  handleTaskUpdated: (updated: TaskPopulated) => void;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
  updateTaskField: (
    taskId: string,
    payload: Partial<TaskPopulated>,
    errorMsg?: string
  ) => Promise<void>;
};

const buildTaskColumns = ({
  columns,
  localTasks,
  assigneeFilters,
  reporterFilters,
  members,
  loadingMembers,
  canChangeReporter,
  handleTaskUpdated,
  setSearchParams,
  updateTaskField,
}: BuildTaskColumnsParams): TableColumnsType<TaskPopulated> => {
  const doneStatus = columns[columns.length - 1];

  return [
    {
      title: 'Type',
      key: 'type',
      dataIndex: 'type',
      width: 72,
      filters: uniqueFilters(['bug', 'story', 'task']),
      filterSearch: true,
      onFilter: (value, record) =>
        normalize(record.type) === normalize(String(value)),
      sorter: (a, b) => compareText(a.type, b.type),
      render: (_, record) => (
        <div className="flex justify-center">
          <TaskTypeIcon type={record.type} />
        </div>
      ),
    },
    {
      title: 'Key',
      key: 'key',
      dataIndex: 'key',
      sorter: (a, b) => compareText(a.key, b.key),
      render: (_, record) => (
        <Link
          to={`/task/${record._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2 font-medium whitespace-nowrap text-white hover:underline"
        >
          <TaskTypeColor type={record.type}>{record.key || '-'}</TaskTypeColor>
        </Link>
      ),
    },
    {
      title: 'Summary',
      key: 'title',
      dataIndex: 'title',
      sorter: (a, b) => compareText(a.title, b.title),
      render: (_, record) => (
        <button
          type="button"
          className={`cursor-pointer p-0 text-left whitespace-nowrap hover:underline ${
            record.status === doneStatus ? 'text-gray-400 line-through' : ''
          }`}
          onClick={() =>
            setSearchParams({ taskId: record._id }, { replace: true })
          }
        >
          {record.title}
        </button>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      filters: uniqueFilters(columns),
      filterSearch: true,
      onFilter: (value, record) =>
        normalize(record.status) === normalize(String(value)),
      sorter: (a, b) => compareText(a.status, b.status),
      render: (_, record) => (
        <StatusSelect
          value={record.status}
          columns={columns}
          onChange={(status) =>
            void updateTaskField(
              record._id,
              { status },
              'Failed to update status'
            )
          }
        />
      ),
    },
    {
      title: 'Assignee',
      key: 'assignee',
      filters: assigneeFilters,
      filterSearch: true,
      onFilter: (value, record) => {
        const selected = String(value);
        if (selected === 'unassigned') {
          return !record.assignee?._id;
        }
        return record.assignee?._id === selected;
      },
      render: (_, record) => (
        <div className="w-37.5 max-w-37.5 truncate">
          <AssigneeCell
            task={record}
            members={members}
            loading={loadingMembers}
            onUpdated={handleTaskUpdated}
          />
        </div>
      ),
    },
    {
      title: 'Due Date',
      key: 'dueDate',
      dataIndex: 'dueDate',
      sorter: (a, b) => compareDate(a.dueDate, b.dueDate),
      render: (_, record) => (
        <DueDateCell
          dueDate={record.dueDate}
          onChange={(dueDate) =>
            void updateTaskField(
              record._id,
              { dueDate },
              'Failed to update due date'
            )
          }
        />
      ),
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      filters: uniqueFilters(localTasks.flatMap((task) => task.tags ?? [])),
      filterSearch: true,
      onFilter: (value, record) => (record.tags ?? []).includes(String(value)),
      render: (_, record) => (
        <div className="flex gap-1">
          {record.tags && record.tags.length ? (
            <>
              {record.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-100 text-primary-700 rounded px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
              {record.tags.length > 3 && (
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">
                  +{record.tags.length - 3}
                </span>
              )}
            </>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      title: 'Created',
      key: 'createdAt',
      dataIndex: 'createdAt',
      sorter: (a, b) => compareDate(a.createdAt, b.createdAt),
      render: (value: string | undefined) =>
        value ? dayjs(value).format('DD-MM-YYYY') : '-',
    },
    {
      title: 'Updated',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      sorter: (a, b) => compareDate(a.updatedAt, b.updatedAt),
      render: (value: string | undefined) =>
        value ? dayjs(value).format('DD-MM-YYYY') : '-',
    },
    {
      title: 'Reporter',
      key: 'reporter',
      filters: reporterFilters,
      filterSearch: true,
      onFilter: (value, record) => {
        const selected = String(value);
        if (selected === 'unknown') {
          return !record.reporter?._id;
        }
        return record.reporter?._id === selected;
      },
      render: (_, record) => (
        <div className="w-37.5 max-w-37.5 truncate">
          {canChangeReporter ? (
            <AssigneeCell
              task={record}
              members={members}
              loading={loadingMembers}
              onUpdated={handleTaskUpdated}
              field="reporter"
            />
          ) : (
            <UserCell user={record.reporter} emptyText="Unknown" />
          )}
        </div>
      ),
    },
  ];
};

type DraggableTableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  'data-row-key'?: string;
  'data-container-id'?: string;
};

function DraggableBodyRow(props: DraggableTableRowProps) {
  const rowKey = props['data-row-key'];
  const fallbackRowId = useId();
  const sortableId = rowKey || `row-${fallbackRowId}`;

  const {
    attributes,
    listeners,
    setNodeRef: setRowNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortableId,
    data: { type: 'task', containerId: props['data-container-id'] },
    disabled: !rowKey,
  });

  const dragStyle = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none' as const,
  };

  return (
    <tr
      {...props}
      ref={setRowNodeRef}
      className={`${props.className ?? ''} ${isDragging ? 'opacity-50' : ''}`.trim()}
      style={dragStyle}
      {...(rowKey ? attributes : {})}
      {...(rowKey ? listeners : {})}
    />
  );
}

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
  const [, setSearchParams] = useSearchParams();

  const { can } = usePermissions();
  const canEditDueDate = can('EDIT_SPRINT');
  const canChangeReporter = can('REPORTER_CHANGE');

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
  } = useSprintActions(project?._id, setSprints);

  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: { containerId },
  });

  const handleTaskUpdated = useCallback((updated: TaskPopulated) => {
    setLocalTasks((prev) =>
      prev.map((task) => (task._id === updated._id ? updated : task))
    );
  }, []);

  const updateTaskField = useCallback(
    async (
      taskId: string,
      payload: Partial<TaskPopulated>,
      errorMsg = 'Failed to update task'
    ) => {
      try {
        const updatedTask = await updateTask(
          taskId,
          payload as Partial<TaskPopulated> & { attachments?: File[] }
        );
        handleTaskUpdated(updatedTask);
        const event = new CustomEvent('task-updated', { detail: updatedTask });
        window.dispatchEvent(event);
        message.success('Task Updated');
      } catch {
        message.error(errorMsg);
      }
    },
    [handleTaskUpdated]
  );

  const assigneeFilters = useMemo(() => {
    return buildMemberFilters(members, 'Unassigned', 'unassigned');
  }, [members]);

  const reporterFilters = useMemo(() => {
    return buildMemberFilters(members, 'Unknown', 'unknown');
  }, [members]);

  const tableColumns: TableColumnsType<TaskPopulated> = useMemo(() => {
    return buildTaskColumns({
      columns,
      localTasks,
      assigneeFilters,
      reporterFilters,
      members,
      loadingMembers,
      canChangeReporter,
      handleTaskUpdated,
      setSearchParams,
      updateTaskField,
    });
  }, [
    assigneeFilters,
    canChangeReporter,
    columns,
    handleTaskUpdated,
    loadingMembers,
    localTasks,
    members,
    reporterFilters,
    setSearchParams,
    updateTaskField,
  ]);

  const TableRowWithContainer = useMemo(
    () =>
      function TableRowWithContainer(
        props: React.HTMLAttributes<HTMLTableRowElement> & {
          'data-row-key'?: string;
        }
      ) {
        return <DraggableBodyRow {...props} data-container-id={containerId} />;
      },
    [containerId]
  );

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
    <div className="rounded-lg bg-white shadow-sm dark:bg-slate-900">
      {/* Sprint Header */}
      <div className="flex w-full items-center justify-between rounded-t-lg bg-gray-100 px-1 py-2 text-left hover:bg-gray-100 sm:px-4 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800">
        <div
          onClick={() => setOpen(!open)}
          className="xs:gap-2 flex cursor-pointer items-center gap-1"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${open ? '' : '-rotate-90'}`}
          />
          <div className="xs:flex-row xs:items-center xs:gap-2 flex flex-col items-start gap-1">
            <span className="font-semibold">{title || sprint?.key}</span>
          </div>
        </div>
        <span className="mr-1 ml-auto hidden text-xs text-gray-400 sm:mr-4 sm:block dark:text-slate-400">
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

          {!sprint && project?.projectType == 'scrum' && (
            <CreateSprintForm createSprintHandler={createSprint} />
          )}
        </div>
      </div>

      {/* Table */}
      {open && (
        <div
          ref={setNodeRef}
          className={`relative mt-2 overflow-x-auto rounded-md border border-gray-200 dark:border-slate-700 ${isOver ? 'bg-primary-50 dark:bg-slate-800' : ''}`}
        >
          <SortableContext
            items={localTasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            <Table<TaskPopulated>
              rowKey="_id"
              size="small"
              scroll={{ x: 1200 }}
              className="backlog-task-antd-table"
              columns={tableColumns}
              dataSource={localTasks}
              components={{
                body: {
                  row: TableRowWithContainer,
                },
              }}
              pagination={false}
              rowClassName={(record) =>
                `whitespace-nowrap text-sm hover:bg-gray-50 dark:hover:bg-slate-800 ${getPriorityBorder(record.priority)}`
              }
              locale={{
                emptyText: 'Drop tasks here...',
              }}
            />
          </SortableContext>
        </div>
      )}
    </div>
  );
}
