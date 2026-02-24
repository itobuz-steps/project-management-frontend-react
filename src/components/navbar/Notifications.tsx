import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import notificationService from '../../services/notificationService';
import type { INotification } from '../../types/notification.types';
import userService from '../../services/userService';

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  useEffect(() => {
    async function fetchUserPreferences() {
      const res = await userService.getUserInfo();
      setInAppEnabled(res.result.notificationPreferences?.inApp);
    }
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      const notifications = await notificationService.getAllNotification(
        page,
        5
      );
      console.log(notifications);
      setNotifications((prev) => [...prev, ...notifications.result]);
      setHasMore(notifications.pagination.hasMore);
    }
    fetchNotifications();
  }, [page]);

  useEffect(() => {
    const channel = new BroadcastChannel('sw-messages');

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      console.log(event.data.payload);
      console.log('Received message from service worker:', event.data);

      if (type === 'PUSH_NOTIFICATION' && inAppEnabled) {
        setNotifications((prev) => [payload, ...prev]);
        setNewNotificationCount((prev) => prev + 1);
      }
    };
  }, [inAppEnabled]);

  function loadMore() {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }

  return (
    <div className="relative mx-auto w-max">
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center border-none outline-none"
        onClick={() => {
          setNewNotificationCount(0);
          setOpen(!open);
        }}
      >
        <span className="relative inline-flex">
          <Bell className="h-8 w-8 stroke-black max-md:size-6" />

          {newNotificationCount > 0 && !open && (
            <span
              id="notificationBadge"
              className="absolute -top-1 -right-0.5 flex min-h-3 min-w-3 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white"
            >
              {newNotificationCount}
            </span>
          )}
        </span>
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          loadMore={loadMore}
          hasMore={hasMore}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}
