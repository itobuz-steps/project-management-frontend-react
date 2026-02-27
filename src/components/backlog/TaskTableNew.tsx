import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ConfigProvider, message, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskPopulated, User } from '../../services/types/tasks.types';
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
  loading?: boolean;
  error?: string | null;
};

type InlineEditablePayload = Partial<Pick<TaskPopulated, 'status' | 'dueDate'>>;

const DEFAULT_STATUSES = ['todo', 'in-progress', 'done'];

const asDate = (value?: string) => new Date(value ?? 0).getTime();
const formatDate = (value?: string) =>
  value ? dayjs(value).format('DD-MM-YYYY') : '-';

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

const toFilters = (values: string[]) =>
  unique(values).map((value) => ({ text: value, value }));

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
    const typeFilters = toFilters(tasks.map((task) => task.type));
    const statusFilters = toFilters(tasks.map((task) => task.status));
    const assigneeFilters = toFilters(
      tasks.map((task) => task.assignee?.name ?? 'Unassigned')
    );
    const tagFilters = toFilters(tasks.flatMap((task) => task.tags ?? []));
    const reporterFilters = toFilters(
      tasks.map((task) => task.reporter?.name ?? 'Unknown')
    );

    return [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        filters: typeFilters,
        onFilter: (value, record) => record.type === value,
        sorter: (a, b) => a.type.localeCompare(b.type),
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
        sorter: (a, b) => (a.key ?? '').localeCompare(b.key ?? ''),
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
        sorter: (a, b) => a.title.localeCompare(b.title),
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
        onFilter: (value, record) => record.status === value,
        sorter: (a, b) => a.status.localeCompare(b.status),
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
        filters: assigneeFilters,
        onFilter: (value, record) =>
          (record.assignee?.name ?? 'Unassigned') === value,
        sorter: (a, b) =>
          (a.assignee?.name ?? '').localeCompare(b.assignee?.name ?? ''),
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
        sorter: (a, b) => asDate(a.dueDate) - asDate(b.dueDate),
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
        onFilter: (value, record) => {
          return (record.tags ?? []).includes(value as string);
        },
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
        sorter: (a, b) => asDate(a.createdAt) - asDate(b.createdAt),
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
        sorter: (a, b) => asDate(a.updatedAt) - asDate(b.updatedAt),
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
        filters: reporterFilters,
        onFilter: (value, record) =>
          (record.reporter?.name ?? 'Unknown') === value,
        sorter: (a, b) =>
          (a.reporter?.name ?? '').localeCompare(b.reporter?.name ?? ''),
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
    setSearchParams,
    members,
    loadingMembers,
    onTaskUpdated,
    updateTaskField,
  ]);

  console.log(THEME_COLORS[theme][4], oklchToHex(THEME_COLORS[theme][4]));

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
        pagination={{ placement: ['bottomCenter'], pageSize: 10 }}
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
