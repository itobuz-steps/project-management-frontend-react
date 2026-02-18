import { useEffect, useState } from 'react';
import { getProjectById, getProjectMembers } from '../services/projectService';
import type { User } from '../services/types/tasks.types';
import { message } from 'antd';

export function useProjectMetaData(projectId?: string) {
  const [columns, setColumns] = useState<string[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    async function load() {
      try {
        const project = await getProjectById(projectId as string);
        setColumns(project.columns);
      } catch {
        message.error('Project not found.');
      }
    }

    load();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    async function loadMembers() {
      setLoadingMembers(true);

      try {
        const res = await getProjectMembers(projectId as string);
        setMembers(res);
      } catch {
        message.error('Failed to get Project Members');
      } finally {
        setLoadingMembers(false);
      }
    }

    loadMembers();
  }, [projectId]);

  return { columns, members, loadingMembers };
}
