export function TabSwitcher({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: 'signup' | 'login';
  setSelectedTab: React.Dispatch<React.SetStateAction<'signup' | 'login'>>;
}) {
  return (
    <div className="xs:min-w-95 flex min-w-[90%] overflow-hidden rounded-lg bg-gray-50 text-gray-600 inset-shadow-sm">
      <button
        className={` ${selectedTab === 'signup' ? 'active' : ''} [&.active]:bg-primary-400 flex-1 cursor-pointer py-3 font-medium transition-all duration-300 [&.active]:text-white`}
        onClick={() => setSelectedTab('signup')}
      >
        Sign up
      </button>
      <button
        className={`${selectedTab === 'login' ? 'active' : ''} [&.active]:bg-primary-400 flex-1 cursor-pointer py-3 font-medium transition-all duration-300 [&.active]:text-white`}
        onClick={() => setSelectedTab('login')}
      >
        Login
      </button>
    </div>
  );
}
