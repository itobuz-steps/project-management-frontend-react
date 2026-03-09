import { useState, useEffect } from 'react';
import { config } from '../../config/config';
import userService from '../../services/userService';
import { message } from 'antd';
import { ChevronDown, ChevronRight, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfileProps {
  collapsed: boolean;
  mobileOpen: boolean;
}

export function UserProfile({ collapsed, mobileOpen }: UserProfileProps) {
  const [userName, setUserName] = useState('Workspace');
  const [userEmail, setUserEmail] = useState('project manager');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await userService.getUserInfo();

        const name = response.result.name?.trim();
        const email = response.result.email?.trim();
        const profileImage = response.result.profileImage?.trim();

        if (name) setUserName(name);
        if (email) setUserEmail(email);
        if (profileImage) {
          setUserImage(`${config.api_base_url}/uploads/${profileImage}`);
        }
      } catch {
        message.error('Failed to load user info');
      }
    }

    loadUser();
  }, []);

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl p-2 ${
        collapsed && !mobileOpen
          ? 'justify-center md:w-auto'
          : 'border border-slate-200 bg-white'
      }`}
      onClick={() => {
        if (collapsed) {
          return;
        }
        setOpen((prev) => !prev);
      }}
    >
      <div className="flex cursor-pointer items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-700">
          <img
            src={userImage || '/profile.png'}
            alt={userName}
            className="aspect-square h-10 w-10 rounded-xl object-cover"
          />
        </div>
        <div
          className={`min-w-0 transition-all duration-300 ${
            collapsed && !mobileOpen
              ? 'w-0 -translate-x-2 opacity-0 md:hidden'
              : 'w-auto translate-x-0 opacity-100'
          }`}
        >
          <p className="truncate text-[15px] font-semibold text-slate-900">
            {userName}
          </p>
          <p className="truncate text-sm text-slate-500">{userEmail}</p>
        </div>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
      {open && !collapsed && (
        <Link
          to="/edit-profile"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
        >
          {' '}
          <Edit3 className="size-4" />
          Edit Profile
        </Link>
      )}
    </div>
  );
}
