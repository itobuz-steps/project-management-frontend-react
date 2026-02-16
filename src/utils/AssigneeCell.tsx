import { useState } from 'react';
import { Select, message } from 'antd';
import type { TaskPopulated, User } from '../services/types/tasks.types';
import { UserCell } from './UserCell';
import { updateTask } from '../services/taskService';

type Props = {
  task: TaskPopulated;
  members: User[];
  loading: boolean;
  onUpdated: (t: TaskPopulated) => void;
  loadMembers?: () => void;
};

export function AssigneeCell({
  task,
  members,
  loading,
  onUpdated,
  loadMembers,
}: Props) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div
        className="cursor-pointer rounded-md hover:bg-gray-100"
        onClick={() => {
          setEditing(true);
          loadMembers?.();
        }}
      >
        <UserCell user={task.assignee} emptyText="Unassigned" />
      </div>
    );
  }

  return (
    <Select
      autoFocus
      className="w-full"
      loading={loading}
      value={task.assignee?._id ?? null}
      placeholder="Unassigned"
      allowClear
      onBlur={() => setEditing(false)}
      onChange={async (userId) => {
        const selectedUser = members.find((m) => m._id === userId) ?? null;

        const optimistic: TaskPopulated = {
          ...task,
          assignee: selectedUser as unknown as User,
        };

        onUpdated(optimistic);
        setEditing(false);

        try {
          await updateTask(task._id, {
            assignee: userId as unknown as User ?? undefined,
          });
        } catch {
          message.error('Failed to update assignee');
          onUpdated(task); // rollback
        }
      }}
      options={members.map((member) => ({
        value: member._id,
        label: <UserCell user={member} emptyText="—" />,
      }))}
    />
  );
}
