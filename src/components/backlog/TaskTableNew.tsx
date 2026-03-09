import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ConfigProvider, message, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import type {
  PaginationMeta,
  TaskPopulated,
  User,
} from '../../services/types/tasks.types';
import { taskTableColumns, THEME_COLORS } from '../../config/constants';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import dayjs from 'dayjs';
import { config } from '../../config/config';
import { TaskTypeColor } from '../../utils/TaskTypeColor';
import { StatusSelect } from '../ui/StatusSelect';
import { AssigneeCell } from '../ui/AssigneeCell';
import { DueDateCell } from '../ui/DueDateCell';
import { updateTask } from '../../services/taskService';
import { getPriorityBorder } from '../../utils/utils';
import { useTheme } from '../../hooks/useTheme';
import { oklchToHex } from '../../utils/oklchToHex';

type TaskTableProps = {
  tasks: TaskPopulated[];
  statusColumns: string[];
  members: User[];
  loadingMembers: boolean;
  onTaskUpdated: (updated: TaskPopulated) => void;
  pagination?: PaginationMeta;
  filters?: TaskTableFilters;
  sorting?: TaskTableSort;
  onTableChange?: (params: TaskTableChangeParams) => void;
  loading?: boolean;
  error?: string | null;
};

export type TaskTableFilters = {
  type?: string | null;
  status?: string | null;
  assignee?: string | null;
  reporter?: string | null;
  tags?: string[];
};

export type TaskTableSortOrder = 'ascend' | 'descend' | null;

export type TaskTableSort = {
  field?: string | null;
  order?: TaskTableSortOrder;
};

export type TaskTableChangeParams = {
  page: number;
  pageSize: number;
  filters: TaskTableFilters;
  sorting: TaskTableSort;
};

type InlineEditablePayload = Partial<Pick<TaskPopulated, 'status' | 'dueDate'>>;

const DEFAULT_STATUSES = ['todo', 'in-progress', 'done'];

const formatDate = (value?: string) =>
  value ? dayjs(value).format('DD-MM-YYYY') : '-';

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

const toFilters = (values: string[]) =>
  unique(values).map((value) => ({ text: value, value }));

const asSingleFilter = (value?: FilterValue | null): string | null => {
  if (!Array.isArray(value) || !value.length || value[0] == null) {
    return null;
  }

  return String(value[0]);
};

const asMultiFilter = (value?: FilterValue | null): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item)).filter(Boolean);
};

const typeFilters = toFilters(['bug', 'story', 'task']);

const buildColumnClassMap = () => {
  const classMap: Record<string, string> = {};
  taskTableColumns.forEach(({ label, className }) => {
    classMap[label] = className;
  });
  return classMap;
};

const columnClassMap = buildColumnClassMap();

const getColumnClassName = (label: string) => {
  if (columnClassMap[label]) {
    return columnClassMap[label];
  }

  return '';
};

const headerClass = (label: string) =>
  `bg-gray-100 text-xs font-semibold text-gray-600 uppercase ${getColumnClassName(label)}`;

const bodyClass = (label: string, extra = '') =>
  `${getColumnClassName(label)}${extra ? ` ${extra}` : ''}`;

function UserWithAvatar({ user, fallback }: { user?: User; fallback: string }) {
  return (
    <div className="flex items-center pr-2">
      <img
        className="mr-3 h-6 w-6 rounded-full object-cover"
        src={
          user?.profileImage
            ? `${config.api_base_url}/uploads/${user.profileImage}`
            : '/profile.png'
        }
      />
      {user?.name ?? fallback}
    </div>
  );
}

export function TaskTable({
  tasks,
  statusColumns,
  members,
  loadingMembers,
  onTaskUpdated,
  pagination,
  filters,
  sorting,
  onTableChange,
  loading = false,
  error = null,
}: TaskTableProps) {
  const [, setSearchParams] = useSearchParams();
  const statuses = useMemo(
    () => (statusColumns.length > 0 ? statusColumns : DEFAULT_STATUSES),
    [statusColumns]
  );
  const [theme] = useTheme();

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
    const assigneeFilters = toFilters([
      ...members.map((member) => member.name),
      'Unassigned',
    ]);
    const assigneeFilterValueMap: Record<string, string> = {
      Unassigned: 'unassigned',
    };
    members.forEach((member) => {
      assigneeFilterValueMap[member.name] = member._id;
    });

    const reporterFilters = toFilters([
      ...members.map((member) => member.name),
      'Unknown',
    ]);
    const reporterFilterValueMap: Record<string, string> = {
      Unknown: 'unknown',
    };
    members.forEach((member) => {
      reporterFilterValueMap[member.name] = member._id;
    });

    const tagFilters = toFilters(tasks.flatMap((task) => task.tags ?? []));

    const sortOrderFor = (field: string): 'ascend' | 'descend' | undefined => {
      if (sorting?.field !== field || !sorting.order) {
        return undefined;
      }

      return sorting.order;
    };

    const toSelectFilterOptions = (
      options: { text: string; value: string }[],
      valueMap: Record<string, string>
    ) =>
      options.map((option) => ({
        text: option.text,
        value: valueMap[option.value] ?? option.value,
      }));

    const assigneeSelectFilters = toSelectFilterOptions(
      assigneeFilters,
      assigneeFilterValueMap
    );
    const reporterSelectFilters = toSelectFilterOptions(
      reporterFilters,
      reporterFilterValueMap
    );

    return [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        filters: typeFilters,
        filteredValue: filters?.type ? [filters.type] : null,
        filterMultiple: false,
        sorter: true,
        sortOrder: sortOrderFor('type'),
        onHeaderCell: () => ({
          className: headerClass('Type'),
        }),
        onCell: () => ({ className: bodyClass('Type') }),
        render: (_, record) => (
          <div className="flex justify-center">
            <TaskTypeIcon type={record.type} />
          </div>
        ),
      },
      {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
        sorter: true,
        sortOrder: sortOrderFor('key'),
        onHeaderCell: () => ({
          className: headerClass('Key'),
        }),
        onCell: () => ({ className: bodyClass('Key', 'whitespace-nowrap') }),
        render: (_, record) => (
          <Link
            to={`/task/${record._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 font-medium whitespace-nowrap text-white hover:underline"
          >
            <TaskTypeColor type={record.type}>
              {record.key || '-'}
            </TaskTypeColor>
          </Link>
        ),
      },
      {
        title: 'Summary',
        dataIndex: 'title',
        key: 'title',
        sorter: true,
        sortOrder: sortOrderFor('title'),
        onHeaderCell: () => ({
          className: headerClass('Summary'),
        }),
        onCell: (record) => ({
          className: `${bodyClass('Summary', 'cursor-pointer whitespace-nowrap hover:underline')} ${
            record.status === statuses[statuses.length - 1]
              ? 'text-gray-400 line-through'
              : ''
          }`,
          onClick: () =>
            setSearchParams({ taskId: record._id }, { replace: true }),
        }),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: statusFilters,
        filteredValue: filters?.status ? [filters.status] : null,
        filterMultiple: false,
        sorter: true,
        sortOrder: sortOrderFor('status'),
        onHeaderCell: () => ({
          className: headerClass('Status'),
        }),
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
      },
      {
        title: 'Assignee',
        key: 'assignee',
        filters: assigneeSelectFilters,
        filteredValue: filters?.assignee ? [filters.assignee] : null,
        filterMultiple: false,
        onHeaderCell: () => ({
          className: headerClass('Assignee'),
        }),
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
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        sorter: true,
        sortOrder: sortOrderFor('dueDate'),
        onHeaderCell: () => ({
          className: headerClass('Due Date'),
        }),
        onCell: () => ({
          className: bodyClass('Due Date', 'whitespace-nowrap'),
        }),
        render: (_, record) => (
          <DueDateCell
            dueDate={record.dueDate}
            onChange={(dueDate) =>
              updateTaskField(
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
        dataIndex: 'labels',
        key: 'tags',
        filters: tagFilters,
        filteredValue:
          filters?.tags && filters.tags.length > 0 ? filters.tags : null,
        filterMultiple: true,
        onHeaderCell: () => ({
          className: headerClass('Tags'),
        }),
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
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: true,
        sortOrder: sortOrderFor('createdAt'),
        onHeaderCell: () => ({
          className: headerClass('Created'),
        }),
        onCell: () => ({
          className: bodyClass('Created', 'text-xs text-gray-500'),
        }),
        render: (_, record) => formatDate(record.createdAt),
      },
      {
        title: 'Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: true,
        sortOrder: sortOrderFor('updatedAt'),
        onHeaderCell: () => ({
          className: headerClass('Updated'),
        }),
        onCell: () => ({
          className: bodyClass('Updated', 'text-xs text-gray-500'),
        }),
        render: (_, record) => formatDate(record.updatedAt),
      },
      {
        title: 'Reporter',
        key: 'reporter',
        filters: reporterSelectFilters,
        filteredValue: filters?.reporter ? [filters.reporter] : null,
        filterMultiple: false,
        onHeaderCell: () => ({
          className: headerClass('Reporter'),
        }),
        onCell: () => ({
          className: bodyClass('Reporter', 'whitespace-nowrap'),
        }),
        render: (_, record) => (
          <UserWithAvatar user={record.reporter} fallback="Unknown" />
        ),
      },
    ];
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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme
            ? oklchToHex(THEME_COLORS[theme][4])
            : oklchToHex(THEME_COLORS['indigo'][4]),
        },
      }}
    >
      <Table<TaskPopulated>
        rowKey="_id"
        className="list-view-task-table"
        columns={columns}
        dataSource={tasks}
        loading={loading}
        showSorterTooltip={{ target: 'sorter-icon' }}
        size="small"
        onChange={(nextPagination, nextFilters, nextSorter) => {
          const sorter = Array.isArray(nextSorter)
            ? nextSorter[0]
            : (nextSorter as SorterResult<TaskPopulated>);

          onTableChange?.({
            page: nextPagination.current ?? 1,
            pageSize: nextPagination.pageSize ?? pagination?.limit ?? 10,
            filters: {
              type: asSingleFilter(nextFilters.type),
              status: asSingleFilter(nextFilters.status),
              assignee: asSingleFilter(nextFilters.assignee),
              reporter: asSingleFilter(nextFilters.reporter),
              tags: asMultiFilter(nextFilters.tags),
            },
            sorting: {
              field:
                typeof sorter?.field === 'string'
                  ? sorter.field
                  : (sorter?.columnKey as string | null),
              order: sorter?.order ?? null,
            },
          });
        }}
        pagination={{
          placement: ['bottomCenter'],
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        rowClassName={(record) =>
          `whitespace-nowrap text-sm hover:bg-gray-50 ${getPriorityBorder(record.priority)}`
        }
        locale={{
          emptyText: error ?? 'No tasks available',
        }}
      />
    </ConfigProvider>
  );
}

export default TaskTable;
