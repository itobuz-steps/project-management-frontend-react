import type { PieConfig, ColumnConfig } from '@ant-design/plots';
import type {
  PriorityColumnItem,
  StoryPointItem,
  StatusPieItem,
} from './sprintView.types';

import type { BurndownData } from './sprintView.types';
import { api } from '../../api/axios';

export function getPieConfig(
  chartSize: number,
  colors: string[],
  isDark = false
): PieConfig {
  const textColor = isDark ? '#f5f5f5' : '#374151';

  return {
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      position: 'outside',
      style: {
        fill: textColor,
      },
    },
    legend: {
      color: {
        itemLabelFill: textColor,
      },
    },
    tooltip: (data: StatusPieItem) => ({
      name: data.type,
      value: data.value,
    }),
    scale: {
      color: { range: colors },
    },
    width: chartSize,
    height: chartSize,
  };
}

export function getGroupedColumnConfig(
  chartSize: number,
  colors: string[],
  isDark = false
): ColumnConfig {
  const textColor = isDark ? '#f5f5f5' : '#374151';

  return {
    xField: 'priority',
    yField: 'count',
    colorField: 'status',
    group: true,
    tooltip: (data: PriorityColumnItem) => ({
      name: `${data.priority} - ${data.status}`,
      value: data.count,
    }),
    scale: {
      color: { range: [colors[0], colors[3]] },
    },
    axis: {
      x: { labelAutoRotate: false, labelFill: textColor },
      y: { labelFill: textColor },
    },
    legend: {
      color: {
        itemLabelFill: textColor,
      },
    },
    width: chartSize * 1.5,
    height: chartSize,
  };
}

export function getStoryPointColumnConfig(
  chartSize: number,
  colors: string[],
  isDark = false
): ColumnConfig {
  const textColor = isDark ? '#f5f5f5' : '#374151';

  return {
    xField: 'category',
    yField: 'points',
    colorField: 'category',
    tooltip: (data: StoryPointItem) => ({
      name: data.category,
      value: `${data.points} pts`,
    }),
    scale: {
      color: { range: colors },
    },
    axis: {
      x: { labelAutoRotate: false, labelFill: textColor },
      y: { labelFill: textColor },
    },
    legend: false,
    width: chartSize * 1.5,
    height: chartSize,
  };
}

export const STATUS_CONFIG = {
  on_track: {
    label: 'On track',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  at_risk: {
    label: 'At risk',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  behind: {
    label: 'Behind',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
  },
} as const;

export const CHART_COLORS = {
  ideal: '#93c5fd',
  actual: '#f97316',
} as const;

export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 min — matches backend cache TTL

export const fetchBurndown = async (
  projectId: string,
  sprintId: string
): Promise<BurndownData> => {
  const { data } = await api.get(
    `/project/${projectId}/sprint/${sprintId}/burndown`
  );
  console.log('res', data);
  return data.result as BurndownData;
};

export const getMetricCards = (summary: BurndownData['summary']) => [
  {
    label: 'Total scope',
    value: summary.currentScope,
    unit: 'pts',
    color: undefined,
  },
  {
    label: 'Completed',
    value: summary.completedPoints,
    unit: 'pts',
    color: '#16a34a',
  },
  {
    label: 'Remaining',
    value: summary.remainingPoints,
    unit: 'pts',
    color: STATUS_CONFIG[summary.status].color,
  },
  {
    label: 'Progress',
    value: `${summary.percentComplete}%`,
    unit: '',
    color: undefined,
  },
];
