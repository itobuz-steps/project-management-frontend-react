import { Plus, FunnelX } from 'lucide-react';
import type { ViewMode, TopBarProps } from '../../types/TopBar.types';
// import AvatarGroup from '../AvatarGroup/AvatarGroup';

const views: { label: string; value: ViewMode }[] = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Board', value: 'board' },
  { label: 'List', value: 'list' },
];
const projects: { id: string; name: string }[] = [
  { id: '1', name: 'Project A' },
  { id: '2', name: 'Project B' },
  { id: '3', name: 'Project C' },
];

function TopBar({
  viewMode,
  onViewChange,
  onAddTask,
  onOpenFilters,
  onClearFilters,
  hasActiveFilters,
  activeUsers,
}: TopBarProps) {
  return (
    <>
      <header className="mb-3 border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Project A</h2>
        <div className="flex items-center justify-between">
          {/* LEFT: View Switcher */}
          <div className="flex items-center gap-1 rounded-md bg-gray-100 p-1">
            {views.map((view) => {
              const isActive = viewMode === view.value;

              return (
                <button
                  key={view.value}
                  onClick={() => onViewChange(view.value)}
                  className={[
                    'rounded-md px-3.5 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800',
                  ].join(' ')}
                >
                  {view.label}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
            {/* Add Task */}
            <button
              onClick={onAddTask}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add task
              <Plus className="mb-0.5 ml-1 inline-block h-4 w-4" />
            </button>
            {/* Filters */}
            <button
              onClick={onOpenFilters}
              className="rounded-md border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Filters
            </button>
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                title="Clear all filters"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <FunnelX className="h-5 w-5" />
              </button>
            )}
            {/* Active Users */}
            {/* <AvatarGroup users={activeUsers} /> */}
          </div>
        </div>
      </header>
    </>
  );
}

export default TopBar;
