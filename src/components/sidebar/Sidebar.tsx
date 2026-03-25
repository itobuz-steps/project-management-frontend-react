import SidebarGroup from './SidebarGroup';
import LogoutButton from './LogoutButton';
import {
  FolderKanban,
  Plus,
  X,
  Home,
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
} from 'lucide-react';
import SidebarProjectsDropdown from './SidebarProjectDropdown';
import SidebarWorkspaceCreate from './SidebarWorkspaceCreate';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { CreateProjectModal } from '../createProject';
import { Can } from '../../utils/PermissionHoc';
import { UserProfile } from './UserProfile';
import { useColorMode } from '../../hooks/useColorMode';

type SidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (value: boolean) => void;
  onSidebarOpen?: () => void;
};

export default function Sidebar({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileOpenChange,
  onSidebarOpen,
}: SidebarProps) {
  const [colorMode, setColorMode] = useColorMode();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [workspaceRefreshKey, setWorkspaceRefreshKey] = useState(0);
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);

  const isCompactSidebar = collapsed && !mobileOpen;

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleWorkspaceToggle = () => {
    // In collapsed desktop mode, clicking the workspace icon should open sidebar and keep workspaces visible.
    if (collapsed && !mobileOpen) {
      onSidebarOpen?.();
      onCollapsedChange(false);
      setWorkspacesExpanded(true);
      return;
    }

    setWorkspacesExpanded((prev) => !prev);
  };

  // Close mobile sidebar on route change or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileOpenChange(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onMobileOpenChange]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => {
          onSidebarOpen?.();
          onMobileOpenChange(true);
        }}
        className="absolute top-10 -left-1 z-10 rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        aria-label="Open sidebar"
      >
        {!mobileOpen ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
      </button>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => onMobileOpenChange(false)}
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed z-50 h-full border-r border-slate-200/80 bg-[#f7f7f8] text-slate-900 shadow-xl transition-all duration-300 ease-in-out md:relative md:z-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${
          mobileOpen ? 'left-0 w-80' : '-left-80 w-80 md:left-0'
        } ${collapsed ? 'md:w-16' : 'md:w-80'} `}
      >
        {/* Desktop collapse/expand button */}
        <button
          type="button"
          onClick={() => {
            const nextCollapsed = !collapsed;
            if (!nextCollapsed) {
              onSidebarOpen?.();
            }
            onCollapsedChange(nextCollapsed);
          }}
          className="absolute top-7 -right-5 z-10 hidden rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 md:inline-flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => onMobileOpenChange(false)}
          className="absolute top-4 right-4 rounded-lg bg-slate-50 p-1 text-slate-600 transition-colors hover:bg-slate-200/70 md:hidden dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div
          className={`flex h-full flex-col gap-4 overflow-x-hidden overflow-y-auto px-3 py-4 ${
            collapsed && !mobileOpen ? 'md:px-2' : 'md:px-4'
          }`}
        >
          <UserProfile collapsed={collapsed} mobileOpen={mobileOpen} />
          <ul className="flex flex-col gap-2 font-semibold">
            {/* FOR YOU */}
            <li>
              <NavLink
                to="/for-you"
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg border px-2.5 py-2.5 ${
                    isActive
                      ? 'border-primary-900 bg-primary-900 text-white'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/80 hover:shadow-xs dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                  } `
                }
              >
                <Home
                  className={`size-4 shrink-0 transition-colors ${collapsed && 'ml-0.5'}`}
                />
                <span
                  className={`truncate text-[14px] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
                    collapsed && !mobileOpen
                      ? '-translate-x-2 opacity-0'
                      : 'translate-x-0 opacity-100'
                  }`}
                >
                  For You
                </span>
              </NavLink>
            </li>

            {/* WORKSPACES */}
            <SidebarGroup
              id="projectsMenu"
              label="Workspaces"
              icon={<FolderKanban className="size-4 shrink-0" />}
              collapsed={collapsed && !mobileOpen}
              collapsible
              expanded={workspacesExpanded}
              onToggle={handleWorkspaceToggle}
              action={
                <Can permission="CREATE_PROJECT">
                  <button
                    type="button"
                    id="plus-icon"
                    className="plus-icon add-project group hover:border-primary-200 hover:bg-primary-200/80 hover:text-primary-900 relative shrink-0 cursor-pointer rounded-lg border border-transparent p-1 text-slate-700 transition-all duration-200 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                    title="Add project"
                    onClick={() => setProjectModalOpen(true)}
                  >
                    <Plus className="size-4" />
                  </button>
                </Can>
              }
            >
              <ul
                id="projectsDropdown"
                className={`ml-5 flex flex-col gap-3 border-l border-slate-300/80 pl-3 transition-all duration-300 ${
                  collapsed && !mobileOpen
                    ? 'h-0 overflow-hidden opacity-0'
                    : !workspacesExpanded
                      ? 'h-0 overflow-hidden opacity-0'
                      : 'h-auto opacity-100'
                }`}
              >
                <SidebarProjectsDropdown
                  collapsed={collapsed && !mobileOpen}
                  refreshKey={workspaceRefreshKey}
                />
                <Can permission="CREATE_WORKSPACE">
                  <SidebarWorkspaceCreate
                    visible={!collapsed || mobileOpen}
                    onCreated={() => setWorkspaceRefreshKey((prev) => prev + 1)}
                  />
                </Can>
              </ul>
            </SidebarGroup>
          </ul>

          <div className="mt-auto flex flex-col gap-2">
            <motion.button
              type="button"
              onClick={toggleColorMode}
              className={`group flex w-full items-center rounded-lg border px-2.5 py-2.5 transition-colors ${
                isCompactSidebar ? 'justify-center' : 'gap-3'
              } ${
                colorMode === 'dark'
                  ? 'border-slate-800 bg-slate-800 text-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                  : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/80 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'
              }`}
              aria-label={
                colorMode === 'light'
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                animate={{ rotate: colorMode === 'light' ? 0 : 180 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {colorMode === 'light' ? (
                  <Moon size={16} className="shrink-0" />
                ) : (
                  <Sun size={16} className="shrink-0" />
                )}
              </motion.span>
              <span
                className={`truncate text-[14px] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
                  isCompactSidebar
                    ? '-translate-x-2 opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                {colorMode === 'light' ? 'Dark mode' : 'Light mode'}
              </span>
            </motion.button>

            <LogoutButton collapsed={isCompactSidebar} />
          </div>
        </div>
      </aside>

      {/* Project Modal - rendered outside sidebar */}
      <CreateProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
    </>
  );
}
