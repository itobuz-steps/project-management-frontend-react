import { useEffect } from 'react';
import { useElementInView } from '../../hooks/useElementInView';
import type { INotification } from '../../types/notification.types';
import { NotificationItem } from './NotificationItem';
import { LoaderCircle } from 'lucide-react';

export function NotificationDropdown({
  notifications,
  loadMore,
  hasMore,
}: {
  notifications: INotification[];
  loadMore: () => void;
  hasMore: boolean;
}) {
  const [targetRef, isInView] = useElementInView({ threshold: 1 });

  useEffect(() => {
    if (isInView) {
      loadMore();
    }
  }, [isInView, loadMore]);

  return (
    <div
      id="notificationDropdownMenu"
      className="absolute right-0 z-15 mt-2 mr-3 max-h-125 min-w-full flex-col overflow-auto rounded-lg bg-white py-2 shadow-lg max-md:w-55 md:w-85"
    >
      <h3 className="px-6 py-2 text-lg font-semibold">Notification</h3>

      <ul className="w-full">
        {notifications.length === 0 ? (
          <li
            id="notificationListEmpty"
            className="w-full p-2 text-center text-gray-500"
          >
            Nothing to see here
          </li>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification._id} data={notification} />
          ))
        )}
      </ul>

      <li
        id="targetElement"
        className="flex w-full items-center justify-center p-3 outline-red-500"
        ref={targetRef}
      >
        {hasMore && <LoaderCircle className="animate-spin text-gray-400" />}
      </li>
    </div>
  );
}
