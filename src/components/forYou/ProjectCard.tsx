import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project.types';
import { ChevronRight } from 'lucide-react';
import { THEME_COLORS } from '../../config/constants';
import { useColorMode } from '../../hooks/useColorMode';
import { ProjectMembersModal } from '../common/ProjectMembersModal';
import { fallbackProjectIcons } from '../../config/constants';
import { Avatar } from 'antd';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';

export function ProjectCard({ project }: { project: Project }) {
  const { members: users = [] } = useProjectMetaData(project._id);

  const resolvedMembers = project.members
    .map((m) => users.find((u) => String(u._id) === String(m.user)))
    .filter((user): user is NonNullable<typeof user> => Boolean(user));

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => {
    // Set random fallback image on mount if no project icon
    if (project.icon) {
      return project.icon;
    }

    // Check if we already have a stored fallback for this project
    const storedFallback = localStorage.getItem(`fallback-icon-${project._id}`);
    if (storedFallback) {
      return storedFallback;
    }

    // Pick a random fallback and save it
    const randomFallback =
      fallbackProjectIcons[
        Math.floor(Math.random() * fallbackProjectIcons.length)
      ];
    localStorage.setItem(`fallback-icon-${project._id}`, randomFallback);
    return randomFallback;
  });

  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const [colorMode] = useColorMode();
  const isDark = colorMode === 'dark';
  const themeColors = THEME_COLORS[project.theme] ?? THEME_COLORS['indigo'];
  const accentColor = isDark ? themeColors[5] : themeColors[4];
  const backgroundColor = isDark ? themeColors[10] : themeColors[0];

  function handleClick() {
    navigate(`/project/${project._id}`);
  }

  const handleImageError = () => {
    if (!imageError) {
      // Load different random fallback image on error
      const randomFallback =
        fallbackProjectIcons[
          Math.floor(Math.random() * fallbackProjectIcons.length)
        ];
      setImageSrc(randomFallback);
      setImageError(true);
    }
  };

  const iconElement = (
    <img
      src={imageSrc}
      alt={project.name}
      className="h-12 w-12 rounded-lg object-cover shadow-sm"
      onError={handleImageError}
    />
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="group relative w-full min-w-0 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ease-out hover:shadow-xl"
      style={{
        backgroundColor,
        borderColor: isDark ? themeColors[7] : '#e5e7eb',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: isDark
            ? `radial-gradient(circle at 100% 0%, ${accentColor}22, transparent 70%)`
            : `radial-gradient(circle at 100% 0%, ${accentColor}08, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      <div className="relative flex flex-col gap-3.5 p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="shrink-0">{iconElement}</div>
            <div className="min-w-0 flex-1">
              <h3
                className="truncate text-base leading-tight font-semibold"
                style={{
                  color: isDark ? '#f1f5f9' : '#111827',
                }}
              >
                {project.name}
              </h3>
              <p
                className="mt-0.5 text-xs"
                style={{ color: isDark ? '#9ca3b8' : '#6b7280' }}
              >
                {project.projectType.charAt(0).toUpperCase() +
                  project.projectType.slice(1)}{' '}
                Project
              </p>
            </div>
          </div>

          <div className="shrink-0">
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

        <div className="h-px bg-linear-to-r from-gray-200 via-gray-100 to-transparent dark:from-slate-700 dark:via-slate-600 dark:to-transparent" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMembersModal(true);
          }}
          className="group/btn flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-200"
          style={{
            backgroundColor: isHovered
              ? isDark
                ? themeColors[8]
                : themeColors[2]
              : 'transparent',
          }}
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
            {resolvedMembers
              .slice(0, project.members.length)
              .map((user, index) => {
                const hasImage = user?.profileImage;

                return (
                  <Avatar
                    key={user._id}
                    src={hasImage}
                    style={{
                      backgroundColor: hasImage
                        ? undefined
                        : themeColors[index % themeColors.length],
                      height: '28px',
                      width: '28px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}
                  >
                    {!hasImage &&
                      (user.name?.charAt(0)?.toUpperCase() ||
                        user.email?.charAt(0)?.toUpperCase())}
                  </Avatar>
                );
              })}
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

        <ProjectMembersModal
          open={showMembersModal}
          onClose={() => setShowMembersModal(false)}
          project={project}
        />
      </div>

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
