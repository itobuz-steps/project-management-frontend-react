import Notifications from './Notifications';
import { CommandPalette } from '../common/CommandPalette';
import {
  SearchOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Tag } from 'antd';
import { Users, Bell } from 'lucide-react';
import { Can } from '../../utils/PermissionHoc';
import { InviteUserContainer } from '../common/InviteUserContainer';
import { ProjectMembersModal } from '../common/ProjectMembersModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';

export default function Navbar() {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleMemberModalClose = () => {
    setIsMembersOpen(false);
  };

  return (
    <div className="header border border-gray-50 bg-gray-100">
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
                <h2 className="topbar-project-header inline items-center text-lg! font-semibold text-gray-900 sm:text-xl">
                  {project?.name}
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
                {project.projectType}
              </Tag>
            )}
          </div>
        </div>
        {/* Hamburger — mobile only */}
        <button
          className="flex items-center justify-center p-1 text-gray-900 sm:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          <MenuOutlined style={{ fontSize: '1.2rem' }} />
        </button>

        {/* Icon row — desktop only */}
        <div className="hidden items-center gap-3 sm:flex sm:justify-end sm:gap-4">
          {project && !projectInfoHidden && (
            <div className="flex items-center gap-1 sm:justify-end">
              <Can permission="SEND_INVITE">
                <InviteUserContainer />
              </Can>
            </div>
          )}

          {project && !projectInfoHidden && (
            <button
              onClick={() => setIsMembersOpen(true)}
              title="View Members"
              className="flex items-center justify-center text-gray-900 hover:text-gray-900"
            >
              <Users className="h-6 w-6" />
            </button>
          )}

          <ProjectMembersModal
            open={isMembersOpen}
            onClose={handleMemberModalClose}
          />

          <SearchOutlined
            onClick={handleSearchClick}
            style={{ fontSize: '1.5rem' }}
          />
          <Notifications />
          {!projectInfoHidden && (
            <SettingOutlined
              onClick={() => navigate(`project/${project?._id}/settings`)}
              style={{ fontSize: '1.5rem' }}
            />
          )}
        </div>
      </nav>
      {/* Mobile collapsible panel */}
      {mobileMenuOpen && (
        <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-100 px-4 py-3 sm:hidden">
          {/* Invite — close panel then open modal */}
          {project && !projectInfoHidden && (
            <Can permission="SEND_INVITE">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInviteOpen(true);
                }}
                className="flex items-center gap-2 text-gray-900"
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">Invite Users</span>
              </button>
            </Can>
          )}

          {/* Notifications — close panel then open dropdown */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setNotifOpen(true);
            }}
            className="flex items-center gap-2 text-gray-900"
          >
            <Bell className="h-5 w-5" />
            <span className="text-sm">Notifications</span>
          </button>

          {/* Members — close panel first */}
          {project && !projectInfoHidden && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsMembersOpen(true);
              }}
              className="flex items-center gap-2 text-gray-900"
            >
              <Users className="h-5 w-5" />
              <span className="text-sm">Members</span>
            </button>
          )}

          {/* Search — close panel first */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleSearchClick();
            }}
            className="flex items-center gap-2 text-gray-900"
          >
            <SearchOutlined style={{ fontSize: '1.2rem' }} />
            <span className="text-sm">Search</span>
          </button>

          {/* Settings — close panel first */}
          {!projectInfoHidden && (
            <Can permission="PROJECT_SETTINGS">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(`project/${project?._id}/settings`);
                }}
                className="flex items-center gap-2 text-gray-900"
              >
                <SettingOutlined style={{ fontSize: '1.2rem' }} />
                <span className="text-sm">Settings</span>
              </button>
            </Can>
          )}
        </div>
      )}

      {/* Always-mounted controlled instances for mobile triggers */}
      <InviteUserContainer open={inviteOpen} onOpenChange={setInviteOpen} />
      {notifOpen && (
        <div className="fixed top-14 right-2 z-50 sm:hidden">
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
