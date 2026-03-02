import { Table, Tag } from 'antd';
import type { TaskPopulated } from '../../../services/types/tasks.types';

interface RemovedTasksTableProps {
  tasks: TaskPopulated[];
}

const TYPE_COLOR_MAP: Record<string, string> = {
  bug: 'red',
  story: 'green',
  task: 'blue',
};

const PRIORITY_COLOR_MAP: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const columns = [
  {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
    render: (key: string) => <Tag>{key}</Tag>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => (
      <Tag color={TYPE_COLOR_MAP[type] ?? 'default'}>{type}</Tag>
    ),
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority: string) => (
      <Tag color={PRIORITY_COLOR_MAP[priority] ?? 'default'}>{priority}</Tag>
    ),
  },
  {
    title: 'Story Points',
    dataIndex: 'storyPoint',
    key: 'storyPoint',
    render: (sp: number | undefined) => sp ?? '—',
  },
];

export function RemovedTasksTable({ tasks }: RemovedTasksTableProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border-2 border-gray-200 p-4">
      <h4 className="text-primary-500 mb-3 font-semibold">
        Tasks Removed During Sprint ({tasks.length})
      </h4>
      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="_id"
        pagination={false}
        size="small"
      />
    </div>
  );
}
