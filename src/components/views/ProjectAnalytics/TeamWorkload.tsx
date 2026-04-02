import { Bar } from '@ant-design/plots';
import { useColorMode } from '../../../hooks/useColorMode';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function TeamWorkload({
  data,
  themeColors,
}: {
  data: ProjectAnalytics['teamWorkload'];
  themeColors: string[];
}) {
  const [colorMode] = useColorMode();
  const textColor = colorMode === 'dark' ? '#f5f5f5' : '#374151';

  const config = {
    data: [...data].sort((a, b) => a.count - b.count),
    yField: 'name',
    xField: 'count',
    colorField: 'name',
    color: themeColors[5],
    label: {
      position: 'middle' as const,
      style: {
        fill: textColor,
      },
    },
    tooltip: {
      items: [{ channel: 'x' as const, name: 'Open Tasks' }],
    },
    axis: {
      y: false,
      x: { labelFill: textColor },
    },
    legend: false,
    style: {
      minWidth: 20,
      maxWidth: 30,
    },
  };

  return <Bar {...config} />;
}
