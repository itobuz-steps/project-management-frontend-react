import { Pie, Column } from '@ant-design/plots';
import {
  getPieConfig,
  getGroupedColumnConfig,
  getStoryPointColumnConfig,
} from './sprintView.config';
import type {
  StatusPieItem,
  PriorityColumnItem,
  StoryPointItem,
} from './sprintView.types';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center rounded-md border-2 border-gray-200 p-4 sm:w-auto">
      <h4 className="text-primary-500 mb-2 font-semibold">{title}</h4>
      {children}
    </div>
  );
}

interface SprintChartsProps {
  statusPieData: StatusPieItem[];
  typeBreakdownData: StatusPieItem[];
  priorityColumnData: PriorityColumnItem[];
  storyPointData: StoryPointItem[];
  chartSize: number;
  colors: string[];
}

export function SprintCharts({
  statusPieData,
  typeBreakdownData,
  priorityColumnData,
  storyPointData,
  chartSize,
  colors,
}: SprintChartsProps) {
  const pieConfig = getPieConfig(chartSize, colors);
  const groupedColumnConfig = getGroupedColumnConfig(chartSize, colors);
  const storyPointConfig = getStoryPointColumnConfig(chartSize, colors);

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
