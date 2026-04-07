import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { THEME_COLORS, GRAY_SHADES } from '../../config/constants';
import { useColorMode } from '../../hooks/useColorMode';
import type { TaskStats } from '../../services/types/tasks.types';
import { Grid } from 'antd';
import { DateTime } from 'luxon';

export function ChartsContainer({ data }: { data: TaskStats | null }) {
  const theme = localStorage.getItem('lastProjectTheme') || 'indigo';
  const [colorMode] = useColorMode();
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.sm;
  const chartSize = isSmall ? 250 : 300;
  const isDark = colorMode === 'dark';
  const textColor = isDark ? '#f5f5f5' : '#374151';

  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];
  const isBlackTheme = theme === 'custom_2';
  const primaryColors = isBlackTheme ? GRAY_SHADES : themeColors.slice(2, 9);

  const allAssignedTaskByProject = data?.allTasksGroupedByProject.map(
    (project) => ({
      type: project._id,
      value: project.tasks.length,
    })
  );

  const completedTaskByProject = data?.completedTasksGroupedByProject.map(
    (project) => ({
      type: project._id,
      value: project.tasks.length,
    })
  );

  const completedTaskMap = new Map(
    (data?.tasksCompletedEachDay ?? []).map((item) => [
      DateTime.fromISO(item.date).toFormat('dd-MM-yyyy'),
      item.count,
    ])
  );

  const completedTaskByDate = Array.from({ length: 7 }, (_, index) => {
    const date = DateTime.now().minus({ days: 6 - index });
    const dateKey = date.toFormat('dd-MM-yyyy');
    return {
      date: date.toFormat('dd/MM'),
      count: completedTaskMap.get(dateKey) ?? 0,
    };
  });

  const gradientStart = themeColors[7];
  const gradientEnd = themeColors[3];

  const renderChartTitle = (title: string) => {
    const hasTimeText = title.includes('(Last 7 Days)');
    if (!hasTimeText) return title;

    const [mainText, timeText] = title.split('(');
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-semibold">{mainText.trim()}</span>
        <span className="text-xs text-gray-400">({timeText}</span>
      </div>
    );
  };

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Assigned Task By Project */}
      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
        <h4 className="text-primary-500 mb-4 text-center text-sm font-semibold tracking-wide">
          Assigned Task By Project
        </h4>
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={allAssignedTaskByProject}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={90}
              labelLine={false}
            >
              {allAssignedTaskByProject?.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={primaryColors[index % primaryColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              formatter={(value) => (
                <span style={{ color: textColor, fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          className="absolute right-0 bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          style={{
            background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
          }}
        />
      </div>

      {/* Completed Task By Project */}
      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
        <h4 className="text-primary-500 mb-4 text-center text-sm font-semibold tracking-wide">
          Completed Task By Project
        </h4>
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={completedTaskByProject}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={90}
              labelLine={false}
            >
              {completedTaskByProject?.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={primaryColors[index % primaryColors.length]}
                />
              ))}
            </Pie>

            <Legend
              formatter={(value) => (
                <span style={{ color: textColor, fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          className="absolute right-0 bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          style={{
            background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
          }}
        />
      </div>

      {/* Completed Task By Date (Last 7 Days) */}
      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg sm:col-span-2 lg:col-span-1 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
        <h4 className="text-primary-500 mb-4 text-center font-semibold tracking-wide">
          {renderChartTitle('Completed Task By Date (Last 7 Days)')}
        </h4>
        <ResponsiveContainer width={chartSize * 1.5} height={chartSize}>
          <BarChart
            data={completedTaskByDate}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              labelFormatter={(label) => `Date: ${label}`}
              cursor={{
                fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              label={{
                position: 'insideTop',
                fill: '#FFFFFF',
                opacity: 0.6,
                fontSize: 12,
              }}
            >
              {completedTaskByDate.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={primaryColors[index % primaryColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div
          className="absolute right-0 bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          style={{
            background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
          }}
        />
      </div>
    </div>
  );
}
