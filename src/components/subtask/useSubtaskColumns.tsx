import { Button, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Trash2 } from 'lucide-react';

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
      width: 55,
      render: (_, task) => (
        <div className="flex justify-center">
          <TaskTypeIcon type={task.type} />
        </div>
      ),
    },
    {
      title: 'Summary',
      ellipsis: true,
      render: (_, task) => {
        const isDone = task.status === columns[columns.length - 1];

        return (
          <div
            className="flex w-full items-center gap-2"
            onClick={() => openTask(task._id)}
          >
            <Tag color="blue">{task.key}</Tag>
            <span
              className={`block max-w-[200px] truncate hover:underline ${
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
      ellipsis: true,
      width: 140,
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
      width: 80,
      ellipsis: true,
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
      width: 100,
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
      title: 'Delete',
      width: 65,
      render: (_, task) => (
        <Button type="text" danger onClick={() => removeSubtask(task._id)}>
          <Trash2 size={14} />
        </Button>
      ),
    },
  ];
}
