import { Link } from 'react-router';

export function TabSwitcher({
  selectedTab,
}: {
  selectedTab: 'signup' | 'login';
}) {
  return (
    <div className="xs:min-w-95 flex min-w-[90%] overflow-hidden rounded-lg bg-gray-50 text-gray-600 inset-shadow-sm dark:bg-slate-900 dark:text-slate-200">
      <Link
        to={'/signup'}
        className={` ${selectedTab === 'signup' ? 'active' : ''} [&.active]:bg-primary-400 dark:[&.active]:bg-primary-400 flex-1 cursor-pointer py-3 text-center font-medium transition-all duration-300 [&.active]:text-white dark:[&.active]:text-white`}
      >
        Sign up
      </Link>
      <Link
        to={'/login'}
        className={`${selectedTab === 'login' ? 'active' : ''} [&.active]:bg-primary-400 dark:[&.active]:bg-primary-400 flex-1 cursor-pointer py-3 text-center font-medium transition-all duration-300 [&.active]:text-white dark:[&.active]:text-white`}
      >
        Login
      </Link>
    </div>
  );
}
