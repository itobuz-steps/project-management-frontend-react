import { Pie, Column } from '@ant-design/plots';
import {
  getPieConfig,
  getGroupedColumnConfig,
  getStoryPointColumnConfig,
} from './sprintView.config';
import type { SprintChartsProps, ChartCardProps } from './sprintView.types';
import { useColorMode } from '../../../hooks/useColorMode';

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="sprint-chart-card flex w-full flex-1 flex-col items-center rounded-md border-2 border-gray-200 p-4 text-gray-900 sm:w-auto dark:text-white">
      <h4 className="text-primary-500 mb-2 font-semibold dark:text-white">
        {title}
      </h4>
      {children}
    </div>
  );
}

export function SprintCharts({
  statusPieData,
  typeBreakdownData,
  priorityColumnData,
  storyPointData,
  chartSize,
  colors,
}: SprintChartsProps) {
  const [colorMode] = useColorMode();
  const isDark = colorMode === 'dark';

  const pieConfig = getPieConfig(chartSize, colors, isDark);
  const groupedColumnConfig = getGroupedColumnConfig(chartSize, colors, isDark);
  const storyPointConfig = getStoryPointColumnConfig(chartSize, colors, isDark);

  return (
    <>
      {/* Pie Charts Row */}
      <div className="flex w-full flex-1 flex-wrap items-center justify-center gap-4 sm:justify-start">
        <ChartCard title="Completion Status">
          <Pie {...pieConfig} data={statusPieData} />
        </ChartCard>
        <ChartCard title="Task Type Breakdown">
          <Pie {...pieConfig} data={typeBreakdownData} />
        </ChartCard>
      </div>

      {/* Column Charts Row */}
      <div className="flex w-full flex-1 flex-wrap items-center justify-center gap-4 sm:justify-start">
        <ChartCard title="Tasks by Priority">
          <Column {...groupedColumnConfig} data={priorityColumnData} />
        </ChartCard>
        <ChartCard title="Story Points Summary">
          <Column {...storyPointConfig} data={storyPointData} />
        </ChartCard>
      </div>
    </>
  );
}
