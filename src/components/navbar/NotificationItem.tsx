import { DateTime } from 'luxon';
import type { INotification } from '../../types/notification.types';
import { config } from '../../config/config';
import { useNavigate } from 'react-router-dom';

export function NotificationItem({
  data,
  setOpen,
}: {
  data: INotification;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/task/${data.taskId}`);
    setOpen(false);
  }

  const profileImage = data.profileImage
    ? `${config.api_base_url}/uploads/${data.profileImage}`
    : '/profile.png';

  return (
    <li onClick={handleClick} className="cursor-pointer">
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
