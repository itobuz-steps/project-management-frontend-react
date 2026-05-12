import React, { useEffect, useMemo, useState } from 'react';
import { useElementInView } from '../../hooks/useElementInView';
import type { INotification } from '../../types/notification.types';
import { NotificationItem } from './NotificationItem';
import { LoaderCircle } from 'lucide-react';
import dayjs from 'dayjs';

type NotificationFilter = 'date' | 'threeDays' | 'sevenDays' | 'older';

export function NotificationDropdown({
  notifications,
  loadMore,
  hasMore,
  setOpen,
  onMarkAllRead,
  ref,
}: {
  notifications: INotification[];
  loadMore: () => void;
  hasMore: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onMarkAllRead?: () => Promise<void>;
  ref: React.Ref<HTMLDivElement>;
}) {
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAll = async () => {
    if (!onMarkAllRead) return;
    setIsMarking(true);
    try {
      await onMarkAllRead();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    } finally {
      setIsMarking(false);
    }
  };
  const [targetRef, isInView] = useElementInView({ threshold: 1 });
  const [activeFilter, setActiveFilter] =
    useState<NotificationFilter>('sevenDays');

  const getAgeInDays = (createdAt: string) => {
    const created = dayjs(createdAt);
    if (!created.isValid()) {
      return null;
    }

    return Math.max(0, dayjs().diff(created, 'day'));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const ageInDays = getAgeInDays(notification.createdAt);
      if (ageInDays === null) {
        return activeFilter === 'older';
      }

      if (activeFilter === 'date') {
        return ageInDays === 0;
      }

      if (activeFilter === 'threeDays') {
        return ageInDays > 0 && ageInDays <= 3;
      }

      if (activeFilter === 'sevenDays') {
        return ageInDays > 0 && ageInDays <= 7;
      }

      return true;
    });
  }, [activeFilter, notifications]);

  useEffect(() => {
    if (isInView) {
      loadMore();
    }
  }, [isInView, loadMore]);

  return (
    <div
      className="fixed top-16 right-2 bottom-auto left-2 z-50 max-h-125 flex-col overflow-y-auto rounded-sm border border-gray-200 bg-white px-2 pb-2 shadow-md sm:top-auto sm:right-3.5 sm:left-auto sm:w-96 dark:border-[#27272e] dark:bg-[#1b1b1f]"
      ref={ref}
    >
      <div className="flex items-center justify-between p-3 py-2">
        <h3 className="text-lg font-semibold dark:text-slate-100">
          Notifications
        </h3>
        <button
          type="button"
          onClick={handleMarkAll}
          disabled={!notifications.some((n) => n.unread) || isMarking}
          className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 dark:text-slate-300"
        >
          {isMarking ? (
            <LoaderCircle className="inline-block h-4 w-4 animate-spin" />
          ) : (
            'Mark all as read'
          )}
        </button>
      </div>
      <hr className="border-gray-100 pb-2 dark:border-[#27272e]" />
      <div className="mb-2 flex flex-wrap gap-1 px-2">
        <button
          type="button"
          onClick={() => setActiveFilter('date')}
          className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            activeFilter === 'date'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#27272e] dark:text-slate-300 dark:hover:bg-[#31313b]'
          }`}
        >
          Date
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('threeDays')}
          className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            activeFilter === 'threeDays'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#27272e] dark:text-slate-300 dark:hover:bg-[#31313b]'
          }`}
        >
          3 Days Ago
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('sevenDays')}
          className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            activeFilter === 'sevenDays'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#27272e] dark:text-slate-300 dark:hover:bg-[#31313b]'
          }`}
        >
          7 Days Ago
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('older')}
          className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            activeFilter === 'older'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#27272e] dark:text-slate-300 dark:hover:bg-[#31313b]'
          }`}
        >
          All
        </button>
      </div>
      <ul className="w-full">
        {filteredNotifications.length === 0 ? (
          <li
            id="notificationListEmpty"
            className="w-full p-2 text-center text-gray-500 dark:text-slate-400"
          >
            Nothing to see here
          </li>
        ) : (
          filteredNotifications.map((notification) => (
            <React.Fragment key={notification._id}>
              <NotificationItem setOpen={setOpen} data={notification} />
              <hr className="border-gray-50 dark:border-[#27272e]" />
            </React.Fragment>
          ))
        )}
      </ul>

      <li
        id="targetElement"
        className="flex w-full items-center justify-center p-3 outline-red-500"
        ref={targetRef}
      >
        {notifications.length !== 0 && hasMore && (
          <LoaderCircle className="animate-spin text-gray-400 dark:text-slate-400" />
        )}
      </li>
    </div>
  );
}
