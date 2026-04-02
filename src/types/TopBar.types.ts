export type ViewMode =
  | 'backlog'
  | 'board'
  | 'list'
  | 'for-you'
  | 'sprints-overview'
  | 'timeline'
  | 'logs'
  | 'analytics';

export interface ActiveUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface TopBarProps {
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;

  onAddTask: () => void;
  onOpenFilters: () => void;
  onClearFilters: () => void;

  hasActiveFilters: boolean;
  activeUsers: ActiveUser[];

  projectName?: string;
}
