import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getTasks } from '../../../services/taskService';
import type {
  PaginationMeta,
  TaskPopulated,
} from '../../../services/types/tasks.types';
import { useProject } from '../../../context/ProjectContext';
import { useProjectMetaData } from '../../../hooks/useProjectMetaData';
import { FilterX, LayoutPanelTop, Users } from 'lucide-react';
import TaskTable, {
  type TaskTableChangeParams,
  type TaskTableFilters,
  type TaskTableSort,
} from '../../backlog/TaskTable/TaskTableNew';
import './style.scss';
import SearchBar from '../../navbar/SearchBar';
import { InviteUserContainer } from '../../common/InviteUserContainer';
import { ProjectMembersModal } from '../../common/ProjectMembersModal';

const EMPTY_TABLE_FILTERS: TaskTableFilters = {
  type: null,
  status: null,
  assignee: null,
  reporter: null,
  tags: [],
};

const TABLE_LAYOUT_STORAGE_PREFIX = 'task-table-new-column-order';

const toServerSortOrder = (order?: TaskTableSort['order']) => {
  if (order === 'ascend') {
    return 'asc';
  }

  if (order === 'descend') {
    return 'desc';
  }

  return undefined;
};

function ListView() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { columns, project } = useProject();
  const { members, loadingMembers } = useProjectMetaData(projectId);

  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableFilters, setTableFilters] =
    useState<TaskTableFilters>(EMPTY_TABLE_FILTERS);
  const [sorting, setSorting] = useState<TaskTableSort>({
    field: null,
    order: null,
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [tableRenderKey, setTableRenderKey] = useState(0);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const searchInput = searchParams.get('searchInput') || '';

  useEffect(() => {
    setPage(1);
  }, [searchInput, projectId]);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      setError(null);
      setLoading(false);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 0 }));
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTasks({
          projectId,
          searchInput,
          type: tableFilters.type || undefined,
          status: tableFilters.status || undefined,
          assignee: tableFilters.assignee || undefined,
          reporter: tableFilters.reporter || undefined,
          tags:
            tableFilters.tags && tableFilters.tags.length
              ? tableFilters.tags
              : undefined,
          sortBy: sorting.field || undefined,
          sortOrder: toServerSortOrder(sorting.order),
          page,
          limit: pageSize,
        });
        setTasks(result.data);
        setPagination(result.pagination);
      } catch {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId, searchInput, tableFilters, sorting, page, pageSize]);

  const handleTaskUpdated = (updated: TaskPopulated) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updated._id ? updated : task))
    );
  };

  const handleTableChange = ({
    page: nextPage,
    pageSize: nextPageSize,
    filters,
    sorting: nextSorting,
  }: TaskTableChangeParams) => {
    const shouldResetPageSize = nextPageSize !== pageSize;
    const shouldResetForFilters =
      JSON.stringify(filters) !== JSON.stringify(tableFilters);
    const shouldResetForSorting =
      nextSorting.field !== sorting.field ||
      nextSorting.order !== sorting.order;

    setTableFilters(filters);
    setSorting(nextSorting);

    if (shouldResetPageSize || shouldResetForFilters || shouldResetForSorting) {
      setPage(1);
      if (shouldResetPageSize) {
        setPageSize(nextPageSize);
      }
      return;
    }

    setPage(nextPage);
  };

  const hasActiveFilters =
    Boolean(tableFilters.type) ||
    Boolean(tableFilters.status) ||
    Boolean(tableFilters.assignee) ||
    Boolean(tableFilters.reporter) ||
    Boolean(tableFilters.tags?.length) ||
    Boolean(sorting.field) ||
    Boolean(sorting.order);

  const handleResetFilters = () => {
    setTableFilters(EMPTY_TABLE_FILTERS);
    setSorting({ field: null, order: null });
    setPage(1);
  };

  const handleResetTableLayout = () => {
    localStorage.removeItem(
      `${TABLE_LAYOUT_STORAGE_PREFIX}:${projectId ?? 'global'}`
    );
    setTableRenderKey((prev) => prev + 1);
  };

  if (!projectId) {
    return (
      <div className="bg-primary-50 rounded-lg border p-6 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-slate-200">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view its list.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="min-w-70">
            <SearchBar />
          </div>
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
      </div>

      <div className="relative w-full rounded-md border border-gray-200 dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-end gap-2 border-b border-gray-200 bg-gray-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              aria-label="Reset filters"
              title="Reset filters"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FilterX size={14} />
            </button>
            <button
              type="button"
              onClick={handleResetTableLayout}
              aria-label="Reset table layout"
              title="Reset table layout"
              className="border-primary-500 text-primary-600 hover:bg-primary-500 inline-flex h-7 w-7 items-center justify-center rounded-md border transition hover:text-white"
            >
              <LayoutPanelTop size={14} />
            </button>
          </div>
        </div>

        <div className="no-scrollbar max-h-150 overflow-auto border border-gray-200 dark:border-slate-700">
          <TaskTable
            key={tableRenderKey}
            tasks={tasks}
            statusColumns={columns}
            members={members}
            loadingMembers={loadingMembers}
            onTaskUpdated={handleTaskUpdated}
            pagination={pagination}
            filters={tableFilters}
            sorting={sorting}
            onTableChange={handleTableChange}
            loading={loading}
            error={error}
          />
        </div>

        <ProjectMembersModal
          open={isMembersOpen}
          onClose={() => setIsMembersOpen(false)}
        />
      </div>
    </>
  );
}

export default ListView;
