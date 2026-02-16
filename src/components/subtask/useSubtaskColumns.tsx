import { Button, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Trash2 } from 'lucide-react';

import type { TaskPopulated } from '../../services/types/tasks.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { StatusSelect } from '../../utils/StatusSelect';
import { PRIORITY_COLORS } from '../taskDrawer/constants';
import type { Args } from './subtask.types';
import { AssigneeCell } from '../../utils/AssigneeCell';

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
      width: 50,
      render: (_, task) => <TaskTypeIcon type={task.type} />,
    },
    {
      title: 'Summary',
      render: (_, task) => (
        <div onClick={() => openTask(task._id)}>
          <Tag color="blue">{task.key}</Tag>{' '}
          <span className="cursor-pointer hover:underline">{task.title}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      width: 70,
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
      width: 70,
      render: (_, task) => (
        <Tag
          className="m-0 capitalize"
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
      width: 20,
      render: (_, task) => (
        <Button type="text" danger onClick={() => removeSubtask(task._id)}>
          <Trash2 size={14} />
        </Button>
      ),
    },
  ];
}
