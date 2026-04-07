import { useState } from 'react';
import { Select } from 'antd';
import type { User } from '../../services/types/tasks.types';
import { UserCell } from './UserCell';
import type { AssigneeCellType } from './ui.types';
import { useAuthContext } from '../../context/AuthContext';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';

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

  const { update, loading: saving } = useTaskUpdate(task._id, onUpdated);

  const currentUser = task[field] as User | undefined;

  // Always include the current user in the options list.
  // If `members` hasn't loaded yet (still fetching), Ant Design can't match
  // the Select's `value` to any option label and falls back to rendering the
  // raw _id string. Prepending `currentUser` prevents that fallback.
  const memberOptions = (() => {
    const list = [...members];
    if (currentUser && !list.some((m) => m?._id === currentUser._id)) {
      list.unshift(currentUser);
    }
    return list;
  })();

  const updateAssignee = (id: string | null) => {
    const selectedUser = members.find((member) => member._id === id) ?? null;

    const optimistic = {
      ...task,
      [field]: selectedUser as User,
    };

    onUpdated(optimistic);

    update({
      [field]: id ?? null,
    });
  };

  if (!editing) {
    return (
      <div className="flex h-7 w-25 items-center gap-1 truncate rounded-md px-1 hover:bg-gray-100 lg:w-full dark:hover:bg-slate-700">
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
            <span className="text-gray-300 dark:text-slate-500">·</span>

            <button
              className="text-primary-600 text-xs hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                updateAssignee(userId);
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
      className="h-7 w-25 truncate lg:w-full"
      size="small"
      loading={loading || saving}
      value={currentUser?._id ?? null}
      placeholder="Unassigned"
      allowClear
      onBlur={() => setEditing(false)}
      onChange={(id) => {
        updateAssignee(id ?? null);
        setEditing(false);
      }}
      // Plain string label → shown in the trigger (never a raw ID)
      // optionRender → rich UserCell avatar+name shown inside the dropdown
      options={memberOptions.map((member) => ({
        value: member._id,
        label: member.name ?? member.email ?? member._id,
      }))}
      optionRender={(option) => {
        const member = memberOptions.find((m) => m._id === option.value);
        return <UserCell user={member} emptyText="Unassigned" />;
      }}
    />
  );
}
