import type { TaskPopulated } from '../../../services/types/tasks.types';
import type { Sprint } from '../../../services/types/sprints.types';

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

export interface RemovedTasksTableProps {
  tasks: TaskPopulated[];
}

export interface SprintChartsProps {
  statusPieData: StatusPieItem[];
  typeBreakdownData: StatusPieItem[];
  priorityColumnData: PriorityColumnItem[];
  storyPointData: StoryPointItem[];
  chartSize: number;
  colors: string[];
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export interface SprintSelectorProps {
  sprints: Sprint[];
  selectedSprintId: string | null;
  onSelect: (sprintId: string) => void;
}

export interface SprintSummaryCardsProps {
  stats: SprintStats;
}

export const cards = [
  {
    key: 'totalTasks' as const,
    label: 'Total Tasks',
    border: 'border-gray-200',
    bg: '',
    text: 'text-gray-800',
    subText: 'text-gray-500',
  },
  {
    key: 'completedCount' as const,
    label: 'Completed',
    border: 'border-green-200',
    bg: 'bg-green-50',
    text: 'text-green-700',
    subText: 'text-green-600',
  },
  {
    key: 'pendingCount' as const,
    label: 'Pending',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    subText: 'text-orange-600',
  },
  {
    key: 'removedCount' as const,
    label: 'Removed',
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-700',
    subText: 'text-red-600',
  },
];

export const TYPE_COLOR_MAP: Record<string, string> = {
  bug: 'red',
  story: 'green',
  task: 'blue',
};

export const PRIORITY_COLOR_MAP: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};
