import { useEffect, useState } from 'react';
import TopBar from '../components/common/TopBar';
import type { ViewMode } from '../types/TopBar.types';
import type { Project } from '../types/project.types';
import { Outlet, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../components/api/interceptor';
import { useProject } from '../context/ProjectContext';
import { setupPushNotifications } from '../utils/setupNotification';

function Dashboard() {
  const { setProject } = useProject();
  const { projectId } = useParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const activeProject = projects.find((p) => p._id === projectId);

  useEffect(() => {
    fetchWithAuth<Project[]>('/project')
      .then((projects) => {
        setProjects(projects);

        const active = projects.find((p) => p._id === projectId);

        setProject(active);
      })
      .catch(() => {
        setProjects([]);
        setProject(undefined);
      });
  }, [projectId, setProject]);

  useEffect(() => {
    setupPushNotifications();
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>('backlog');

  return (
    <div className="min-h-screen">
      <TopBar
        projectName={activeProject?.name}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onAddTask={() => alert('Add task clicked')}
        onOpenFilters={() => alert('Open filters')}
        onClearFilters={() => alert('Clear filters')}
        hasActiveFilters={true}
        activeUsers={[]}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
