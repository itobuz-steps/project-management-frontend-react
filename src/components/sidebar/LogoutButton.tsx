import { LogOut } from 'lucide-react';
import type { Props } from '../../types/sidebar.types';

export default function LogoutButton({ collapsed }: Props) {
  return (
    <div className="group my-5 mt-auto">
      <a
        id="logout-btn"
        className="hover:text-red-800flex flex items-center gap-4 rounded-lg bg-gray-50 p-2 text-red-700 shadow hover:bg-red-200"
      >
        <LogOut size={24} />
        {!collapsed && <p className="text-lg font-semibold">Logout</p>}
      </a>
    </div>
  );
}
