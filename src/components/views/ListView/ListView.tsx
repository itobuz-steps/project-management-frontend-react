import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getTasks } from '../../../services/taskService';
import type {
  PaginationMeta,
  TaskPopulated,
} from '../../../services/types/tasks.types';
import { useProject } from '../../../context/ProjectContext';
import { useProjectMetaData } from '../../../hooks/useProjectMetaData';
import TaskTable, {
  type TaskTableChangeParams,
  type TaskTableFilters,
  type TaskTableSort,
} from '../../backlog/TaskTableNew';
import './style.scss';

const EMPTY_TABLE_FILTERS: TaskTableFilters = {
  type: null,
  status: null,
  assignee: null,
  reporter: null,
  tags: [],
};

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
  const { columns } = useProject();
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
            tableFilters.tags && tableFilters.tags.length > 0
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

  if (!projectId) {
    return (
      <div className="bg-primary-50 rounded-lg border p-6 text-center text-gray-500">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view its list.
        </p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar relative mt-2 w-full overflow-x-auto rounded-md border border-gray-200">
      <TaskTable
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
  );
}

export default ListView;
