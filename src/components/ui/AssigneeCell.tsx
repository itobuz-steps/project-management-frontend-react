import { useState } from 'react';
import { Select, message } from 'antd';
import type { User } from '../../services/types/tasks.types';
import { UserCell } from './UserCell';
import { updateTask } from '../../services/taskService';
import type { AssigneeCellType } from './ui.types';
import { useAuthContext } from '../../context/AuthContext';

export function AssigneeCell({
  task,
  members,
  loading,
  onUpdated,
  loadMembers,
  field = 'assignee',
}: AssigneeCellType) {
  const [editing, setEditing] = useState(false);
  const { userId } = useAuthContext();

  const currentUser = task[field] as User | undefined;

  if (!editing) {
    return (
      <div className="flex h-7 w-[100px] items-center gap-1 truncate rounded-md px-1 hover:bg-gray-100 lg:w-full">
        <div
          className="cursor-pointer truncate"
          onClick={() => {
            setEditing(true);
            loadMembers?.();
          }}
        >
          <UserCell user={currentUser} emptyText="Unassigned" />
        </div>

        {!currentUser && userId && (
          <>
            <span className="text-gray-300">·</span>

            <button
              className="text-primary-600 text-xs hover:underline"
              onClick={async (e) => {
                e.stopPropagation();

                const selectedUser =
                  members.find((member) => member._id === userId) ?? null;

                const optimistic = {
                  ...task,
                  [field]: selectedUser as User,
                };

                onUpdated(optimistic);

                try {
                  await updateTask(task._id, {
                    [field]: userId as unknown as User,
                  });

                  message.success('Assigned to you');
                } catch {
                  message.error('Failed to assign task');
                }
              }}
            >
              Assign me
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <Select
      autoFocus
      className="h-7 w-[100px] truncate lg:w-full"
      size="small"
      loading={loading}
      value={currentUser?._id ?? null}
      placeholder="Unassigned"
      allowClear
      onBlur={() => setEditing(false)}
      onChange={async (userId) => {
        const selectedUser =
          members.find((member) => member._id === userId) ?? null;

        const optimistic = {
          ...task,
          [field]: selectedUser as User,
        };

        onUpdated(optimistic);
        setEditing(false);

        try {
          await updateTask(task._id, {
            [field]: (userId as unknown as User) ?? null,
          });
          message.success('Task Updated');
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
