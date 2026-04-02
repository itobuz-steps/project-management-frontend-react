import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
  const sorted = [...data].sort((a, b) => a.count - b.count);

  return (
    <div style={{ height: 350, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ left: 40, bottom: 20 }}
        >
          <XAxis
            type="number"
            tick={{ fill: textColor }}
            label={{
              value: 'Open Tasks',
              fill: textColor,
              angle: 0,
              offset: 10,
              position: 'bottom',
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: textColor }}
            width={100}
            label={{
              value: 'Team Members',
              fill: textColor,
              angle: -90,
              position: 'left',
              width: 140,
            }}
          />
          <Tooltip />
          <Bar dataKey="count" name="Open Tasks" fill={themeColors[5]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
