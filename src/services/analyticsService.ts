import { api } from '../components/api/axios';
import type { ProjectAnalytics } from './types/analytics.type';

export async function getProjectAnalytics(
  projectId: string
): Promise<ProjectAnalytics> {
  const response = await api.get<ProjectAnalytics>(
    `/projects/${projectId}/analytics`
  );
  return response.data;
}
