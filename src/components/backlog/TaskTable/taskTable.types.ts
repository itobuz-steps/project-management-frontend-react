import type {
  PaginationMeta,
  TaskPopulated,
  User,
} from '../../../services/types/tasks.types';

export type TaskTableFilters = {
  type: string[];
  status: string[];
  assignee: string[];
  reporter: string[];
  tags: string[];
};

export type TaskTableSortOrder = 'ascend' | 'descend' | null;

export type TaskTableSort = {
  field?: string | null;
  order?: TaskTableSortOrder;
};

export type TaskTableChangeParams = {
  page: number;
  pageSize: number;
  filters: TaskTableFilters;
  sorting: TaskTableSort;
};

export type TaskTableProps = {
  tasks: TaskPopulated[];
  statusColumns: string[];
  members: User[];
  loadingMembers: boolean;
  onTaskUpdated: (updated: TaskPopulated) => void;
  pagination?: PaginationMeta;
  filters?: TaskTableFilters;
  sorting?: TaskTableSort;
  onTableChange?: (params: TaskTableChangeParams) => void;
  loading?: boolean;
  error?: string | null;
};

export type InlineEditablePayload = Partial<
  Pick<TaskPopulated, 'status' | 'dueDate'>
>;
