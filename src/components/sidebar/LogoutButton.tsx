import { LogOut } from 'lucide-react';
import type { Props } from '../../types/sidebar.types';

export default function LogoutButton({ collapsed }: Props) {
  return (
    <div className="group my-5 mt-auto">
      <a
        id="logout-btn"
        className="flex cursor-pointer items-center gap-4 overflow-hidden rounded-lg bg-gray-50 p-2 text-red-700 shadow hover:bg-red-200 hover:text-red-800"
      >
        <LogOut size={24} className="shrink-0" />
        <span
          className={`text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
            collapsed
              ? 'w-0 -translate-x-2 opacity-0'
              : 'w-auto translate-x-0 opacity-100'
          }`}
        >
          Logout
        </span>
      </a>
    </div>
  );
}
