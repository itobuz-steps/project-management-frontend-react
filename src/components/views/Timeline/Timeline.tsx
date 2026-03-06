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

  console.table(
    sprints.map((s) => {
      return {
        start: dayjs(s.createdAt).format('DD MMM YYYY'),
        end: dayjs(s.endDate || s.dueDate).format('DD MMM YYYY'),
        key: s.key,
      };
    })
  );

  const chartData = useMemo(() => {
    return sprints.map((sprint) => {
      const start = dayjs(sprint.createdAt);
      const end = dayjs(sprint.endDate || sprint.dueDate);
      const duration = Math.max(end.diff(start, 'day'), 1);
      let status = 'Planned';
      if (sprint.isCompleted) status = 'Completed';
      else if (dayjs().isAfter(start) && dayjs().isBefore(end))
        status = 'Active';
      return {
        sprint: `${sprint.key} (${start.format('DD MMM')} - ${end.format('DD MMM')})`,
        sprintKey: sprint.key,
        duration,
        status,
        start: start.date(),
        end: end.date(),
      };
    });
  }, [sprints]);

  const config = {
    data: chartData,
    xField: 'sprintKey',
    yField: ['start', 'end'],
    seriesField: undefined,
    coordinate: { transpose: true },
    colorField: 'sprintKey',
    scale: {
      color: {
        range: [themeColors[4]],
      },
    },
    legend: false,
    barStyle: { radius: [6, 6, 4, 4] },
    tooltip: {
      title: (data: { sprint: string }) => data.sprint,
      items: [
        (datum: { start: Date }) => ({
          name: 'Start',
          value: datum.start,
        }),
        (datum: { end: Date }) => ({
          name: 'End',
          value: datum.end,
        }),
        (datum: { duration: number }) => ({
          name: 'Duration',
          value: `${datum.duration} days`,
        }),
        (datum: { status: string }) => ({
          name: 'Status',
          value: datum.status,
        }),
      ],
    },
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Sprint Timeline</h2>
      {loading ? (
        <div>Loading...</div>
      ) : chartData.length === 0 ? (
        <div>No sprints found for this project.</div>
      ) : (
        <Bar {...config} />
      )}
    </div>
  );
};

export default Timeline;
