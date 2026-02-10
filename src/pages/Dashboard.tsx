import { useEffect, useState } from 'react';
import TopBar from '../components/common/TopBar';
import type { ViewMode } from '../types/TopBar.types';
import type { Project } from '../types/project.types';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { setupPushNotifications } from '../utils/setupNotification';
import { AddTaskModal } from '../utils/addTaskModal';
import { getAllProjects } from '../services/projectService';

function Dashboard() {
  const { setProject } = useProject();
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const activeProject = projects.find((p) => p._id === projectId);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  useEffect(() => {
    getAllProjects()
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
  const hasActiveFilters = Boolean(
    searchParams.get('status') || searchParams.get('priority')
  );

  const handleClearFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('status');
      next.delete('priority');
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col gap-1 md:gap-3">
      <TopBar
        projectName={activeProject?.name}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onAddTask={() => setIsAddTaskOpen(true)}
        onOpenFilters={() => {}}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        activeUsers={[]}
      />
      <AddTaskModal
        open={isAddTaskOpen}
        task={{}}
        onClose={() => setIsAddTaskOpen(false)}
        onCreate={() => setIsAddTaskOpen(false)}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
