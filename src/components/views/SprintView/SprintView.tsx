import { useParams } from 'react-router-dom';
import { Spin, Empty, Grid } from 'antd';
import { useTheme } from '../../../hooks/useTheme';
import { THEME_COLORS, GRAY_SHADES } from '../../../config/constants';
import { useSprintReport } from '../../../hooks/useSprintReport';
import { SprintSelector } from './SprintSelector';
import { SprintSummaryCards } from './SprintSummaryCards';
import { SprintCharts } from './SprintCharts';
import { RemovedTasksTable } from './RemovedTasksTable';
import { BurndownChart } from './BurndownChart';

function SprintView() {
  const { projectId } = useParams();
  const [theme] = useTheme();
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.sm;
  const chartSize = isSmall ? 250 : 300;

  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];
  const isBlackTheme = theme === 'custom_2';
  const primaryColors = isBlackTheme ? GRAY_SHADES : themeColors.slice(2, 9);

  const {
    sprints,
    selectedSprintId,
    setSelectedSprintId,
    summary,
    removedTasks,
    loadingSprints,
    loadingData,
    stats,
    statusPieData,
    typeBreakdownData,
    priorityColumnData,
    storyPointData,
  } = useSprintReport(projectId);

  if (!projectId) {
    return (
      <div className="bg-primary-50 rounded-lg border p-6 text-center text-gray-500 dark:text-neutral-100">
        <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-white">
          No project selected
        </h2>
        <p className="text-sm dark:text-neutral-200">
          Select a project from the sidebar to view sprint reports.
        </p>
      </div>
    );
  }

  if (loadingSprints) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  if (sprints.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Empty
          description={
            <span className="dark:text-white">No completed sprints found</span>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 text-gray-900 dark:text-white">
      <SprintSelector
        sprints={sprints}
        selectedSprintId={selectedSprintId}
        onSelect={setSelectedSprintId}
      />

      {loadingData ? (
        <div className="flex items-center justify-center p-12">
          <Spin size="large" />
        </div>
      ) : !summary ? (
        <Empty
          description={
            <span className="dark:text-white">No data available</span>
          }
        />
      ) : (
        <>
          <SprintSummaryCards stats={stats} />

          <SprintCharts
            statusPieData={statusPieData}
            typeBreakdownData={typeBreakdownData}
            priorityColumnData={priorityColumnData}
            storyPointData={storyPointData}
            chartSize={chartSize}
            colors={primaryColors}
          />
          <BurndownChart
            projectId={projectId}
            sprintId={selectedSprintId as string}
          />
          <RemovedTasksTable tasks={removedTasks} />
        </>
      )}
    </div>
  );
}

export default SprintView;
