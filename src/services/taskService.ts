import axios from 'axios';
import { config } from '../config/config';
import type {
  CreateTaskPayload,
  PaginatedTasksResponse,
  TaskPopulated,
  TaskResponse,
  TaskStats,
} from '../services/types/tasks.types';
import { attachInterceptor } from '../utils/attachInterceptor';
import { mapObjectToFormData } from '../utils/mapObjectToFormdata';
import type { Activity } from './types/activity.types';
import type { Worklog } from './types/worklog.types';

const API_URL = `${config.api_base_url}/tasks`;

const api = axios.create({
  baseURL: API_URL,
});

//TODO: Remove it after implementing pagination in board and backlog views
const LEGACY_FETCH_LIMIT = 10;

type GetTasksBaseParams = {
  projectId: string;
  searchInput?: string;
  type?: string[];
  status?: string[];
  priority?: string[];
  assignee?: string[];
  reporter?: string[];
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ascend' | 'descend';
};

type GetTasksPaginatedParams = GetTasksBaseParams & {
  page: number;
  limit: number;
};

type GetTasksListParams = GetTasksBaseParams & {
  page?: number;
  limit?: number;
};

attachInterceptor(api);

export async function createTask(task: CreateTaskPayload) {
  const response = await api.post(
    '',
    mapObjectToFormData(task as unknown as Record<string, unknown>)
  );

  return response.data.result;
}

export default async function getTaskById(
  taskId: string
): Promise<TaskPopulated> {
  const res = await api.get<TaskResponse>(`/${taskId}`);

  return res.data.result;
}

export async function updateTask(
  taskId: string,
  updates: {
    existingAttachments?: string[];
    attachments?: File[];
  } & Partial<TaskPopulated>
): Promise<TaskPopulated> {
  const formData = mapObjectToFormData(updates);

  const res = await api.patch<{ result: TaskPopulated }>(
    `/${taskId}`,
    formData
  );

  return res.data.result;
}

export async function getAllTasks(): Promise<TaskPopulated[]> {
  const res = await api.get<{
    result: TaskPopulated[] | PaginatedTasksResponse;
  }>('', {
    params: {
      page: 1,
      limit: LEGACY_FETCH_LIMIT,
    },
  });

  return extractTasks(res.data.result);
}

export async function getTasksPaginated(params: {
  page: number;
  limit: number;
}): Promise<PaginatedTasksResponse> {
  const res = await api.get<{ result: PaginatedTasksResponse }>('', {
    params,
  });

  return res.data.result as PaginatedTasksResponse;
}

export async function getTaskByProjectId(
  projectId: string,
  filter: string | null = '',
  searchInput: string | null = ''
): Promise<TaskPopulated[]> {
  const response = await api.get('', {
    params: {
      projectId,
      sortBy: filter || undefined,
      searchQuery: searchInput || undefined,
      page: 1,
      limit: LEGACY_FETCH_LIMIT,
    },
  });

  return extractTasks(response.data.result);
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/${taskId}`);
}

export async function getUserTasks(): Promise<TaskPopulated[]> {
  const res = await api.get<{
    result: TaskPopulated[] | PaginatedTasksResponse;
  }>(`/me`, {
    params: {
      page: 1,
      limit: LEGACY_FETCH_LIMIT,
    },
  });

  return extractTasks(res.data.result);
}

export function getTasks(
  params: GetTasksPaginatedParams
): Promise<PaginatedTasksResponse>;

export function getTasks(params: GetTasksListParams): Promise<TaskPopulated[]>;

export async function getTasks(
  params: GetTasksPaginatedParams | GetTasksListParams
): Promise<TaskPopulated[] | PaginatedTasksResponse> {
  const shouldPaginate =
    typeof params.page === 'number' && typeof params.limit === 'number';

  const normalizedSortOrder =
    params.sortOrder === 'ascend'
      ? 'asc'
      : params.sortOrder === 'descend'
        ? 'desc'
        : params.sortOrder;

  const queryParams = {
    projectId: params.projectId,
    page: shouldPaginate ? params.page : 1,
    limit: shouldPaginate ? params.limit : LEGACY_FETCH_LIMIT,

    ...(params.searchInput && { searchQuery: params.searchInput }),

    ...(params.type?.length && { type: params.type.join(',') }),
    ...(params.status?.length && { status: params.status.join(',') }),
    ...(params.priority && { priority: params.priority }),
    ...(params.assignee?.length && {
      assignee: params.assignee.join(','),
    }),
    ...(params.reporter?.length && {
      reporter: params.reporter.join(','),
    }),
    ...(params.tags?.length && { tags: params.tags.join(',') }),

    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(normalizedSortOrder && { sortOrder: normalizedSortOrder }),
  };

  const res = await api.get<{
    result: TaskPopulated[] | PaginatedTasksResponse;
  }>('', {
    params: queryParams,
  });

  if (shouldPaginate) {
    return extractPaginatedTasks(
      res.data.result,
      params.page as number,
      params.limit as number
    );
  }

  return extractTasks(res.data.result);
}

function extractTasks(
  result: TaskPopulated[] | PaginatedTasksResponse
): TaskPopulated[] {
  return Array.isArray(result) ? result : result.data;
}

function extractPaginatedTasks(
  result: TaskPopulated[] | PaginatedTasksResponse,
  page: number,
  limit: number
): PaginatedTasksResponse {
  if (Array.isArray(result)) {
    return {
      data: result,
      pagination: {
        page,
        limit,
        total: result.length,
        totalPages: result.length ? Math.ceil(result.length / limit) : 0,
        hasNextPage: false,
        hasPrevPage: page > 1,
      },
    };
  }

  return result;
}

export async function getTaskActivities(taskId: string): Promise<Activity[]> {
  const res = await api.get<{ activities: Activity[] }>(
    `/${taskId}/activities`
  );

  console.log('Fetched activities:', res.data);

  res.data.activities.forEach((activity: Activity) => {
    activity.createdAt = new Date(activity.createdAt);
  });

  return res.data.activities;
}

export async function getTaskStats() {
  const res = await api.get<{ result: TaskStats }>('/stats');
  return res.data.result;
}

export async function startTaskTimer(taskId: string): Promise<Worklog> {
  const res = await api.post<{ result: Worklog }>(`/${taskId}/start-timer`);
  return res.data.result;
}

export async function stopTaskTimer(worklogId: string): Promise<Worklog> {
  const res = await api.patch<{ result: Worklog }>(`/stop-timer/${worklogId}`);
  return res.data.result;
}

export async function getTaskWorklogs(taskId: string): Promise<Worklog[]> {
  const res = await api.get<{ result: Worklog[] }>(`/${taskId}/worklogs`);
  return res.data.result;
}
