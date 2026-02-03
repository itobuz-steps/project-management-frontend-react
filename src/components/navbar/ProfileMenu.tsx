import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemePicker } from './ThemePicker';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="profileBtn"
        className="border-primary-400 flex items-center rounded-full border-3"
        onClick={() => setOpen(!open)}
      >
        <div className="profile-image h-7 w-7 cursor-pointer rounded-full bg-gray-400 sm:h-9 sm:w-9">
          <img
            id="profileImage"
            src="../assets/img/profile.png"
            alt="Profile Preview"
            className="size-full rounded-full object-cover"
          />
        </div>
      </button>

      {open && (
        <div
          id="dropdownMenu"
          className="absolute right-0 z-50 mt-2 w-40 flex-col gap-6 rounded-sm border border-gray-200 bg-white p-4 shadow-lg"
        >
          <Link
            to="/edit-profile"
            className="block rounded-xs bg-gray-50 p-2 font-medium text-black shadow-sm hover:bg-gray-100"
          >
            Edit Profile
          </Link>

          <ThemePicker />
        </div>
      )}
    </div>
  );
}
