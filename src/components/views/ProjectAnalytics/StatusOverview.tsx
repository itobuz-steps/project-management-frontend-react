// import { STATUS_COLORS } from '../../taskModal/constants';
// import { Pie } from '@ant-design/plots';
// import { useColorMode } from '../../../hooks/useColorMode';
// import type { ProjectAnalytics } from '../../../services/types/analytics.type';

// export function StatusOverview({
//   data,
//   themeColors,
// }: {
//   data: ProjectAnalytics['statusOverview'];
//   themeColors: string[];
// }) {
//   const [colorMode] = useColorMode();
//   const textColor = colorMode === 'dark' ? '#f5f5f5' : '#374151';
//   const total = data.reduce((sum, d) => sum + d.count, 0);

//   const config = {
//     data,
//     angleField: 'count',
//     colorField: 'status',
//     radius: 0.8,
//     innerRadius: 0.5,
//     label: {
//       style: {
//         fill: textColor,
//       },
//     },
//     legend: {
//       color: {
//         position: 'bottom' as const,
//         layout: { justifyContent: 'center' as const },
//         itemLabelFill: textColor,
//       },
//     },
//     color: ({ status }: { status: string }) =>
//       STATUS_COLORS[status] ?? themeColors[4],
//     tooltip: {
//       items: [{ channel: 'y' as const, name: 'Tasks' }],
//     },
//     annotations: [
//       {
//         type: 'text' as const,
//         style: {
//           text: String(total),
//           x: '50%',
//           y: '50%',
//           textAlign: 'center' as const,
//           fontSize: 26,
//           fontWeight: 'bold',
//           fill: textColor,
//         },
//       },
//     ],
//   };

//   return <Pie {...config} height={320} />;
// }

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useColorMode } from '../../../hooks/useColorMode';
import { STATUS_COLORS } from '../../taskModal/constants';
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

  return (
    <div style={{ height: 320, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={3}
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  STATUS_COLORS[entry.status] ??
                  themeColors[index % themeColors.length]
                }
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => (
              <span style={{ color: textColor, fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
