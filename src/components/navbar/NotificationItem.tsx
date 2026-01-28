import { DateTime } from 'luxon';
import type { INotification } from '../../types/notification.types';
import { config } from '../../config/config';

export function NotificationItem({ data }: { data: INotification }) {
  const profileImage = data.profileImage
    ? `${config.api_base_url}/uploads/profile/${data.profileImage}`
    : 'profile.png';

  return (
    <li>
      <div className="flex items-start gap-2 bg-white p-2 transition hover:bg-gray-100">
        <div className="relative shrink-0">
          <img
            src={profileImage}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-900">{data.title}</p>
          <span className="text-xs text-gray-400">
            {DateTime.fromISO(data.createdAt).toRelative()}
          </span>
        </div>
      </div>
    </li>
  );
}
