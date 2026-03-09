import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskPopulated, User } from '../../services/types/tasks.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../utils/TaskTypeColor';
import { StatusSelect } from '../ui/StatusSelect';
import { AssigneeCell } from '../ui/AssigneeCell';
import { DueDateCell } from '../ui/DueDateCell';
import { updateTask } from '../../services/taskService';
import { UserWithAvatar } from './UserWithAvatar';
import type {
  InlineEditablePayload,
  TaskTableFilters,
  TaskTableSort,
} from './taskTable.types';
import {
  bodyClass,
  buildMemberFilterMap,
  formatDate,
  headerClass,
  toFilters,
  toSelectFilterOptions,
  TYPE_FILTERS,
} from './taskTable.utils';

type UseTaskTableColumnsParams = {
  tasks: TaskPopulated[];
  statuses: string[];
  members: User[];
  loadingMembers: boolean;
  filters?: TaskTableFilters;
  sorting?: TaskTableSort;
  onTaskUpdated: (updated: TaskPopulated) => void;
};

export function useTaskTableColumns({
  tasks,
  statuses,
  members,
  loadingMembers,
  filters,
  sorting,
  onTaskUpdated,
}: UseTaskTableColumnsParams) {
  const [, setSearchParams] = useSearchParams();

  const updateTaskField = useCallback(
    async (
      taskId: string,
      payload: InlineEditablePayload,
      errorText: string
    ) => {
      try {
        const updatedTask = await updateTask(
          taskId,
          payload as Partial<TaskPopulated> & { attachments?: File[] }
        );
        onTaskUpdated(updatedTask);
      } catch {
        message.error(errorText);
      }
    },
    [onTaskUpdated]
  );

  const columns: TableColumnsType<TaskPopulated> = useMemo(() => {
    const statusFilters = toFilters(statuses);
    const assignee = buildMemberFilterMap(members, 'Unassigned', 'unassigned');
    const reporter = buildMemberFilterMap(members, 'Unknown', 'unknown');
    const tagFilters = toFilters(tasks.flatMap((t) => t.tags ?? []));

    const assigneeSelectFilters = toSelectFilterOptions(
      assignee.filters,
      assignee.valueMap
    );
    const reporterSelectFilters = toSelectFilterOptions(
      reporter.filters,
      reporter.valueMap
    );

    const sortOrderFor = (field: string): 'ascend' | 'descend' | undefined =>
      sorting?.field === field && sorting.order ? sorting.order : undefined;

    const doneStatus = statuses[statuses.length - 1];

    return [
      typeColumn(sortOrderFor),
      keyColumn(sortOrderFor),
      summaryColumn(sortOrderFor, doneStatus, setSearchParams),
      statusColumn(statusFilters, sortOrderFor, statuses, updateTaskField),
      assigneeColumn(
        assigneeSelectFilters,
        members,
        loadingMembers,
        onTaskUpdated
      ),
      dueDateColumn(sortOrderFor, updateTaskField),
      tagsColumn(tagFilters),
      dateColumn('Created', 'createdAt', sortOrderFor),
      dateColumn('Updated', 'updatedAt', sortOrderFor),
      reporterColumn(reporterSelectFilters),
    ].map((col) => ({
      ...col,
      filteredValue: getFilteredValue(col.key as string, filters),
    }));
  }, [
    tasks,
    statuses,
    members,
    filters,
    sorting,
    setSearchParams,
    loadingMembers,
    onTaskUpdated,
    updateTaskField,
  ]);

  return columns;
}

// --- Individual column builders ---

type SortOrderFn = (field: string) => 'ascend' | 'descend' | undefined;

function typeColumn(
  sortOrderFor: SortOrderFn
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    filters: TYPE_FILTERS,
    filterMultiple: false,
    sorter: true,
    sortOrder: sortOrderFor('type'),
    onHeaderCell: () => ({ className: headerClass('Type') }),
    onCell: () => ({ className: bodyClass('Type') }),
    render: (_, record) => (
      <div className="flex justify-center">
        <TaskTypeIcon type={record.type} />
      </div>
    ),
  };
}

function keyColumn(
  sortOrderFor: SortOrderFn
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
    sorter: true,
    sortOrder: sortOrderFor('key'),
    onHeaderCell: () => ({ className: headerClass('Key') }),
    onCell: () => ({ className: bodyClass('Key', 'whitespace-nowrap') }),
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
  };
}

function summaryColumn(
  sortOrderFor: SortOrderFn,
  doneStatus: string,
  setSearchParams: ReturnType<typeof useSearchParams>[1]
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Summary',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    sortOrder: sortOrderFor('title'),
    onHeaderCell: () => ({ className: headerClass('Summary') }),
    onCell: (record) => ({
      className: `${bodyClass('Summary', 'cursor-pointer whitespace-nowrap hover:underline')} ${
        record.status === doneStatus ? 'text-gray-400 line-through' : ''
      }`,
      onClick: () => setSearchParams({ taskId: record._id }, { replace: true }),
    }),
  };
}

function statusColumn(
  statusFilters: { text: string; value: string }[],
  sortOrderFor: SortOrderFn,
  statuses: string[],
  updateTaskField: (
    id: string,
    payload: InlineEditablePayload,
    err: string
  ) => Promise<void>
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    filters: statusFilters,
    filterMultiple: false,
    sorter: true,
    sortOrder: sortOrderFor('status'),
    onHeaderCell: () => ({ className: headerClass('Status') }),
    onCell: () => ({ className: bodyClass('Status', 'whitespace-nowrap') }),
    render: (_, record) => (
      <StatusSelect
        value={record.status}
        columns={statuses}
        onChange={(status) =>
          updateTaskField(record._id, { status }, 'Failed to update status')
        }
      />
    ),
  };
}

function assigneeColumn(
  assigneeSelectFilters: { text: string; value: string }[],
  members: User[],
  loadingMembers: boolean,
  onTaskUpdated: (updated: TaskPopulated) => void
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Assignee',
    key: 'assignee',
    filters: assigneeSelectFilters,
    filterMultiple: false,
    onHeaderCell: () => ({ className: headerClass('Assignee') }),
    onCell: () => ({
      className: bodyClass('Assignee', 'whitespace-nowrap px-6 py-3'),
    }),
    render: (_, record) => (
      <AssigneeCell
        task={record}
        members={members}
        loading={loadingMembers}
        onUpdated={onTaskUpdated}
      />
    ),
  };
}

function dueDateColumn(
  sortOrderFor: SortOrderFn,
  updateTaskField: (
    id: string,
    payload: InlineEditablePayload,
    err: string
  ) => Promise<void>
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    sorter: true,
    sortOrder: sortOrderFor('dueDate'),
    onHeaderCell: () => ({ className: headerClass('Due Date') }),
    onCell: () => ({ className: bodyClass('Due Date', 'whitespace-nowrap') }),
    render: (_, record) => (
      <DueDateCell
        dueDate={record.dueDate}
        onChange={(dueDate) =>
          updateTaskField(record._id, { dueDate }, 'Failed to update due date')
        }
      />
    ),
  };
}

function tagsColumn(
  tagFilters: { text: string; value: string }[]
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Tags',
    dataIndex: 'labels',
    key: 'tags',
    filters: tagFilters,
    filterMultiple: true,
    onHeaderCell: () => ({ className: headerClass('Tags') }),
    onCell: () => ({ className: bodyClass('Tags', 'whitespace-nowrap') }),
    render: (_, record) => (
      <div className="flex gap-1">
        {record.tags && record.tags.length > 0 ? (
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
  };
}

function dateColumn(
  title: 'Created' | 'Updated',
  dataIndex: 'createdAt' | 'updatedAt',
  sortOrderFor: SortOrderFn
): TableColumnsType<TaskPopulated>[number] {
  return {
    title,
    dataIndex,
    key: dataIndex,
    sorter: true,
    sortOrder: sortOrderFor(dataIndex),
    onHeaderCell: () => ({ className: headerClass(title) }),
    onCell: () => ({ className: bodyClass(title, 'text-xs text-gray-500') }),
    render: (_, record) => formatDate(record[dataIndex]),
  };
}

function reporterColumn(
  reporterSelectFilters: { text: string; value: string }[]
): TableColumnsType<TaskPopulated>[number] {
  return {
    title: 'Reporter',
    key: 'reporter',
    filters: reporterSelectFilters,
    filterMultiple: false,
    onHeaderCell: () => ({ className: headerClass('Reporter') }),
    onCell: () => ({ className: bodyClass('Reporter', 'whitespace-nowrap') }),
    render: (_, record) => (
      <UserWithAvatar user={record.reporter} fallback="Unknown" />
    ),
  };
}

// --- Filter value resolution ---

function getFilteredValue(
  key: string,
  filters?: TaskTableFilters
): string[] | null {
  if (!filters) return null;
  switch (key) {
    case 'type':
      return filters.type ? [filters.type] : null;
    case 'status':
      return filters.status ? [filters.status] : null;
    case 'assignee':
      return filters.assignee ? [filters.assignee] : null;
    case 'reporter':
      return filters.reporter ? [filters.reporter] : null;
    case 'tags':
      return filters.tags && filters.tags.length > 0 ? filters.tags : null;
    default:
      return null;
  }
}
