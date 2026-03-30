import { useState, useEffect } from 'react';
import { ProjectContext } from './ProjectContext';
import type { Project } from '../types/project.types';
import type { TaskPopulated } from '../services/types/tasks.types';
import { useTheme } from '../hooks/useTheme';
import { THEME_COLORS } from '../config/constants';

const THEME_ALIASES: Record<string, string> = {
  teal: 'green',
  blue: 'digital-blue',
  black: 'jet-black',
  custom_2: 'jet-black',
};

const normalizeTheme = (theme?: string | null): string | null => {
  if (!theme) {
    return null;
  }

  if (THEME_COLORS[theme]) {
    return theme;
  }

  const aliased = THEME_ALIASES[theme];
  return aliased && THEME_COLORS[aliased] ? aliased : null;
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProjectState] = useState<Project | undefined>();
  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [, setTheme] = useTheme();

  const setProject = (nextProject?: Project) => {
    setProjectState((currentProject) => {
      if (currentProject?._id !== nextProject?._id) {
        setTasks([]);
      }

      return nextProject;
    });
  };

  const addTask = (task: TaskPopulated) => {
    setTasks((prev) => {
      if (prev.some((existing) => existing._id === task._id)) {
        return prev;
      }

      return [task, ...prev];
    });
  };

  useEffect(() => {
    if (!project?._id) {
      return;
    }

    const projectThemeKey = `projectTheme:${project._id}`;
    const savedProjectTheme = localStorage.getItem(projectThemeKey);

    const nextTheme =
      normalizeTheme(savedProjectTheme) ?? normalizeTheme(project.theme);

    if (!nextTheme) {
      return;
    }

    setTheme(nextTheme);
    localStorage.setItem('lastProjectTheme', nextTheme);
    localStorage.setItem(projectThemeKey, nextTheme);
  }, [project?._id, project?.theme, setTheme]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        columns: project?.columns || [],
        tasks,
        setProject,
        setTasks,
        addTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
