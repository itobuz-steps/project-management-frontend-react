import { Avatar } from 'antd';
import type { UserCellType } from './ui.types';

export function UserCell({ user, emptyText }: UserCellType) {
  if (!user) {
    return <span className="text-gray-400">{emptyText}</span>;
  }

  return (
    <div className="flex items-center gap-2 truncate">
      <Avatar
        size="small"
        className="h-6 w-6 shrink-0"
        src={user.profileImage ? user.profileImage : '/profile.png'}
      />

      <span className="truncate">{user.name}</span>
    </div>
  );
}
