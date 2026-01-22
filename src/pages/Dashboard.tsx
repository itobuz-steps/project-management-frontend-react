import { useState } from 'react';
import TopBar from '../components/common/TopBar';
import type { ViewMode } from '../types/TopBar.types';
import BacklogView from '../components/views/BacklogView';
import BoardView from '../components/views/BoardView';
import ListView from '../components/views/ListView';

function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('backlog');

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        viewMode={viewMode}
        onViewChange={setViewMode}
        onAddTask={() => alert('Add task clicked')}
        onOpenFilters={() => alert('Open filters')}
        onClearFilters={() => alert('Clear filters')}
        hasActiveFilters={true}
        activeUsers={[]}
      />
      <main className="p-6">
        {viewMode === 'backlog' && <BacklogView />}
        {viewMode === 'board' && <BoardView />}
        {viewMode === 'list' && <ListView />}
      </main>
    </div>
  );
}

export default Dashboard;
