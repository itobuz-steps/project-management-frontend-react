import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { message, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

interface UserProfileProps {
  collapsed: boolean;
  mobileOpen: boolean;
  showTooltip?: boolean;
}

export function UserProfile({
  collapsed,
  mobileOpen,
  showTooltip = false,
}: UserProfileProps) {
  const [userName, setUserName] = useState('Workspace');
  const [userEmail, setUserEmail] = useState('project manager');
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await userService.getUserInfo();
        const name = response.result.name?.trim();
        const email = response.result.email?.trim();
        const profileImage = response.result.profileImage?.trim();
        if (name) setUserName(name);
        if (email) setUserEmail(email);
        if (profileImage) setUserImage(profileImage);
      } catch {
        message.error('Failed to load user info');
      }
    }
    loadUser();
  }, []);

  const avatarImg = (
    <img
      src={userImage || '/profile.png'}
      alt={userName}
      className="aspect-square h-10 w-10 rounded-xl object-cover"
    />
  );

  return (
    <Link
      to="/edit-profile"
      className={`flex flex-col gap-3 rounded-xl p-2 ${
        collapsed && !mobileOpen
          ? 'justify-center md:w-auto'
          : 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}
    >
      <div className="flex cursor-pointer items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-700">
          {showTooltip ? (
            <Tooltip
              title={
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{userName}</span>
                  <span className="text-xs text-slate-300">{userEmail}</span>
                </div>
              }
              placement="bottomRight"
            >
              {avatarImg}
            </Tooltip>
          ) : (
            avatarImg
          )}
        </div>
        <div
          className={`min-w-0 transition-all duration-300 ${
            collapsed && !mobileOpen
              ? 'w-0 -translate-x-2 opacity-0 md:hidden'
              : 'w-auto translate-x-0 opacity-100'
          }`}
        >
          <p className="truncate text-[15px] font-semibold text-slate-900 dark:text-slate-100">
            {userName}
          </p>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {userEmail}
          </p>
        </div>
      </div>
    </Link>
  );
}
