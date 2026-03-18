import Notifications from './Notifications';
import { CommandPalette } from '../common/CommandPalette';
import {
  SearchOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { Tag } from 'antd';
import { Users, Bell, Moon, Sun } from 'lucide-react';
import { Can } from '../../utils/PermissionHoc';
import { InviteUserContainer } from '../common/InviteUserContainer';
import { ProjectMembersModal } from '../common/ProjectMembersModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useColorMode } from '../../hooks/useColorMode';
import { normalizeAndCapitalize } from '../../utils/utils';

export default function Navbar() {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [colorMode, setColorMode] = useColorMode();
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');
  const navigate = useNavigate();
  const { project } = useProject();
  const location = useLocation();
  const projectInfoHidden =
    location.pathname.endsWith('/for-you') ||
    location.pathname.includes('task');

  const handleSearchClick = () => {
    setCommandPaletteOpen(true);
  };

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const handleMemberModalClose = () => {
    setIsMembersOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileMenuOpen]);

  return (
    <div className="header border border-gray-50 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-950">
      <nav className="flex flex-row justify-between p-4 pl-5 shadow-sm sm:flex-row sm:items-center md:px-4 md:py-4">
        {/* TOP ROW */}
        <div className="flex flex-col gap-3 text-start sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              {project?.icon && !projectInfoHidden && (
                <img
                  src={project.icon}
                  alt="project icon"
                  className="inline h-6 w-6 rounded object-cover"
                />
              )}
              {!projectInfoHidden && (
                <h2
                  onClick={() => navigate(`/project/${project?._id}/backlog`)}
                  role="button"
                  tabIndex={0}
                  className="topbar-project-header inline cursor-pointer items-center text-lg! font-semibold text-gray-900 hover:text-blue-500 sm:text-xl dark:text-neutral-100"
                >
                  {normalizeAndCapitalize(project?.name || '')}
                </h2>
              )}
            </div>

            {project?.projectType && !projectInfoHidden && (
              <Tag
                style={{
                  backgroundColor: 'var(--color-primary-400)',
                  color: '#fff',
                  textTransform: 'capitalize',
                  marginLeft: '0.5rem',
                }}
              >
                {normalizeAndCapitalize(project.projectType)}
              </Tag>
            )}
          </div>
        </div>

        {/* Hamburger — mobile only */}
        <button
          ref={hamburgerRef}
          className="flex items-center justify-center p-1 text-gray-900 md:hidden dark:text-neutral-100"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <CloseOutlined style={{ fontSize: '1.2rem' }} />
          ) : (
            <MenuOutlined style={{ fontSize: '1.2rem' }} />
          )}
        </button>

        {/* Icon row — desktop only */}
        <div className="hidden items-center md:flex md:justify-end xl:gap-3">
          {project && !projectInfoHidden && (
            <div className="flex items-center justify-center rounded-md p-2 text-gray-900 transition-colors hover:bg-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-800">
              <Can permission="SEND_INVITE">
                <InviteUserContainer />
              </Can>
            </div>
          )}

          {project && !projectInfoHidden && (
            <button
              onClick={() => setIsMembersOpen(true)}
              className="flex items-center justify-center rounded-md p-2 text-gray-900 transition-colors hover:bg-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              <Users className="h-6 w-6" />
            </button>
          )}

          <ProjectMembersModal
            open={isMembersOpen}
            onClose={handleMemberModalClose}
          />

          <button
            onClick={handleSearchClick}
            className="rounded-md p-2 transition-colors hover:bg-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Search"
          >
            <SearchOutlined style={{ fontSize: '1.5rem' }} />
          </button>

          <div className="rounded-md p-2 transition-colors hover:bg-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-800">
            <Notifications />
          </div>

          <button
            onClick={toggleColorMode}
            className="rounded-md p-2 text-gray-900 transition-colors hover:bg-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
            aria-label={
              colorMode === 'light'
                ? 'Switch to dark mode'
                : 'Switch to light mode'
            }
          >
            {colorMode === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {!projectInfoHidden && (
            <Can permission="PROJECT_SETTINGS">
              <button
                onClick={() => navigate(`project/${project?._id}/settings`)}
                className="rounded-md p-2 transition-colors hover:bg-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Settings"
              >
                <SettingOutlined style={{ fontSize: '1.5rem' }} />
              </button>
            </Can>
          )}
        </div>
      </nav>

      {/* Floating mobile menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-14 right-5 z-100 flex w-max flex-col rounded-lg border border-gray-200 bg-white p-2 shadow-lg md:hidden dark:border-neutral-700 dark:bg-neutral-900"
        >
          {project && !projectInfoHidden && (
            <Can permission="SEND_INVITE">
              <button
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInviteOpen(true);
                }}
              >
                <Users size={16} />
                Invite Users
              </button>
            </Can>
          )}

          <button
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => {
              setMobileMenuOpen(false);
              setNotifOpen(true);
            }}
          >
            <Bell size={16} />
            Notifications
          </button>

          {project && !projectInfoHidden && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsMembersOpen(true);
              }}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              <Users size={16} />
              Members
            </button>
          )}

          <button
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => {
              setMobileMenuOpen(false);
              handleSearchClick();
            }}
          >
            <SearchOutlined style={{ fontSize: '1rem' }} />
            Search
          </button>

          <button
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => {
              setMobileMenuOpen(false);
              toggleColorMode();
            }}
          >
            {colorMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {colorMode === 'light' ? 'Dark mode' : 'Light mode'}
          </button>

          {!projectInfoHidden && (
            <Can permission="PROJECT_SETTINGS">
              <>
                {/* Divider before settings */}
                <div
                  style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }}
                />
                <button
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(`project/${project?._id}/settings`);
                  }}
                >
                  <SettingOutlined style={{ fontSize: '1rem' }} />
                  Settings
                </button>
              </>
            </Can>
          )}
        </div>
      )}

      {/* Always-mounted controlled instances for mobile triggers */}
      <InviteUserContainer open={inviteOpen} onOpenChange={setInviteOpen} />
      {notifOpen && (
        <div className="fixed top-14 right-2 z-50 md:hidden">
          <Notifications open={notifOpen} onOpenChange={setNotifOpen} />
        </div>
      )}

      {isCommandPaletteOpen && (
        <CommandPalette
          open={isCommandPaletteOpen}
          value={paletteSearch}
          onChange={(value) => setPaletteSearch(value)}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </div>
  );
}
