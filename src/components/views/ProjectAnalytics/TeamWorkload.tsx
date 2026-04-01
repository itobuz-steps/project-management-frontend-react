import { Bar } from '@ant-design/plots';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function TeamWorkload({
  data,
  themeColors,
}: {
  data: ProjectAnalytics['teamWorkload'];
  themeColors: string[];
}) {
  const config = {
    data: [...data].sort((a, b) => a.count - b.count),
    yField: 'name',
    xField: 'count',
    colorField: 'name',
    color: themeColors[5],
    tooltip: {
      items: [{ channel: 'x' as const, name: 'Open Tasks' }],
    },
    axis: {
      y: false,
    },
    style: {
      minWidth: 20,
      maxWidth: 30,
    },
  };

  return <Bar {...config} height={Math.max(160, data.length * 40)} />;
}