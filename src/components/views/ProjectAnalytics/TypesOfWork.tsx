import { Rose } from '@ant-design/plots';
import { useColorMode } from '../../../hooks/useColorMode';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function TypesOfWork({
  data,
  themeColors,
}: {
  data: ProjectAnalytics['typesOfWork'];
  themeColors: string[];
}) {
  const [colorMode] = useColorMode();
  const textColor = colorMode === 'dark' ? '#f5f5f5' : '#374151';

  const config = {
    data,
    xField: 'type',
    yField: 'count',
    colorField: 'type',
    seriesField: 'type',
    label: {
      position: 'outside' as const,
      text: (d: { count: number }) => `${d.count}`,
      style: {
        fill: textColor,
      },
    },
    tooltip: {
      items: [{ channel: 'y' as const, name: 'Tasks' }],
    },
    legend: {
      color: {
        itemLabelFill: textColor,
      },
    },
    scale: {
      color: { range: themeColors },
    },
  };

  return <Rose {...config} height={320} />;
}