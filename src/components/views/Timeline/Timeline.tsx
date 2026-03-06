import { useEffect, useState, useMemo } from 'react';
import { Bar } from '@ant-design/plots';
import { useParams } from 'react-router-dom';
import { createSprintService } from '../../../services/sprints.service';
import type { Sprint } from '../../../services/types/sprints.types';
import { useTheme } from '../../../hooks/useTheme';
import { THEME_COLORS } from '../../../config/constants';
import dayjs from 'dayjs';

const Timeline = () => {
  const { projectId } = useParams();
  const [theme] = useTheme();
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const sprintService = createSprintService(projectId);

    const load = async () => {
      try {
        setLoading(true);
        const data = await sprintService.getSprints();
        setSprints(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  const chartData = useMemo(() => {
    return sprints.map((sprint, i) => {
      const start = dayjs(sprint.createdAt);
      const end = dayjs(sprint.endDate || sprint.dueDate);

      let status = 'Planned';
      if (sprint.isCompleted) {
        status = 'Completed';
      } else if (dayjs().isAfter(start) && dayjs().isBefore(end)) {
        status = 'Active';
      }

      return {
        sprintKey: sprint.key,
        sprintLabel: `${sprint.key} (${start.format('DD MMM')} - ${end.format('DD MMM')})`,
        start: start.valueOf(),
        end: end.valueOf(),
        startLabel: start.format('DD MMM YYYY'),
        endLabel: end.format('DD MMM YYYY'),
        status,
        colorIndex: i % themeColors.length,
      };
    });
  }, [sprints, themeColors]);

  const config = {
    data: chartData,

    xField: 'sprintKey',
    yField: ['start', 'end'],

    coordinate: { transpose: true },

    colorField: themeColors[3],

    legend: false,

    style: {
      radius: 6,
    },

    axis: {
      y: {
        labelFormatter: (value: number) => dayjs(value).format('MMM YYYY'),
      },
    },

    autoFit: true,

    tooltip: {
      title: (data: { sprintLabel: string }) => data.sprintLabel,
      items: [
        (data: { startLabel: string }) => ({
          name: 'Start',
          value: data.startLabel,
        }),
        (data: { endLabel: string }) => ({ name: 'End', value: data.endLabel }),

        (data: { status: string }) => ({ name: 'Status', value: data.status }),
      ],
    },
  };
  const chartWidth = Math.max(800, chartData.length * 150);
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Sprint Timeline</h2>
      {loading ? (
        <div>Loading...</div>
      ) : chartData.length === 0 ? (
        <div>No sprints found for this project.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ width: chartWidth }}>
            <Bar {...config} autoFit={false} width={chartWidth} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
