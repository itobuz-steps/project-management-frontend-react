import type { PieConfig, ColumnConfig } from '@ant-design/plots';
import type {
  PriorityColumnItem,
  StoryPointItem,
  StatusPieItem,
} from './sprintView.types';

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
