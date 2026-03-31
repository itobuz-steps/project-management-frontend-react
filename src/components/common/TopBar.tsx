import { Plus, FunnelX, Users } from 'lucide-react';
import type { ViewMode, TopBarProps } from '../../types/TopBar.types';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import SearchBar from '../navbar/SearchBar';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { Tabs } from 'antd';
import { TaskFiltersDropdown } from './TaskFiltersDropdown';
import { InviteUserContainer } from './InviteUserContainer';
import { ProjectMembersModal } from './ProjectMembersModal';
import { usePermissions } from '../../hooks/usePermissions';

function TopBar({
  onAddTask,
  onOpenFilters,
  onClearFilters,
  hasActiveFilters,
}: TopBarProps) {
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { project } = useProject();
  const { can } = usePermissions();
  const { columns, members, loadingMembers } = useProjectMetaData(project?._id);

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

    if (can('PROJECT_AUDIT_LOG_VIEW')) {
      base.push({ label: 'Audit Logs', value: 'logs' });
    }

    return base;
  }, [can, isScrum]);

  const isFilterableView = useMemo(() => {
    const path = location.pathname;
    return path.endsWith('/board');
  }, [location.pathname]);

  const statusOptions = useMemo(() => {
    if (columns.length) {
      return columns;
    }

    return ['todo', 'in-progress', 'done'];
  }, [columns]);

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

  return (
    <header className="flex flex-col gap-1.5 sm:gap-2">
      {/* BOTTOM ROW */}
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT SIDE */}
        <div className="flex justify-stretch gap-2">
          <SearchBar />
          {project && (
            <>
              <button
                onClick={() => setIsMembersOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none dark:text-slate-200 dark:hover:bg-[#2a2a33] dark:hover:text-white dark:focus-visible:ring-slate-600"
                aria-label="Show members"
              >
                <Users size={16} strokeWidth={1.9} />
              </button>
              <InviteUserContainer />
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full flex-col flex-wrap items-end gap-2 sm:w-auto sm:flex-row sm:items-center">
          {/* ADD TASK */}
          <button
            onClick={onAddTask}
            className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-3.5 py-2 text-sm font-medium text-white sm:w-auto"
          >
            <Plus className="mr-1 mb-0.5 inline-block h-3.5 w-3.5" />
            Create
          </button>

          {/* FILTERS */}
          {isFilterableView && (
            <>
              <TaskFiltersDropdown
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                statusOptions={statusOptions}
                members={members}
                loadingMembers={loadingMembers}
                onOpenFilters={onOpenFilters}
                onClearFilters={onClearFilters}
              />
              <button
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                title="Clear all filters"
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-[#27272e] dark:hover:text-slate-200"
              >
                <FunnelX className="h-4 w-4" />
              </button>
            </>
          )}

          {/* CLEAR FILTERS */}
        </div>
      </div>
      <div className="">
        <Tabs activeKey={activeView} items={tabItems} />
      </div>

      <ProjectMembersModal
        open={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </header>
  );
}

export default TopBar;
