import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectById, getProjectMembers } from '../services/projectService';
import type { User } from '../services/types/tasks.types';
import { message } from 'antd';
import { AxiosError } from 'axios';

export function useProjectMetaData(projectId?: string) {
  const projectQuery = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId as string),
    enabled: !!projectId,
  });

  const membersQuery = useQuery({
    queryKey: ['project', projectId, 'members'],
    queryFn: () => getProjectMembers(projectId as string),
    enabled: !!projectId,
  });

  const columns: string[] = projectQuery.data?.columns ?? [];
  const members: User[] = membersQuery.data ?? [];
  const loadingMembers = membersQuery.isFetching;

  useEffect(() => {
    if (projectQuery.error) {
      const error = projectQuery.error as AxiosError<{ message?: string }>;

      message.error(
        error.response?.data?.message || error.message || 'Project not found.'
      );
    }
  }, [projectQuery.error]);

  useEffect(() => {
    if (membersQuery.error) {
      const error = membersQuery.error as AxiosError<{ message?: string }>;

      message.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get Project Members'
      );
    }
  }, [membersQuery.error]);

  return { columns, members, loadingMembers };
}
