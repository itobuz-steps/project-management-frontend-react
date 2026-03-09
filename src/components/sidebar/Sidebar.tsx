import SidebarGroup from './SidebarGroup';
import LogoutButton from './LogoutButton';
import {
  FolderKanban,
  Plus,
  Menu,
  X,
  Home,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import SidebarProjectsDropdown from './SidebarProjectDropdown';
import SidebarWorkspaceCreate from './SidebarWorkspaceCreate';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CreateProjectModal } from '../createProject';
import { Can } from '../../utils/PermissionHoc';
import { UserProfile } from './UserProfile';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [workspaceRefreshKey, setWorkspaceRefreshKey] = useState(0);
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);

  // Close mobile sidebar on route change or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

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
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-xl border border-slate-200 bg-white/95 p-2.5 text-slate-700 shadow-lg backdrop-blur md:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed z-50 h-full border-r border-slate-200/80 bg-[#f7f7f8] text-slate-900 shadow-xl transition-all duration-300 ease-in-out md:relative md:z-auto ${
          mobileOpen ? 'left-0 w-80' : '-left-80 w-80 md:left-0'
        } ${collapsed ? 'md:w-16' : 'md:w-80'} `}
      >
        {/* Desktop collapse/expand button */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute top-7 -right-3 z-10 hidden rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 md:inline-flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-200/70 md:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div
          className={`flex h-full flex-col gap-6 overflow-x-hidden overflow-y-auto px-3 py-4 ${
            collapsed && !mobileOpen ? 'md:px-2' : 'md:px-4'
          }`}
        >
          <UserProfile collapsed={collapsed} mobileOpen={mobileOpen} />
          <ul className="flex flex-col gap-3 font-semibold">
            {/* FOR YOU */}
            <li>
              <NavLink
                to="/for-you"
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border px-2.5 py-2.5 transition-all duration-200 ${
                    isActive
                      ? 'border-primary-900 bg-primary-900 text-white shadow-sm'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/80 hover:shadow-sm'
                  } `
                }
              >
                <Home
                  size={20}
                  className={`shrink-0 transition-colors group-hover:text-slate-900 ${collapsed && 'ml-0.5'}`}
                />
                <span
                  className={`truncate text-[15px] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
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
              icon={<FolderKanban size={20} className="shrink-0" />}
              collapsed={collapsed && !mobileOpen}
              collapsible
              expanded={workspacesExpanded}
              onToggle={() => setWorkspacesExpanded((prev) => !prev)}
              action={
                <Can permission="CREATE_PROJECT">
                  <button
                    type="button"
                    id="plus-icon"
                    className="plus-icon add-project group hover:border-primary-200 hover:bg-primary-200/80 hover:text-primary-900 relative shrink-0 cursor-pointer rounded-lg border border-transparent p-1 text-slate-700 transition-all duration-200"
                    title="Add project"
                    onClick={() => setProjectModalOpen(true)}
                  >
                    <Plus size={18} />
                  </button>
                </Can>
              }
            >
              <ul
                id="projectsDropdown"
                className={`mt-3 ml-5 flex flex-col gap-3 border-l border-slate-300/80 pl-3 transition-all duration-300 ${
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

          <LogoutButton collapsed={collapsed && !mobileOpen} />
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
