import { Plus, FunnelX } from 'lucide-react';
import type { ViewMode, TopBarProps } from '../../types/TopBar.types';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ProjectMembersModal } from './ProjectMembersModal';
import { useProject } from '../../context/ProjectContext';
import { PRIORITIES, TASK_TYPES } from '../taskModal/constants';
import SearchBar from '../navbar/SearchBar';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { UserCell } from '../ui/UserCell';
import { Select, Tabs } from 'antd';

function TopBar({
  onAddTask,
  onOpenFilters,
  onClearFilters,
  hasActiveFilters,
}: TopBarProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { project } = useProject();
  const { columns, members, loadingMembers } = useProjectMetaData(project?._id);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    'status' | 'priority' | 'assignee' | 'type' | null
  >(null);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const type = project?.projectType;
  const isScrum = type === 'scrum';

  const views: { label: string; value: ViewMode }[] = useMemo(() => {
    const base: { label: string; value: ViewMode }[] = [
      { label: 'Backlog', value: 'backlog' },
      { label: 'Board', value: 'board' },
      { label: 'List', value: 'list' },
    ];

    if (isScrum) {
      base.push({ label: 'Sprints', value: 'sprints-overview' });
      base.push({ label: 'Timeline', value: 'timeline' });
    }

    return base;
  }, [isScrum]);

  const isFilterableView = useMemo(() => {
    const path = location.pathname;
    return (
      path.endsWith('/backlog') ||
      path.endsWith('/board') ||
      path.endsWith('/sprints-overview') ||
      path.endsWith('/timeline')
    );
  }, [location.pathname]);

  const statusOptions = useMemo(() => {
    if (columns && columns.length) {
      return columns;
    }

    return ['todo', 'in-progress', 'done'];
  }, [columns]);

  const updateFilterParam = (
    key: 'status' | 'priority' | 'assignee' | 'type',
    value: string | string[]
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const joined = Array.isArray(value) ? value.join(',') : value;
      if (joined) {
        next.set(key, joined);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const activeView = useMemo(() => {
    const matched = views.find((view) =>
      location.pathname.endsWith(`/${view.value}`)
    );
    return matched?.value;
  }, [location.pathname, views]);

  const tabItems = useMemo(
    () =>
      views.map((view) => ({
        key: view.value,
        label: (
          <NavLink
            to={view.value}
            className="text-sm font-medium transition"
            style={{ color: 'inherit' }}
          >
            {view.label}
          </NavLink>
        ),
      })),
    [views]
  );

  const getFilterValues = (
    key: 'status' | 'priority' | 'assignee' | 'type'
  ) => {
    const raw = searchParams.get(key);
    if (!raw) {
      return [];
    }
    return raw.split(',').filter(Boolean);
  };
  return (
    <>
      <header className="flex flex-col gap-2 sm:gap-3">
        {/* BOTTOM ROW */}
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-stretch gap-3 lg:flex-row">
            <SearchBar />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex w-full flex-col flex-wrap items-end gap-3 sm:w-auto sm:flex-row">
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
                  className="w-full rounded-md border border-gray-300 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100 sm:w-auto dark:border-[#27272e] dark:text-slate-200 dark:hover:bg-[#27272e]"
                >
                  Filters
                </button>

                {isFiltersOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-[#27272e] dark:bg-[#1b1b1f]">
                    {/* Filter buttons */}
                    <button
                      onClick={() => setActiveFilter('status')}
                      className={`${
                        activeFilter === 'status'
                          ? 'bg-gray-100 dark:bg-[#27272e]'
                          : ''
                      } w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-[#27272e]`}
                    >
                      Status
                    </button>

                    <button
                      onClick={() => setActiveFilter('priority')}
                      className={`${
                        activeFilter === 'priority'
                          ? 'bg-gray-100 dark:bg-[#27272e]'
                          : ''
                      } w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-[#27272e]`}
                    >
                      Priority
                    </button>

                    <button
                      onClick={() => setActiveFilter('assignee')}
                      className={`${
                        activeFilter === 'assignee'
                          ? 'bg-gray-100 dark:bg-[#27272e]'
                          : ''
                      } w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-[#27272e]`}
                    >
                      Assignee
                    </button>

                    <button
                      onClick={() => setActiveFilter('type')}
                      className={`${
                        activeFilter === 'type'
                          ? 'bg-gray-100 dark:bg-[#27272e]'
                          : ''
                      } w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-[#27272e]`}
                    >
                      Type
                    </button>

                    {/* STATUS SELECT */}
                    {activeFilter === 'status' && (
                      <div className="mt-2">
                        <Select
                          mode="multiple"
                          allowClear
                          placeholder="All"
                          value={getFilterValues('status')}
                          onChange={(value) =>
                            updateFilterParam('status', value)
                          }
                          className="w-full"
                          options={statusOptions.map((status) => ({
                            value: status,
                            label: status,
                          }))}
                        />
                      </div>
                    )}

                    {/* PRIORITY SELECT */}
                    {activeFilter === 'priority' && (
                      <div className="mt-2">
                        <Select
                          mode="multiple"
                          allowClear
                          placeholder="All"
                          value={getFilterValues('priority')}
                          onChange={(value) =>
                            updateFilterParam('priority', value)
                          }
                          className="w-full"
                          options={PRIORITIES.map((priority) => ({
                            value: priority,
                            label: priority,
                          }))}
                        />
                      </div>
                    )}

                    {/* ASSIGNEE SELECT */}
                    {activeFilter === 'assignee' && (
                      <div className="mt-2">
                        <Select
                          mode="multiple"
                          allowClear
                          placeholder="All"
                          loading={loadingMembers}
                          value={getFilterValues('assignee')}
                          onChange={(value) =>
                            updateFilterParam('assignee', value)
                          }
                          className="w-full"
                          options={members.map((member) => ({
                            value: member._id,
                            label: (
                              <UserCell user={member} emptyText="Unassigned" />
                            ),
                          }))}
                        />
                      </div>
                    )}

                    {activeFilter === 'type' && (
                      <div className="mt-2">
                        <Select
                          mode="multiple"
                          allowClear
                          placeholder="All"
                          value={getFilterValues('type')}
                          onChange={(value) => updateFilterParam('type', value)}
                          className="w-full"
                          options={TASK_TYPES.map((type) => ({
                            value: type,
                            label: type,
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
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-[#27272e] dark:hover:text-slate-200"
              >
                <FunnelX className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <div className="">
          <Tabs activeKey={activeView} items={tabItems} />
        </div>
      </header>
      <ProjectMembersModal
        open={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </>
  );
}

export default TopBar;
