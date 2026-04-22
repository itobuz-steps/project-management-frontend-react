import { useEffect, useState } from 'react';
import TopBar from '../components/common/TopBar';
import type { Project } from '../types/project.types';
import { Outlet, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { setupPushNotifications } from '../utils/setupNotification';
import { getAllProjects } from '../services/projectService';
import userService from '../services/userService';
import { useAuthContext } from '../context/AuthContext';
import { message } from 'antd';
import { Tag } from 'antd';
import { getWorkspaces } from '../services/workspaceService';
import { normalizeAndCapitalize } from '../utils/utils';
import { fallbackProjectIcons } from '../config/constants';

function Dashboard() {
  const { setProject } = useProject();
  const { setRole } = useAuthContext();

  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [projectIcon, setProjectIcon] = useState<string>('');
  const activeProject = projects.find((p) => p._id === projectId);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projects = await getAllProjects();
        const userInfo = await userService.getUserInfo();
        setProjects(projects);

        const active = projects.find((project) => project._id === projectId);
        setProject(active);

        const memberRole = active?.members.find(
          (member) => member.user === userInfo.result._id
        )?.role;

        if (userInfo.result.role === 'superadmin') {
          setRole('superadmin');
        } else if (memberRole) {
          setRole(memberRole);
        }
      } catch {
        message.error('Failed to load projects');
        setProjects([]);
        setProject(undefined);
      }
    }
    fetchProjects();
  }, [projectId, setProject, setRole]);

  useEffect(() => {
    setupPushNotifications();
  }, []);

  useEffect(() => {
    const loadProjectIcon = async () => {
      if (!activeProject) {
        setProjectIcon('');
        return;
      }

      // If project has an icon, use it
      if (activeProject.icon) {
        setProjectIcon(activeProject.icon);
        return;
      }

      // Check if we already have a stored fallback for this project
      const storedFallback = localStorage.getItem(
        `fallback-icon-${activeProject._id}`
      );
      if (storedFallback) {
        setProjectIcon(storedFallback);
        return;
      }

      // Pick a random fallback and save it
      const randomFallback =
        fallbackProjectIcons[
          Math.floor(Math.random() * fallbackProjectIcons.length)
        ];
      localStorage.setItem(
        `fallback-icon-${activeProject._id}`,
        randomFallback
      );
      setProjectIcon(randomFallback);
    };

    loadProjectIcon();
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject?.workspaceId) {
      return;
    }

    const resolveWorkspaceName = async () => {
      try {
        const response = await getWorkspaces();
        const matchedWorkspace = response.result?.find(
          (workspace) => workspace.workspaceId === activeProject.workspaceId
        );
        setWorkspaceName(matchedWorkspace?.workspaceName || '');
      } catch (error) {
        console.error('Failed to resolve workspace name:', error);
        setWorkspaceName('');
      }
    };

    resolveWorkspaceName();
  }, [activeProject?.workspaceId]);

  return (
    <div className="flex min-h-screen flex-col gap-1 md:gap-3">
      {activeProject && (
        <div className="px-3 py-2 dark:bg-[#28282b]">
          <div className="flex flex-wrap items-center gap-2">
            {projectIcon && (
              <img
                src={projectIcon}
                alt="project icon"
                className="inline h-5 w-5 rounded object-cover"
              />
            )}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
              <span className="text-gray-500 dark:text-gray-400">
                {workspaceName} /
              </span>{' '}
              {activeProject.name}
            </h1>
            {activeProject.projectType && (
              <Tag
                style={{
                  backgroundColor: 'var(--color-primary-400)',
                  color: '#fff',
                  textTransform: 'capitalize',
                  paddingInline: '0.35rem',
                  lineHeight: 1.5,
                }}
              >
                {normalizeAndCapitalize(activeProject.projectType)}
              </Tag>
            )}
          </div>
        </div>
      )}
      <TopBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
