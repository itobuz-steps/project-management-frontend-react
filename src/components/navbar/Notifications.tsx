import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="relative mx-auto w-max">
      <button
        type="button"
        id="dropdownToggle"
        className="flex h-12 w-12 items-center justify-center border-none outline-none"
      >
        <span className="relative inline-flex">
          <Bell className="h-8 w-8 stroke-black max-md:size-6" />

          <span
            id="notificationBadge"
            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white"
          />
        </span>
      </button>

      <div
        id="notificationDropdownMenu"
        className="absolute right-0 z-15 mt-2 mr-3 hidden max-h-[500px] min-w-full flex-col overflow-auto rounded-lg bg-white py-2 shadow-lg max-md:w-[220px] md:w-[340px]"
      >
        <h3 className="px-6 py-2 text-lg font-semibold">Notification</h3>

        <ul className="w-full">
          <li
            id="notificationListEmpty"
            className="w-full p-2 text-center text-gray-500"
          >
            Nothing to see here
          </li>
        </ul>

        <li
          id="targetElement"
          className="flex w-full items-center justify-center p-3"
        >
          <svg
            aria-hidden="true"
            className="fill-primary-500 hidden h-4 w-4 animate-spin"
            viewBox="0 0 20 20"
          >
            <path d="M100 50.5908C100 78.2051..." fill="inherit" />
          </svg>
        </li>
      </div>
    </div>
  );
}
