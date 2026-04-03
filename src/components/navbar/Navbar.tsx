import Notifications from './Notifications';
import { CommandPalette } from '../common/CommandPalette';
import { AddTaskModal } from '../../utils/addTaskModal';
import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Menu, X } from 'lucide-react';
import { Can } from '../../utils/PermissionHoc';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { UserProfile } from '../sidebar/UserProfile';

export default function Navbar() {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const actionButtonClass =
    'flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none dark:text-slate-200 dark:hover:bg-[#2a2a33] dark:hover:text-white dark:focus-visible:ring-slate-600';

  const searchInputClass =
    'h-10 w-150 rounded-lg border border-gray-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-[#27272e] dark:bg-[#1b1b1f] dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:ring-primary-900/30';

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }
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
    <div className="header border border-gray-50 bg-gray-100 dark:border-[#27272e] dark:bg-[#1b1b1f]">
      <nav className="flex flex-row items-center justify-between gap-2 px-3 py-2 shadow-sm sm:flex-row sm:items-center md:px-4 md:py-2">
        {/* Mobile: Search and Create buttons */}
        <div className="flex min-w-0 flex-1 items-center gap-2 xl:hidden">
          <input
            type="search"
            role="searchbox"
            aria-label="Search"
            placeholder="Search tasks…"
            value={paletteSearch}
            onFocus={handleSearchClick}
            onClick={handleSearchClick}
            onChange={(e) => {
              setPaletteSearch(e.target.value);
              setCommandPaletteOpen(true);
            }}
            className="focus:border-primary-400 focus:ring-primary-100 dark:focus:ring-primary-900/30 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors outline-none placeholder:text-slate-400 focus:ring-2 dark:border-[#27272e] dark:bg-[#1b1b1f] dark:text-neutral-100 dark:placeholder:text-neutral-400"
          />
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 focus-visible:ring-primary-400 dark:bg-primary-600 dark:hover:bg-primary-700 flex h-auto w-auto flex-shrink-0 items-center justify-center rounded-md text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Create task"
          >
            <span className="p-1.5 font-medium">Create</span>
          </button>
        </div>

        <div className="relative hidden w-full items-center xl:flex">
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <input
              type="search"
              role="searchbox"
              aria-label="Search"
              placeholder="Search tasks by key, title, or description…"
              value={paletteSearch}
              onFocus={handleSearchClick}
              onClick={handleSearchClick}
              onChange={(e) => {
                setPaletteSearch(e.target.value);
                setCommandPaletteOpen(true);
              }}
              className={searchInputClass}
            />

            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 focus-visible:ring-primary-400 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Create task"
            >
              <span>Create</span>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Notifications />

            {!projectInfoHidden && (
              <Can permission="PROJECT_SETTINGS">
                <button
                  onClick={() => navigate(`project/${project?._id}/settings`)}
                  className={actionButtonClass}
                  aria-label="Settings"
                >
                  <Settings size={20} strokeWidth={2} />
                </button>
              </Can>
            )}

            <UserProfile
              collapsed={true}
              mobileOpen={false}
              showTooltip={true}
            />
          </div>
        </div>

        {/* Mobile: Hamburger menu on the right */}
        <button
          ref={hamburgerRef}
          className="flex items-center justify-center rounded-md p-1.5 text-slate-700 xl:hidden dark:text-slate-100"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X size={25} strokeWidth={2} />
          ) : (
            <Menu size={25} strokeWidth={2} />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-12 right-3 z-100 flex w-max flex-col rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg xl:hidden dark:border-[#27272e] dark:bg-[#1b1b1f]"
        >
          <UserProfile collapsed={false} mobileOpen={true} />

          <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />

          <button
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-[#27272e]"
            onClick={() => {
              setMobileMenuOpen(false);
              setNotifOpen(true);
            }}
          >
            <Bell size={15} strokeWidth={1.9} />
            Notifications
          </button>

          {!projectInfoHidden && (
            <Can permission="PROJECT_SETTINGS">
              <button
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-[#27272e]"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(`project/${project?._id}/settings`);
                }}
              >
                <Settings size={15} strokeWidth={1.9} />
                Settings
              </button>
            </Can>
          )}
        </div>
      )}

      <div className="xl:hidden">
        <Notifications open={notifOpen} onOpenChange={setNotifOpen} />
      </div>

      {isCommandPaletteOpen && (
        <CommandPalette
          open={isCommandPaletteOpen}
          value={paletteSearch}
          onChange={(value) => setPaletteSearch(value)}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}

      <AddTaskModal
        open={isAddTaskOpen}
        task={{}}
        onClose={() => setIsAddTaskOpen(false)}
        onCreate={() => setIsAddTaskOpen(false)}
      />
    </div>
  );
}
