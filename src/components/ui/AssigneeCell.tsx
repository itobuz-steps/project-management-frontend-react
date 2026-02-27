import { useState } from 'react';
import { Select, message } from 'antd';
import type { User } from '../../services/types/tasks.types';
import { UserCell } from './UserCell';
import { updateTask } from '../../services/taskService';
import type { AssigneeCellType } from './ui.types';

export function AssigneeCell({
  task,
  members,
  loading,
  onUpdated,
  loadMembers,
}: AssigneeCellType) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div
        className="flex h-7 w-[100px] cursor-pointer items-center truncate rounded-md hover:bg-gray-100 lg:w-full"
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
      className="h-7 w-[100px] truncate lg:w-full"
      size="small"
      loading={loading}
      value={task.assignee?._id ?? null}
      placeholder="Unassigned"
      allowClear
      onBlur={() => setEditing(false)}
      onChange={async (userId) => {
        const selectedUser =
          members.find((member) => member._id === userId) ?? null;

        const optimistic = {
          ...task,
          assignee: selectedUser as User,
        };

        onUpdated(optimistic);
        setEditing(false);

        try {
          await updateTask(task._id, {
            assignee: (userId as unknown as User) ?? undefined,
          });
        } catch {
          message.error('Failed to update assignee');
        }
      }}
      options={members.map((member) => ({
        value: member._id,
        label: <UserCell user={member} emptyText="Unassigned" />,
      }))}
    />
  );
}
