import { createContext, useContext } from 'react';
import type { Project } from '../types/project.types';

interface ProjectContextValue {
  project?: Project;
  columns: string[];
  setProject: (project?: Project) => void;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return ctx;
};
