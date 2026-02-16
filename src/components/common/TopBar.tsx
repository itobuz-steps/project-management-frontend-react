import { Plus, FunnelX } from 'lucide-react';
import type { ViewMode, TopBarProps } from '../../types/TopBar.types';
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { PRIORITIES } from '../taskModal/constants';
import SearchBar from '../navbar/SearchBar';
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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { columns } = useProject();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    'status' | 'priority' | null
  >(null);

  const isFilterableView = useMemo(() => {
    const path = location.pathname;
    return (
      path.endsWith('/backlog') ||
      path.endsWith('/board') ||
      path.endsWith('/list')
    );
  }, [location.pathname]);

  const statusOptions = useMemo(() => {
    if (columns && columns.length > 0) {
      return columns;
    }

    return ['todo', 'in-progress', 'done'];
  }, [columns]);

  const updateFilterParam = (key: 'status' | 'priority', value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
  };
  return (
    <>
      <header className="bg-primary-50 rounded-lg border border-gray-100 p-2 shadow-sm md:p-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-xl">
          {projectName ?? 'No project selected'}
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT: View Switcher */}
          <SearchBar />
          <div className="flex w-full flex-wrap items-center gap-1 rounded-md border border-gray-200 bg-white p-1 inset-shadow-sm/25 inset-shadow-gray-500 sm:w-auto">
            {views.map((view) => {
              return (
                <NavLink
                  to={view.value}
                  key={view.value}
                  onClick={() => navigate(view.value)}
                  className={({ isActive }) => {
                    return [
                      'flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition sm:flex-none sm:px-3.5',
                      isActive
                        ? 'bg-primary-400 text-white shadow-sm'
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
              className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-3.5 py-2 text-sm font-medium text-white sm:w-auto"
            >
              Add task
              <Plus className="mb-0.5 ml-1 inline-block h-4 w-4" />
            </button>
            {/* Filters */}
            {isFilterableView && (
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsFiltersOpen((prev) => !prev);
                    onOpenFilters();
                  }}
                  className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:w-auto"
                >
                  Filters
                </button>
                {isFiltersOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                    <button
                      onClick={() => setActiveFilter('status')}
                      className={`${activeFilter === 'status' ? 'bg-gray-100' : ''} w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100`}
                    >
                      Status
                    </button>
                    <button
                      onClick={() => setActiveFilter('priority')}
                      className={`${activeFilter === 'priority' ? 'bg-gray-100' : ''} w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100`}
                    >
                      Priority
                    </button>
                    {activeFilter === 'status' && (
                      <div className="mt-2">
                        <select
                          value={searchParams.get('status') || ''}
                          onChange={(event) =>
                            updateFilterParam('status', event.target.value)
                          }
                          className="focus:border-primary-500 w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
                        >
                          <option value="">All</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {activeFilter === 'priority' && (
                      <div className="mt-2">
                        <select
                          value={searchParams.get('priority') || ''}
                          onChange={(event) =>
                            updateFilterParam('priority', event.target.value)
                          }
                          className="focus:border-primary-500 w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
                        >
                          <option value="">All</option>
                          {PRIORITIES.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
