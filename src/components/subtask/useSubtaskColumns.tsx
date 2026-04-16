import { Button, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { StatusSelect } from '../ui/StatusSelect';
import { PRIORITY_COLORS } from '../taskModal/constants';
import type { Args } from './subtask.types';
import { AssigneeCell } from '../ui/AssigneeCell';

export function useSubtaskColumns({
  columns,
  openTask,
  updateStatus,
  removeSubtask,
  members,
  loadingMembers,
  onUpdated,
}: Args): ColumnsType<TaskPopulated> {
  return [
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
      ellipsis: true,
      filters: [
        { text: 'Task', value: 'task' },
        { text: 'Bug', value: 'bug' },
        { text: 'Story', value: 'story' },
      ],
      onFilter: (value, record) => record.type === value,
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (_, task) => (
        <div
          className="flex cursor-pointer justify-center gap-1"
          onClick={() => openTask(task._id)}
        >
          <TaskTypeIcon type={task.type} />
          <Tag color="blue">{task.key}</Tag>
        </div>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'title',
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (_, task) => {
        const isDone = task.status === columns[columns.length - 1];

        return (
          <div className="flex w-full cursor-pointer items-center gap-2">
            <span
              className={`block max-w-50 truncate hover:underline ${
                isDone ? 'text-gray-400 line-through' : ''
              }`}
            >
              {task.title}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 110,
      filters: columns.map((col) => ({
        text: col,
        value: col,
      })),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => columns.indexOf(a.status) - columns.indexOf(b.status),
      render: (_, task) => (
        <StatusSelect
          value={task.status}
          columns={columns}
          onChange={(newStatus) =>
            updateStatus(task._id, newStatus).catch(() =>
              message.error('Failed to update status')
            )
          }
        />
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 120,
      ellipsis: true,
      filters: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
        { text: 'Critical', value: 'critical' },
      ],
      onFilter: (value, record) => record.priority === value,
      sorter: (a, b) => {
        const order = { low: 1, medium: 2, high: 3 };
        return (
          (order[a.priority as keyof typeof order] || 0) -
          (order[b.priority as keyof typeof order] || 0)
        );
      },
      render: (_, task) => (
        <Tag
          className="m-0 items-center rounded-2xl capitalize"
          color={
            PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] ??
            'green'
          }
        >
          {task.priority}
        </Tag>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: ['assignee', '_id'],
      width: 120,
      filters: members.map((member) => ({
        text: member.name,
        value: member._id,
      })),
      onFilter: (value, record) => record.assignee?._id === value,
      sorter: (a, b) =>
        (a.assignee?.name || '').localeCompare(b.assignee?.name || ''),
      render: (_, task) => (
        <AssigneeCell
          task={task}
          members={members}
          loading={loadingMembers}
          onUpdated={onUpdated}
        />
      ),
    },
    {
      title: 'Action',
      width: 65,
      render: (_, task) => (
        <Button type="text" danger onClick={() => removeSubtask(task._id)}>
          <DeleteOutlined size={14} />
        </Button>
      ),
    },
  ];
}
