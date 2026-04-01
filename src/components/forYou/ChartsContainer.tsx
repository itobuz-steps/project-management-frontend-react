import {
  type ColumnConfig,
  type PieConfig,
  Column,
  Pie,
} from '@ant-design/plots';
import { THEME_COLORS, GRAY_SHADES } from '../../config/constants';
import { useColorMode } from '../../hooks/useColorMode';
import type { TaskStats } from '../../services/types/tasks.types';
import { Grid } from 'antd';
import { DateTime } from 'luxon';

export function ChartsContainer({ data }: { data: TaskStats | null }) {
  const theme = localStorage.getItem('lastProjectTheme') || 'indigo';
  const [colorMode] = useColorMode();
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.sm; // < 640px
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

  const pieConfig = {
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      position: 'outside',
      style: {
        fill: textColor,
      },
    },
    legend: {
      color: {
        itemLabelFill: textColor,
      },
    },
    tooltip: (d: { type: string; value: number }) => ({
      name: d.type,
      value: d.value,
    }),
    scale: {
      color: { range: primaryColors },
    },
    width: 300,
    height: 300,
  } satisfies PieConfig;

  const columnConfig = {
    xField: 'date',
    yField: 'count',
    colorField: 'date',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    tooltip: (d: { date: string; count: number }) => ({
      name: d.date,
      value: d.count,
    }),
    scale: {
      color: { range: primaryColors },
    },
    axis: {
      x: {
        labelAutoRotate: false,
        labelFill: textColor,
      },
      y: {
        labelFill: textColor,
      },
    },
    legend: false,
    width: chartSize * 1.5,
    height: chartSize,
  } satisfies ColumnConfig;

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
      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
        <h4 className="text-primary-500 mb-4 text-center text-sm font-semibold tracking-wide">
          Assigned Task By Project
        </h4>
        <Pie {...pieConfig} data={allAssignedTaskByProject} />
        <div
          className="absolute right-0 bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          style={{
            background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
          }}
        />
      </div>
      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
        <div
          className="absolute right-0 bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          style={{
            background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
          }}
        />
        <h4 className="text-primary-500 mb-4 text-center text-sm font-semibold tracking-wide">
          Completed Task By Project
        </h4>
        <Pie {...pieConfig} data={completedTaskByProject} />
      </div>
      <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg sm:col-span-2 lg:col-span-1 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
        <div
          className="absolute right-0 bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          style={{
            background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
          }}
        />
        <h4 className="text-primary-500 mb-4 text-center font-semibold tracking-wide">
          {renderChartTitle('Completed Task By Date (Last 7 Days)')}
        </h4>
        <Column {...columnConfig} data={completedTaskByDate} />
      </div>
    </div>
  );
}
