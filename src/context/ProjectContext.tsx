import { createContext, useContext } from 'react';
import type { Project } from '../types/project.types';

export type ProjectWithRole = Project & {
  currentUserRole: 'superadmin' | 'admin' | 'member';
};
interface ProjectContextValue {
  project?: ProjectWithRole;
  columns: string[];
  setProject: (project?: ProjectWithRole) => void;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return ctx;
};
