import React, { useEffect } from 'react';
import { useElementInView } from '../../hooks/useElementInView';
import type { INotification } from '../../types/notification.types';
import { NotificationItem } from './NotificationItem';
import { LoaderCircle } from 'lucide-react';

export function NotificationDropdown({
  notifications,
  loadMore,
  hasMore,
  setOpen,
  ref,
}: {
  notifications: INotification[];
  loadMore: () => void;
  hasMore: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ref: React.Ref<HTMLDivElement>;
}) {
  const [targetRef, isInView] = useElementInView({ threshold: 1 });

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
      <h3 className="p-3 py-2 text-lg font-semibold dark:text-slate-100">
        Notifications
      </h3>
      <hr className="border-gray-100 pb-2 dark:border-[#27272e]" />
      <ul className="w-full">
        {notifications.length === 0 ? (
          <li
            id="notificationListEmpty"
            className="w-full p-2 text-center text-gray-500 dark:text-slate-400"
          >
            Nothing to see here
          </li>
        ) : (
          notifications.map((notification) => (
            <>
              <NotificationItem
                setOpen={setOpen}
                key={notification._id}
                data={notification}
              />
              <hr className="border-gray-50 dark:border-[#27272e]" />
            </>
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
