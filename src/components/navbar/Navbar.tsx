import Notifications from './Notifications';
import { CommandPalette } from '../common/CommandPalette';
import { useState, useRef, useEffect } from 'react';
import { Tag } from 'antd';
import { Bell, Search, Settings, Menu, X } from 'lucide-react';
import { Can } from '../../utils/PermissionHoc';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { normalizeAndCapitalize } from '../../utils/utils';
import { getWorkspaces } from '../../services/workspaceService';

export default function Navbar() {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
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
  const [, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [workspaceName, setWorkspaceName] = useState('');

  const projectHeader = (
    <span>
      <span className="text-gray-500">{workspaceName} /</span>{' '}
      {project?.name || ''}
    </span>
  );

  const actionButtonClass =
    'flex h-8 w-8 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none dark:text-slate-200 dark:hover:bg-[#2a2a33] dark:hover:text-white dark:focus-visible:ring-slate-600';

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

  useEffect(() => {
    if (!project?.workspaceId) {
      return;
    }

    const resolveWorkspaceName = async () => {
      try {
        const response = await getWorkspaces();
        const matchedWorkspace = response.result?.find(
          (workspace) => workspace.workspaceId === project.workspaceId
        );

        setWorkspaceName(matchedWorkspace?.workspaceName || '');
      } catch (error) {
        console.error('Failed to resolve workspace name:', error);
        setWorkspaceName('');
      }
    };

    resolveWorkspaceName();

    return () => {};
  }, [project?.workspaceId]);

  return (
    <div className="header border border-gray-50 bg-gray-100 dark:border-[#27272e] dark:bg-[#1b1b1f]">
      <nav className="flex flex-row items-center justify-between px-3 py-2 shadow-sm sm:flex-row sm:items-center md:px-4 md:py-2">
        {/* TOP ROW */}
        <div className="flex flex-col gap-1 text-start sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              {project?.icon && !projectInfoHidden && (
                <img
                  src={project.icon}
                  alt="project icon"
                  className="inline h-5 w-5 rounded object-cover"
                />
              )}
              {!projectInfoHidden && (
                <h2
                  onClick={() => navigate(`/project/${project?._id}/backlog`)}
                  role="button"
                  tabIndex={0}
                  className="topbar-project-header inline cursor-pointer items-center text-base! leading-tight font-semibold text-gray-900 hover:text-blue-500 sm:text-lg dark:text-neutral-100"
                >
                  {projectHeader}
                </h2>
              )}
            </div>

            {project?.projectType && !projectInfoHidden && (
              <Tag
                style={{
                  backgroundColor: 'var(--color-primary-400)',
                  color: '#fff',
                  textTransform: 'capitalize',
                  marginLeft: '0.25rem',
                  paddingInline: '0.35rem',
                  lineHeight: 1.5,
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
          className="flex items-center justify-center rounded-md p-1.5 text-slate-700 md:hidden dark:text-slate-100"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X size={18} strokeWidth={2} />
          ) : (
            <Menu size={18} strokeWidth={2} />
          )}
        </button>

        {/* Icon row — desktop only */}
        <div className="hidden items-center md:flex md:justify-end md:gap-1 lg:gap-2">
          <button
            onClick={handleSearchClick}
            className={actionButtonClass}
            aria-label="Search"
          >
            <Search size={16} strokeWidth={1.9} />
          </button>

          <Notifications />

          {!projectInfoHidden && (
            <Can permission="PROJECT_SETTINGS">
              <button
                onClick={() => navigate(`project/${project?._id}/settings`)}
                className={actionButtonClass}
                aria-label="Settings"
              >
                <Settings size={16} strokeWidth={1.9} />
              </button>
            </Can>
          )}
        </div>
      </nav>

      {/* Floating mobile menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-12 right-3 z-100 flex w-max flex-col rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg md:hidden dark:border-[#27272e] dark:bg-[#1b1b1f]"
        >
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

          <button
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-[#27272e]"
            onClick={() => {
              setMobileMenuOpen(false);
              handleSearchClick();
            }}
          >
            <Search size={15} strokeWidth={1.9} />
            Search
          </button>

          {!projectInfoHidden && (
            <Can permission="PROJECT_SETTINGS">
              <>
                {/* Divider before settings */}
                <div
                  style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }}
                />
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
              </>
            </Can>
          )}
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
