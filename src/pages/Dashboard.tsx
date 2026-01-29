import { useEffect, useState } from 'react';
import TopBar from '../components/common/TopBar';
import type { ViewMode } from '../types/TopBar.types';
import BacklogView from '../components/views/BacklogView';
import BoardView from '../components/views/BoardView';
import ListView from '../components/views/ListView';
import type { Project } from '../types/project.types';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../components/api/interceptor';
import { useProject } from '../context/ProjectContext';
import { setupPushNotifications } from '../utils/setupNotification';
import { ForYouPage } from './ForYouPage';
import { AddTaskModal } from '../utils/addTaskModal';

function Dashboard() {
  const { setProject } = useProject();
  const { projectId } = useParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const activeProject = projects.find((p) => p._id === projectId);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

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
        onAddTask={() => setIsAddTaskOpen(true)}
        onOpenFilters={() => alert('Open filters')}
        onClearFilters={() => alert('Clear filters')}
        hasActiveFilters={true}
        activeUsers={[]}
      />
      <AddTaskModal
        open={isAddTaskOpen}
        task={{}}
        onClose={() => setIsAddTaskOpen(false)}
        onCreate={() => setIsAddTaskOpen(false)}
      />
      <main>
        {viewMode === 'backlog' && (
          <BacklogView columns={activeProject?.columns || []} />
        )}
        {viewMode === 'board' && <BoardView />}
        {viewMode === 'list' && <ListView />}
        {viewMode === 'forYou' && <ForYouPage />}
      </main>
    </div>
  );
}

export default Dashboard;
