import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useColorMode } from '../../../hooks/useColorMode';
import { PRIORITY_COLORS } from '../../taskModal/constants';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function PriorityBreakdown({
  data,
}: {
  data: ProjectAnalytics['priorityBreakdown'];
}) {
  const [colorMode] = useColorMode();
  const textColor = colorMode === 'dark' ? '#f5f5f5' : '#374151';

  return (
    <div style={{ height: 320, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="priority" tick={{ fill: textColor }} />

          <YAxis
            tick={{ fill: textColor }}
            label={{
              value: 'Tasks Count',
              angle: -90,
              position: 'insideLeft',
              style: { fill: textColor },
            }}
          />
          <Tooltip />
          <Bar dataKey="count" name="Tasks">
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  PRIORITY_COLORS[
                    entry.priority as keyof typeof PRIORITY_COLORS
                  ] ?? '#94a3b8'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
