import type { User } from '../../services/types/tasks.types';
import { config } from '../../config/config';

export function UserWithAvatar({
  user,
  fallback,
}: {
  user?: User;
  fallback: string;
}) {
  return (
    <div className="flex items-center pr-2">
      <img
        className="mr-3 h-6 w-6 rounded-full object-cover"
        src={
          user?.profileImage
            ? `${config.api_base_url}/uploads/${user.profileImage}`
            : '/profile.png'
        }
      />
      {user?.name ?? fallback}
    </div>
  );
}
