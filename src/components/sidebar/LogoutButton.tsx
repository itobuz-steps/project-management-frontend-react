import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
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
      className="-mt-2 mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:text-red-700 active:scale-[0.98] dark:border-red-900/40 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
}
