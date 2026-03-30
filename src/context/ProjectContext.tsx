import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Project } from '../types/project.types';
import type { TaskPopulated } from '../services/types/tasks.types';

interface ProjectContextValue {
  project?: Project;
  columns: string[];
  tasks: TaskPopulated[];
  setProject: (project?: Project) => void;
  setTasks: Dispatch<SetStateAction<TaskPopulated[]>>;
  addTask: (task: TaskPopulated) => void;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return ctx;
};
