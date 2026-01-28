import { useState } from 'react';
import { ProjectContext } from './ProjectContext';
import type { Project } from '../types/project.types';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | undefined>();

  return (
    <ProjectContext.Provider
      value={{
        project,
        columns: project?.columns || [],
        setProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
