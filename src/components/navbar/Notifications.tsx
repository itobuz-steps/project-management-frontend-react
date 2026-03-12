import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import notificationService from '../../services/notificationService';
import type { INotification } from '../../types/notification.types';
import userService from '../../services/userService';

const PAGE_SIZE = 10;

interface NotificationsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Notifications({
  open: externalOpen,
  onOpenChange,
}: NotificationsProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen! : internalOpen;
  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    const next =
      typeof value === 'function'
        ? (value as (prev: boolean) => boolean)(open)
        : value;
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  };
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

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
        PAGE_SIZE
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

      if (type === 'PUSH_NOTIFICATION') {
        setNotifications((prev) => [payload, ...prev]);

        setNewNotificationCount((prev) => (inAppEnabled ? prev + 1 : prev));
      }
    };
    return () => channel.close();
  }, [inAppEnabled]);

  function loadMore() {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }

  return (
    <div className="relative mx-auto w-max">
      {!isControlled && (
        <button
          type="button"
          className="flex items-center justify-center border-none outline-none"
          onClick={() => {
            setNewNotificationCount(0);
            setOpen(!open);
          }}
        >
          <span className="relative inline-flex">
            <Bell className="size-6 stroke-black max-md:size-6" />

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
      )}

      {open && (
        <NotificationDropdown
          notifications={notifications}
          loadMore={loadMore}
          hasMore={hasMore}
          setOpen={setOpen}
          ref={dropdownRef}
        />
      )}
    </div>
  );
}
