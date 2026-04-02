import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useColorMode } from '../../../hooks/useColorMode';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function TypesOfWork({
  data,
}: {
  data: ProjectAnalytics['typesOfWork'];
  themeColors: string[];
}) {
  const [colorMode] = useColorMode();

  const LIGHT_COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // blue, green, amber
  const DARK_COLORS = ['#60a5fa', '#34d399', '#fbbf24']; // lighter variants

  const COLORS = colorMode === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return (
    <div style={{ height: 320, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius="75%"
            innerRadius="40%"
            paddingAngle={3}
            labelLine={true}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                stroke={colorMode === 'dark' ? '#111827' : '#ffffff'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            formatter={(value) => (
              <span style={{ color: LIGHT_COLORS[0], fontSize: 12 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
