import type { ProjectType } from '../../types/project.types';

export interface Template {
  id: string;
  name: string;
  columns: string[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  templates: Template[];
}

export interface CreateProjectFormValues {
  workspaceId: string;
  name: string;
  projectType: ProjectType;
  columns: string[];
}

export interface WorkspaceSelectOption {
  label: string;
  value: string;
}

export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (projectId: string) => void;
}

export interface ProjectFormProps {
  onSubmit: (values: CreateProjectFormValues) => void;
  loading: boolean;
  columns: string[];
  onColumnsChange: (columns: string[]) => void;
  workspaceOptions: WorkspaceSelectOption[];
}

export interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  selectedTemplateId?: string;
}

export interface TemplateCategoryProps {
  category: TemplateCategory;
  onSelectTemplate: (template: Template) => void;
  selectedTemplateId?: string;
  defaultExpanded?: boolean;
}

export interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}
