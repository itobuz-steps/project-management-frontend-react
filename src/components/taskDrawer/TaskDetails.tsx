import { useState } from 'react';
import type { Task } from '../../types/tasks.types';
import { Button, Descriptions, Tag } from 'antd';
import { EditTaskModal } from '../../utils/EditTaskModal';
import { UserCell } from '../../utils/UserCell';
import { EditOutlined } from '@ant-design/icons';

export function TaskDetails({
  task,
  onUpdated,
  isMobile,
}: {
  task: Task;
  onUpdated: (t: Task) => void;
  isMobile: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Task Details</h3>
        <Button
          icon={<EditOutlined />}
          block={isMobile}
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
      </div>

      <Descriptions bordered size="small" column={isMobile ? 1 : 2}>
        <Descriptions.Item label="Status">
          <Tag>{task.status}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Priority">
          <Tag color={task.priority === 'high' ? 'red' : 'gold'}>
            {task.priority}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Type">
          <Tag color="geekblue">{task.type}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Story Points">
          {task.storyPoint ?? '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Tags" span={isMobile ? 1 : 2}>
          {task.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No tags</span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Due Date">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
        </Descriptions.Item>

        <Descriptions.Item label="Assignee">
          <UserCell user={task.assignee} emptyText="Unassigned" />
        </Descriptions.Item>

        <Descriptions.Item label="Reporter">
          <UserCell user={task.reporter} emptyText="—" />
        </Descriptions.Item>
      </Descriptions>

      <div className="mt-4">
        <h3 className="mb-2 font-semibold">Description</h3>
        <div className="rounded-md border p-3 text-sm">
          {task.description || 'No description added.'}
        </div>
      </div>

      <EditTaskModal
        open={editOpen}
        task={task}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />
    </>
  );
}
