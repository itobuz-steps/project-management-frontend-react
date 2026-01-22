import { Link } from 'react-router';

export function TabSwitcher({
  selectedTab,
}: {
  selectedTab: 'signup' | 'login';
}) {
  return (
    <div className="xs:min-w-95 flex min-w-[90%] overflow-hidden rounded-lg bg-gray-50 text-gray-600 inset-shadow-sm">
      <Link
        to={'/signup'}
        className={` ${selectedTab === 'signup' ? 'active' : ''} [&.active]:bg-primary-400 flex-1 cursor-pointer py-3 text-center font-medium transition-all duration-300 [&.active]:text-white`}
      >
        Sign up
      </Link>
      <Link
        to={'/login'}
        className={`${selectedTab === 'login' ? 'active' : ''} [&.active]:bg-primary-400 flex-1 cursor-pointer py-3 text-center font-medium transition-all duration-300 [&.active]:text-white`}
      >
        Login
      </Link>
    </div>
  );
}
