import SidebarGroup from './SidebarGroup';
import LogoutButton from './LogoutButton';
import { FolderKanban, Plus, Menu, X } from 'lucide-react';
import SidebarProjectsDropdown from './SidebarProjectDropdown';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-md md:hidden"
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
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        id="sidebar"
        className={`fixed z-50 h-full bg-white text-black shadow-lg transition-all duration-300 ease-in-out md:static md:z-auto ${
          mobileOpen ? 'left-0 w-64' : '-left-64 w-64 md:left-0'
        } ${collapsed ? 'md:w-16' : 'md:w-64'} `}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1 hover:bg-gray-100 md:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="flex h-full flex-col gap-5 overflow-x-hidden overflow-y-auto px-3 py-4">
          <ul className="mt-10 flex flex-col gap-2 font-semibold md:mt-4">
            {/* PROJECTS */}
            <SidebarGroup
              id="projectsMenu"
              label="Projects"
              icon={<FolderKanban size={20} className="shrink-0" />}
              collapsed={collapsed && !mobileOpen}
              action={
                <div
                  id="plus-icon"
                  className="plus-icon add-project group hover:bg-primary-300 relative shrink-0 cursor-pointer rounded p-0.5"
                  title="Add project"
                >
                  <Plus size={20} className="stroke-black" />
                </div>
              }
            >
              <ul
                id="projectsDropdown"
                className={`mt-2 ml-4 flex flex-col gap-1 border-l border-gray-200 pl-2 transition-all duration-300 ${
                  collapsed && !mobileOpen
                    ? 'h-0 overflow-hidden opacity-0'
                    : 'h-auto opacity-100'
                }`}
              >
                <SidebarProjectsDropdown collapsed={collapsed && !mobileOpen} />
              </ul>
            </SidebarGroup>
          </ul>

          <LogoutButton collapsed={collapsed && !mobileOpen} />
        </div>
      </aside>
    </>
  );
}
