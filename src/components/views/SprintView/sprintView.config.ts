import type { PieConfig, ColumnConfig } from '@ant-design/plots';
import type {
  PriorityColumnItem,
  StoryPointItem,
  StatusPieItem,
} from './sprintView.types';

export function getPieConfig(chartSize: number, colors: string[]): PieConfig {
  return {
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      position: 'outside',
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
  colors: string[]
): ColumnConfig {
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
      x: { labelAutoRotate: false },
    },
    width: chartSize * 1.5,
    height: chartSize,
  };
}

export function getStoryPointColumnConfig(
  chartSize: number,
  colors: string[]
): ColumnConfig {
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
      x: { labelAutoRotate: false },
    },
    legend: false,
    width: chartSize * 1.5,
    height: chartSize,
  };
}
