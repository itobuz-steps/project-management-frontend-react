import { PRIORITY_COLORS } from '../../taskModal/constants';
import { Column } from '@ant-design/plots';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function PriorityBreakdown({
  data,
}: {
  data: ProjectAnalytics['priorityBreakdown'];
}) {
  const config = {
    data,
    xField: 'priority',
    yField: 'count',
    colorField: 'priority',
    color: ({ priority }: { priority: string }) =>
      PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] ?? '#94a3b8',
    tooltip: {
      items: [{ channel: 'y' as const, name: 'Tasks' }],
    },
    axis: {
      x: { labelTransform: 'capitalize' },
    },
  };

  return <Column {...config} height={320} />;
}