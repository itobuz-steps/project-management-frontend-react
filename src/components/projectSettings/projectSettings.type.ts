import type { User } from '../../services/types/tasks.types';
import type { Project } from '../../types/project.types';

export type ProjectSettingsFormProps = {
  project: Project;
  members: User[];
  setProject: (project: Project) => void;
};

export type ProjectSettingsDeleteProps = {
  projectId: string;
};

export type ProjectSettingsHeaderProps = {
  project: Project;
};
