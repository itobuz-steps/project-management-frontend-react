import { PRIORITY_COLORS } from '../../taskModal/constants';
import { Column } from '@ant-design/plots';
import { useColorMode } from '../../../hooks/useColorMode';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function PriorityBreakdown({
  data,
}: {
  data: ProjectAnalytics['priorityBreakdown'];
}) {
  const [colorMode] = useColorMode();
  const textColor = colorMode === 'dark' ? '#f5f5f5' : '#374151';

  const config = {
    data,
    xField: 'priority',
    yField: 'count',
    colorField: 'priority',
    label: {
      position: 'middle' as const,
      style: {
        fill: textColor,
      },
    },
    color: ({ priority }: { priority: string }) =>
      PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] ?? '#94a3b8',
    tooltip: {
      items: [{ channel: 'y' as const, name: 'Tasks' }],
    },
    legend: {
      color: {
        itemLabelFill: textColor,
      },
    },
    axis: {
      x: { labelTransform: 'capitalize', labelFill: textColor },
      y: { labelFill: textColor },
    },
  };

  return <Column {...config} height={320} />;
}
