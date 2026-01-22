import SearchBar from './SearchBar';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';

export default function Navbar() {
  return (
    <div className="header mx-2 mt-2 rounded-lg border border-gray-50 bg-gray-50 md:mx-4 md:mt-4">
      <nav className="flex flex-row items-center justify-end rounded-lg p-2 pl-5 shadow-sm md:px-5 md:py-2">
        <div className="flex items-center gap-1 md:gap-5">
          <SearchBar />
          <Notifications />
          <ProfileMenu />
        </div>
      </nav>
    </div>
  );
}
