export interface StatusPieItem {
  type: string;
  value: number;
}

export interface PriorityColumnItem {
  priority: string;
  status: string;
  count: number;
}

export interface StoryPointItem {
  category: string;
  points: number;
}

export interface SprintStats {
  totalTasks: number;
  completedCount: number;
  pendingCount: number;
  removedCount: number;
}
