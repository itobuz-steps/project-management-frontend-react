import type { User } from '../../services/types/tasks.types';
import type { Project, ProjectMemberRole } from '../../types/project.types';

export type ProjectSettingsFormProps = {
  project: Project;
  members: User[];
  setProject: (project: Project) => void;

  iconFile: File | null;
  setIconFile: (file: File | null) => void;
  setIconPreview: (url: string | null) => void;
  theme: string;
};

export type ProjectSettingsDeleteProps = {
  projectId: string;
};

export type ProjectSettingsHeaderProps = {
  project: Project;

  iconFile: File | null;
  iconPreview: string | null;

  setIconFile: (file: File | null) => void;
  setIconPreview: (url: string | null) => void;

  theme: string;
  setTheme: (theme: string) => void;
};

export type ProjectSettingsFormValues = {
  name: string;
  prefix?: string | null;
  projectType: string;
  defaultAssignee?: string | null;
  memberLead: string;
  theme: string;
  removeMembers?: string[];
};

export type EditableProjectMember = {
  user: string;
  role: ProjectMemberRole;
};

export type ThemePickerProps = {
  value?: string;
  onChange?: (theme: string) => void;
};

export type ThemeCircleProps = {
  theme: string;
  onSelect: (theme: string) => void;
  value: string;
  selected: boolean;
};
