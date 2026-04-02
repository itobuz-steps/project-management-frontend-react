import { STATUS_COLORS } from '../../taskModal/constants';
import { Pie } from '@ant-design/plots';
import { useColorMode } from '../../../hooks/useColorMode';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function StatusOverview({
  data,
  themeColors,
}: {
  data: ProjectAnalytics['statusOverview'];
  themeColors: string[];
}) {
  const [colorMode] = useColorMode();
  const textColor = colorMode === 'dark' ? '#f5f5f5' : '#374151';
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const config = {
    data,
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    innerRadius: 0.5,
    label: {
      style: {
        fill: textColor,
      },
    },
    legend: {
      color: {
        position: 'bottom' as const,
        layout: { justifyContent: 'center' as const },
        itemLabelFill: textColor,
      },
    },
    color: ({ status }: { status: string }) =>
      STATUS_COLORS[status] ?? themeColors[4],
    tooltip: {
      items: [{ channel: 'y' as const, name: 'Tasks' }],
    },
    annotations: [
      {
        type: 'text' as const,
        style: {
          text: String(total),
          x: '50%',
          y: '50%',
          textAlign: 'center' as const,
          fontSize: 26,
          fontWeight: 'bold',
          fill: textColor,
        },
      },
    ],
  };

  return <Pie {...config} height={320} />;
}