import { Plus, FunnelX } from 'lucide-react';
import type { ViewMode, TopBarProps } from '../../types/TopBar.types';
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { PRIORITIES } from '../taskModal/constants';
import SearchBar from '../navbar/SearchBar';
import { InviteUserContainer } from './InviteUserContainer';
import { Can } from '../../utils/PermissionHoc';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { UserCell } from '../ui/UserCell';
import { Select } from 'antd';

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
  const { project } = useProject(); // Ensure `project` is defined
  const { columns, members, loadingMembers } = useProjectMetaData(project?._id);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    'status' | 'priority' | 'assignee' | null
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

  const updateFilterParam = (
    key: 'status' | 'priority' | 'assignee',
    value: string
  ) => {
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
      <header className="bg-primary-50 flex flex-col gap-2 rounded-lg border border-gray-100 p-2 shadow-sm sm:gap-3 md:p-4">
        {/* TOP ROW */}
        <div className="flex flex-col gap-3 text-start sm:flex-row sm:items-center sm:justify-between">
          <div className="flex">
            <h2 className="topbar-project-header flex items-center text-lg font-semibold text-gray-900 sm:text-xl">
              {projectName ?? 'No project selected'}
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:justify-end">
            <Can permission="SEND_INVITE">
              <InviteUserContainer />
            </Can>

            <Can permission="PROJECT_SETTINGS">
              <button
                onClick={() => navigate('settings')}
                className="flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-[var(--color-primary-200)]"
                title="Project Settings"
              >
                <SettingOutlined style={{ fontSize: '18px' }} />
              </button>
            </Can>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-stretch gap-3 lg:flex-row">
            <SearchBar />

            <div className="flex w-full flex-wrap items-center gap-1 rounded-md border border-gray-200 bg-white p-1 inset-shadow-sm/25 inset-shadow-gray-500 sm:w-auto">
              {views.map((view) => (
                <NavLink
                  to={view.value}
                  key={view.value}
                  onClick={() => navigate(view.value)}
                  className={({ isActive }) =>
                    [
                      'w-20 flex-1 rounded-md px-3.5 py-2 text-center text-sm font-medium transition sm:flex-none',
                      isActive
                        ? 'bg-primary-400 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-800',
                    ].join(' ')
                  }
                >
                  {view.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex w-full flex-col flex-wrap items-end gap-3 sm:w-auto lg:flex-row">
            {/* ADD TASK */}
            <button
              onClick={onAddTask}
              className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-5 py-2.5 text-sm font-medium text-white sm:w-auto"
            >
              Add task
              <Plus className="mb-0.5 ml-1 inline-block h-4 w-4" />
            </button>

            {/* FILTERS */}
            {isFilterableView && (
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsFiltersOpen((prev) => !prev);
                    onOpenFilters();
                  }}
                  className="w-full rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:w-auto"
                >
                  Filters
                </button>

                {isFiltersOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                    {/* Filter buttons */}
                    <button
                      onClick={() => setActiveFilter('status')}
                      className={`${
                        activeFilter === 'status' ? 'bg-gray-100' : ''
                      } w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100`}
                    >
                      Status
                    </button>

                    <button
                      onClick={() => setActiveFilter('priority')}
                      className={`${
                        activeFilter === 'priority' ? 'bg-gray-100' : ''
                      } w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100`}
                    >
                      Priority
                    </button>

                    <button
                      onClick={() => setActiveFilter('assignee')}
                      className={`${
                        activeFilter === 'assignee' ? 'bg-gray-100' : ''
                      } w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100`}
                    >
                      Assignee
                    </button>

                    {/* STATUS SELECT */}
                    {activeFilter === 'status' && (
                      <div className="mt-2">
                        <Select
                          value={searchParams.get('status') || ''}
                          onChange={(value) =>
                            updateFilterParam('status', value || '')
                          }
                          className="focus:border-primary-500 w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
                        >
                          <option value="">All</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}

                    {/* PRIORITY SELECT */}
                    {activeFilter === 'priority' && (
                      <div className="mt-2">
                        <Select
                          value={searchParams.get('priority') || ''}
                          onChange={(value) =>
                            updateFilterParam('priority', value || '')
                          }
                          className="focus:border-primary-500 w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
                        >
                          <option value="">All</option>
                          {PRIORITIES.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}

                    {/* ASSIGNEE SELECT */}
                    {activeFilter === 'assignee' && (
                      <div className="mt-2">
                        <Select
                          className="focus:border-primary-500 w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
                          loading={loadingMembers}
                          placeholder="All"
                          allowClear
                          value={searchParams.get('assignee') || undefined}
                          onChange={(value) =>
                            updateFilterParam('assignee', value || '')
                          }
                          options={members.map((member) => ({
                            value: member._id,
                            label: (
                              <UserCell user={member} emptyText="Unassigned" />
                            ),
                          }))}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CLEAR FILTERS */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                title="Clear all filters"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <FunnelX className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default TopBar;
