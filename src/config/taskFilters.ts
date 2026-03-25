export const TASK_FILTER_QUERY_KEYS = [
  'type',
  'status',
  'priority',
  'assignee',
  'reporter',
  'tags',
  'sortBy',
  'sortOrder',
] as const;

export type MultiTaskFilterKey =
  | 'type'
  | 'status'
  | 'priority'
  | 'assignee'
  | 'reporter'
  | 'tags';

export type SingleTaskFilterKey = 'sortBy' | 'sortOrder';

export type BoardTaskFilters = {
  type?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  reporter?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export const TASK_TYPE_OPTIONS = ['bug', 'story', 'task'] as const;

export const SORT_FIELD_OPTIONS = [
  'title',
  'key',
  'type',
  'status',
  'priority',
  'assignee',
  'reporter',
  'storyPoint',
  'dueDate',
  'createdAt',
  'updatedAt',
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;

export const formatFilterLabel = (value: string) =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/-/g, ' ')
    .replace(/^./, (char) => char.toUpperCase());

const parseList = (params: URLSearchParams, key: MultiTaskFilterKey) =>
  (params.get(key) ?? '').split(',').filter(Boolean);

const toCsvOrUndefined = (values: string[]) =>
  values.length ? values.join(',') : undefined;

export const parseBoardTaskFilters = (
  params: URLSearchParams
): BoardTaskFilters => {
  const type = parseList(params, 'type');
  const status = parseList(params, 'status');
  const priority = parseList(params, 'priority');
  const assignee = parseList(params, 'assignee');
  const reporter = parseList(params, 'reporter');
  const tags = parseList(params, 'tags');
  const sortBy = params.get('sortBy') || undefined;
  const sortOrder = params.get('sortOrder');

  return {
    type: toCsvOrUndefined(type),
    status: toCsvOrUndefined(status),
    priority: toCsvOrUndefined(priority),
    assignee: toCsvOrUndefined(assignee),
    reporter: toCsvOrUndefined(reporter),
    tags: tags.length ? tags : undefined,
    sortBy,
    sortOrder:
      sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
  };
};

export const getActiveTaskFilterCount = (params: URLSearchParams) =>
  TASK_FILTER_QUERY_KEYS.reduce(
    (count, key) => count + (params.get(key) ? 1 : 0),
    0
  );
