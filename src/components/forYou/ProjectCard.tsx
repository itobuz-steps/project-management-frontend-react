import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project.types';
import { Avatar } from 'antd';
import { User, ChevronRight } from 'lucide-react';
import { THEME_COLORS } from '../../config/constants';
import { ProjectMembersModal } from '../common/ProjectMembersModal';

export function ProjectCard({ project }: { project: Project }) {
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const theme = localStorage.getItem('lastProjectTheme') || 'indigo';
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];
  const accentColor = themeColors[4];

  function handleClick() {
    navigate(`/project/${project._id}`);
  }

  const iconElement = project.icon ? (
    <img
      src={project.icon}
      alt={project.name}
      className="h-12 w-12 rounded-lg object-cover shadow-sm"
    />
  ) : (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-lg text-base font-bold text-white shadow-sm"
      style={{ backgroundColor: accentColor }}
    >
      {project.name.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="group relative min-w-0 w-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 ease-out hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Animated background gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${accentColor}08, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      <div className="relative flex flex-col gap-3.5 p-5 pb-4">
        {/* Header Section - Icon + Title + Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex-shrink-0">{iconElement}</div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base leading-tight font-semibold text-gray-900 dark:text-slate-100">
                {project.name}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                {project.projectType.charAt(0).toUpperCase() +
                  project.projectType.slice(1)}{' '}
                Project
              </p>
            </div>
          </div>

          {/* Type Badge - Repositioned */}
          <div className="flex-shrink-0">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white"
              style={{
                backgroundColor: accentColor,
                opacity: 0.9,
              }}
            >
              {project.prefix}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent dark:from-slate-700 dark:via-slate-600 dark:to-transparent" />

        {/* Members Section */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMembersModal(true);
          }}
          className="group/btn flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
        >
          <Avatar.Group
            max={{
              count: 3,
              style: {
                color: '#fff',
                backgroundColor: accentColor,
                height: '28px',
                width: '28px',
                fontSize: '11px',
                fontWeight: '600',
              },
            }}
          >
            {project.members.slice(0, 5).map((member, index) => (
              <Avatar
                key={member._id}
                style={{
                  backgroundColor: themeColors[index % themeColors.length],
                  height: '28px',
                  width: '28px',
                  fontSize: '11px',
                  fontWeight: '600',
                }}
              >
                <User size={14} color="#fff" />
              </Avatar>
            ))}
          </Avatar.Group>
          <span className="flex-1 text-left text-sm text-gray-600 dark:text-slate-400">
            {project.members.length === 1
              ? '1 member'
              : `${project.members.length} members`}
          </span>
          <ChevronRight
            size={16}
            className="text-gray-400 transition-transform duration-200 group-hover/btn:translate-x-0.5 dark:text-slate-500"
          />
        </button>

        {/* Members Modal */}
        <ProjectMembersModal
          open={showMembersModal}
          onClose={() => setShowMembersModal(false)}
        />
      </div>

      {/* Bottom accent line - animated on hover */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out"
        style={{
          width: isHovered ? '100%' : '0%',
          backgroundColor: accentColor,
        }}
      />
    </div>
  );
}
