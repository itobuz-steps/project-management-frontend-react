import { DateTime } from 'luxon';
import type { INotification } from '../../types/notification.types';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

export function NotificationItem({
  data,
  setOpen,
}: {
  data: INotification;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  function handleClick() {
    if (data.taskId) {
      navigate(`/task/${data.taskId}`);
      setOpen(false);
    }
  }

  return (
    <li onClick={handleClick} className="cursor-pointer">
      <div className="flex items-start gap-4 bg-white p-2 transition hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600">
        <div className="relative shrink-0">
          <Bell className="text-primary-400 mt-0.5 h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
            {data.title}
          </p>
          <span className="text-xs text-gray-400 dark:text-slate-400">
            {DateTime.fromISO(data.createdAt).toRelative()}
          </span>
        </div>
      </div>
    </li>
  );
}
