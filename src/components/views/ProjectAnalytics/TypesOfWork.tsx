import { Bar } from '@ant-design/plots';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function TypesOfWork({
  data,
}: {
  data: ProjectAnalytics['typesOfWork'];
  themeColors: string[];
}) {
  const config = {
    data,
    yField: 'type',
    xField: 'count',
    colorField: 'type',
    tooltip: {
      items: [{ channel: 'x' as const, name: 'Tasks' }],
    },
    style: {
      minWidth: 30,
      maxWidth: 30,
    },
  };

  return <Bar {...config} height={Math.max(160, data.length * 50)} />;
}