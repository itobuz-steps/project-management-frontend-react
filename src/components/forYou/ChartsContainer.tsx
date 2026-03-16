import {
  type ColumnConfig,
  type PieConfig,
  Column,
  Pie,
} from '@ant-design/plots';
import { THEME_COLORS, GRAY_SHADES } from '../../config/constants';
import { useTheme } from '../../hooks/useTheme';
import type { TaskStats } from '../../services/types/tasks.types';
import { Grid } from 'antd';
import { DateTime } from 'luxon';

export function ChartsContainer({ data }: { data: TaskStats | null }) {
  const [theme] = useTheme();
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.sm; // < 640px
  const chartSize = isSmall ? 250 : 300;

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
      },
    },
    legend: false,
    width: chartSize * 1.5,
    height: chartSize,
  } satisfies ColumnConfig;

  return (
    <div className="flex w-full flex-1 flex-wrap items-center justify-center gap-2 sm:justify-start">
      <div className="flex w-full flex-1 flex-col items-center rounded-md border border-gray-50 bg-white p-2 shadow-sm sm:w-auto">
        <h4 className="text-primary-500 m-2 font-semibold">
          Assigned Task By Project
        </h4>
        <Pie {...pieConfig} data={allAssignedTaskByProject} />
      </div>
      <div className="flex w-full flex-1 flex-col items-center rounded-md border border-gray-50 bg-white p-2 shadow-sm sm:w-auto">
        <h4 className="text-primary-500 m-2 font-semibold">
          Completed Task By Project
        </h4>
        <Pie {...pieConfig} data={completedTaskByProject} />
      </div>
      <div className="flex w-full flex-1 flex-col items-center rounded-md border border-gray-50 bg-white p-2 shadow-sm sm:w-auto lg:col-span-2 lg:p-8 xl:col-span-1 xl:p-2">
        <h4 className="text-primary-500 m-2 font-semibold">
          Completed Task By Date (Last 7 Days)
        </h4>
        <Column {...columnConfig} data={completedTaskByDate} />
      </div>
    </div>
  );
}
