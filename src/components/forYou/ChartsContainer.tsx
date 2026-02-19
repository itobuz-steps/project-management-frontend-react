import { type PieConfig, Pie } from '@ant-design/plots';
import { THEME_COLORS, GRAY_SHADES } from '../../config/constants';
import { useTheme } from '../../hooks/useTheme';
import type { TaskStats } from '../../services/types/tasks.types';

export function ChartsContainer({ data }: { data: TaskStats | null }) {
  const [theme] = useTheme();

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

  const config = {
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

  return (
    <div className="flex w-full flex-wrap justify-center gap-2 sm:justify-start">
      <div className="rounded-md border-2 border-dashed border-gray-300 p-2">
        <h4 className="text-primary-500 m-2 font-semibold">
          Assigned Task By Project
        </h4>
        <Pie {...config} data={allAssignedTaskByProject} />
      </div>
      <div className="rounded-md border-2 border-dashed border-gray-300 p-2">
        <h4 className="text-primary-500 m-2 font-semibold">
          Completed Task By Project
        </h4>
        <Pie {...config} data={completedTaskByProject} />
      </div>
    </div>
  );
}
