import { useState, useEffect } from 'react';
import { ProjectContext } from './ProjectContext';
import type { Project } from '../types/project.types';
import { useTheme } from '../hooks/useTheme';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | undefined>();
  const [, setTheme] = useTheme();

  useEffect(() => {
    if (project?.theme) {
      setTheme(project.theme);
    }
  }, [project?.theme, setTheme]);

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
