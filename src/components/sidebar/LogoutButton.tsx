import { LogOut } from 'lucide-react';
import type { Props } from '../../types/sidebar.types';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ collapsed }: Props) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="group mt-auto flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-lg border border-red-100 bg-white/90 p-2.5 text-red-700 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-800 hover:shadow-md dark:border-red-900/40 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-red-950/40"
    >
      <span id="logout-btn" className="flex items-center gap-4">
        <LogOut size={24} className="shrink-0" />
        <span
          className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
            collapsed
              ? 'w-0 -translate-x-2 opacity-0'
              : 'w-auto translate-x-0 opacity-100'
          }`}
        >
          Logout
        </span>
      </span>
    </button>
  );
}
