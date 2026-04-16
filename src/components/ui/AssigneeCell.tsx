import { useState } from 'react';
import { Select } from 'antd';
import type { User } from '../../services/types/tasks.types';
import { UserCell } from './UserCell';
import type { AssigneeCellType } from './ui.types';
import { useAuthContext } from '../../context/AuthContext';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import { THEME_COLORS } from '../../config/constants';

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

  const theme = localStorage.getItem('lastProjectTheme') || 'indigo';
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];
  const accentColor = themeColors[4];

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
      <div className="flex h-7 w-25 items-center gap-1 truncate rounded-md hover:bg-gray-100 lg:w-full dark:hover:bg-slate-700">
        <div
          className="cursor-pointer truncate"
          onClick={() => {
            setEditing(true);
            loadMembers?.();
          }}
        >
          <UserCell user={currentUser} emptyText="Unassigned" />
        </div>
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
        if (id === '__assign_me__') {
          updateAssignee(userId ?? null);
        } else {
          updateAssignee(id ?? null);
        }
        setEditing(false);
      }}
      options={[
        ...(userId
          ? [
              {
                value: '__assign_me__',
                label: 'Assign to me',
              },
            ]
          : []),

        ...memberOptions.map((member) => ({
          value: member._id,
          label: member.name ?? member.email ?? member._id,
        })),
      ]}
      optionRender={(option) => {
        if (option.value === '__assign_me__') {
          return (
            <div
              className="flex items-center gap-2 rounded-md text-sm"
              style={{
                color: accentColor,
              }}
            >
              Assign Me
            </div>
          );
        }

        const member = memberOptions.find((m) => m._id === option.value);
        return <UserCell user={member} emptyText="Assign Me" />;
      }}
    />
  );
}
