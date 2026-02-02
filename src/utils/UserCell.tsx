import { Avatar } from "antd";
import type { User } from "../services/types/tasks.types";

export function UserCell({ user, emptyText }: { user?: User; emptyText: string }) {
  if (!user) return <span className="text-gray-400">{emptyText}</span>;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar size="small" src={user.profileImage}>
        {user.name?.[0]}
      </Avatar>
      <span className="truncate">{user.name}</span>
    </div>
  );
}