import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';
import SidebarSubItem from './SidebarSubItem';
import InviteSection from './InviteSection';
import LogoutButton from './LogoutButton';

import { User, FolderKanban, Users, Plus } from 'lucide-react';
import type { Props } from '../../types/sidebar.types';

export default function Sidebar({ collapsed }: Props) {
  return (
    <aside
      id="sidebar"
      className={`sidebar collapsed absolute z-17 h-full bg-white text-black shadow-lg md:static ${
        collapsed ? 'collapsed w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col gap-5 overflow-y-auto px-3 py-4 transition-all">
        <ul className="mt-16 flex flex-col gap-2 font-semibold">
          {/* FOR YOU */}
          <SidebarItem
            id="foryouMenu"
            buttonId="forYouButton"
            label="For you"
            icon={<User size={25} />}
            collapsed={collapsed}
          />

          {/* PROJECTS */}
          <SidebarGroup
            id="projectsMenu"
            label="Projects"
            icon={<FolderKanban size={25} />}
            collapsed={collapsed}
            action={
              <div
                id="plus-icon"
                className="plus-icon add-project group hover:bg-primary-300 relative cursor-pointer rounded p-0.5"
              >
                <Plus size={20} className="stroke-black" />
                <span className="invisible absolute -left-1 mt-2 w-max -translate-x-1/2 rounded bg-black p-1 text-xs text-white opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100">
                  Add project
                </span>
              </div>
            }
          >
            <ul
              id="projectsDropdown"
              className="mt-2 ml-4 hidden flex-col gap-1 border-l border-gray-200 pl-2"
            >
              <SidebarSubItem label="Project Alpha" />
              <SidebarSubItem label="Project Beta" />
            </ul>
          </SidebarGroup>

          {/* USERS */}
          <SidebarItem
            id="usersMenu"
            label="Users"
            icon={<Users size={25} />}
            collapsed={collapsed}
          />

          {/* INVITE */}
          <InviteSection collapsed={collapsed} />
        </ul>

        <LogoutButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
