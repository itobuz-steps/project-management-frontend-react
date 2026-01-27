import { useEffect, useState } from 'react';
import TopBar from '../components/common/TopBar';
import type { ViewMode } from '../types/TopBar.types';
import BacklogView from '../components/views/BacklogView';
import BoardView from '../components/views/BoardView';
import ListView from '../components/views/ListView';
import type { Project } from '../types/project.types';
import { useSearchParams } from 'react-router-dom';
import { fetchWithAuth } from '../components/api/interceptor';
import { useProject } from '../context/ProjectContext';

function Dashboard() {
  const { setProject } = useProject();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

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

  const [viewMode, setViewMode] = useState<ViewMode>('backlog');

  return (
    <div className="min-h-screen bg-gray-50">
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
      <main className="p-2">
        {viewMode === 'backlog' && (
          <BacklogView columns={activeProject?.columns || []} />
        )}
        {viewMode === 'board' && <BoardView />}
        {viewMode === 'list' && <ListView />}
      </main>
    </div>
  );
}

export default Dashboard;
