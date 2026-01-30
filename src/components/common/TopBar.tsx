import { Plus, FunnelX } from 'lucide-react';
import type { ViewMode, TopBarProps } from '../../types/TopBar.types';
import { NavLink, useNavigate } from 'react-router-dom';
// import AvatarGroup from '../AvatarGroup/AvatarGroup';

const views: { label: string; value: ViewMode }[] = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Board', value: 'board' },
  { label: 'List', value: 'list' },
];

function TopBar({
  onAddTask,
  onOpenFilters,
  onClearFilters,
  hasActiveFilters,
  projectName,
}: TopBarProps) {
  const navigate = useNavigate();
  return (
    <>
      <header className="mb-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-xl">
          {projectName ?? 'No project selected'}
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT: View Switcher */}
          <div className="flex w-full flex-wrap items-center gap-1 rounded-md bg-gray-100 p-1 sm:w-auto">
            {views.map((view) => {
              return (
                <NavLink
                  to={view.value}
                  key={view.value}
                  onClick={() => navigate(view.value)}
                  className={({ isActive }) => {
                    return [
                      'flex-1 rounded-md px-3 py-2 text-sm font-medium transition sm:flex-none sm:px-3.5',
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800',
                    ].join(' ');
                  }}
                >
                  {view.label}
                </NavLink>
              );
            })}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            {/* Add Task */}
            <button
              onClick={onAddTask}
              className="w-full rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
            >
              Add task
              <Plus className="mb-0.5 ml-1 inline-block h-4 w-4" />
            </button>
            {/* Filters */}
            <button
              onClick={onOpenFilters}
              className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:w-auto"
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
