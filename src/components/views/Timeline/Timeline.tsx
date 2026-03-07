import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { createSprintService } from '../../../services/sprints.service';
import { getTasks } from '../../../services/taskService';
import type { Sprint } from '../../../services/types/sprints.types';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import { useTheme } from '../../../hooks/useTheme';
import { THEME_COLORS } from '../../../config/constants';
import { scaleTime } from 'd3-scale';
import { timeMonth } from 'd3-time';

import {
  type GanttItem,
  type TooltipState,
  TIMELINE_CONSTANTS,
} from './timeline.types';
import { TimelineChart } from './TimelineChart';
import { assignLanes } from './timelineUtils';
import { TimelineTooltip } from './TimelineTooltip';
import { ZoomControls } from './ZoomControls';
import dayjs from 'dayjs';

const { LANE_HEIGHT, ROW_GAP, MARGIN, MIN_ZOOM, MAX_ZOOM, BAR_GAP } =
  TIMELINE_CONSTANTS;

const Timeline = () => {
  const { projectId } = useParams();
  const [theme] = useTheme();
  const themeColors = THEME_COLORS[theme];
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const ro = new ResizeObserver(([entry]) =>
      setContainerWidth(entry.contentRect.width)
    );
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    const sprintService = createSprintService(projectId);
    const load = async () => {
      try {
        setLoading(true);
        const [sprintsData, tasksData] = await Promise.all([
          sprintService.getSprints(),
          getTasks({ projectId }),
        ]);
        setSprints(sprintsData);
        setTasks(
          tasksData.filter((task) => {
            const due = task.dueDate;
            return task.createdAt && due;
          })
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  const rows = useMemo(() => {
    const makeSprintItem = (sprint: Sprint): Omit<GanttItem, 'lane'> => {
      const start = dayjs(sprint.createdAt).toDate();
      const end = dayjs(sprint.endDate || sprint.dueDate).toDate();
      let status = 'Planned';
      if (sprint.isCompleted) {
        status = 'Completed';
      } else if (dayjs().isAfter(start) && dayjs().isBefore(end)) {
        status = 'Active';
      }
      return {
        key: sprint.key,
        label: sprint.key,
        start,
        end,
        startLabel: dayjs(start).format('DD MMM YYYY'),
        endLabel: dayjs(end).format('DD MMM YYYY'),
        status,
        type: 'Sprint',
      };
    };

    const makeTaskItem = (task: TaskPopulated): Omit<GanttItem, 'lane'> => {
      const start = dayjs(task.createdAt).toDate();
      const due = task.dueDate;
      const end = dayjs(due).toDate();
      let status = 'Pending';
      if (task.status === 'done' || task.status === 'Done') {
        status = 'Completed';
      } else if (
        task.status === 'in-progress' ||
        task.status === 'In Progress'
      ) {
        status = 'In Progress';
      } else if (dayjs().isAfter(end)) {
        status = 'Overdue';
      }
      return {
        key: task.key || 'unknown-key',
        label: task.key || 'Unknown Task',
        start,
        end,
        startLabel: dayjs(start).format('DD MMM YYYY'),
        endLabel: dayjs(end).format('DD MMM YYYY'),
        status,
        type: 'Task',
      };
    };

    return [
      {
        label: 'Sprints',
        items: assignLanes(sprints.map(makeSprintItem)),
        color: themeColors[2],
      },
      {
        label: 'Tasks',
        items: assignLanes(tasks.map(makeTaskItem)),
        color: themeColors[3],
      },
    ].filter((row) => row.items.length);
  }, [sprints, tasks, themeColors]);

  const [minDate, maxDate] = useMemo(() => {
    const all = rows.flatMap((row) => row.items);
    if (!all.length) {
      return [new Date(), new Date()];
    }
    return [
      new Date(Math.min(...all.map((i) => i.start.getTime()))),
      new Date(Math.max(...all.map((i) => i.end.getTime()))),
    ];
  }, [rows]);

  // innerWidth grows with zoom — container scrolls horizontally
  const baseWidth = Math.max(containerWidth - MARGIN.left - MARGIN.right, 0);
  const innerWidth = baseWidth * zoom;

  const timeScale = useMemo(
    () => scaleTime().domain([minDate, maxDate]).range([0, innerWidth]),
    [minDate, maxDate, innerWidth]
  );

  const ticks = useMemo(
    () => timeMonth.range(timeMonth.floor(minDate), maxDate),
    [minDate, maxDate]
  );

  const rowOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let y = 0;
    rows.forEach((row) => {
      offsets[row.label] = y;
      const laneCount = Math.max(...row.items.map((i) => i.lane)) + 1;
      y += laneCount * LANE_HEIGHT - BAR_GAP + ROW_GAP;
    });
    return offsets;
  }, [rows]);

  const totalInnerHeight = useMemo(
    () =>
      rows.reduce((sum, row) => {
        const laneCount = Math.max(...row.items.map((i) => i.lane)) + 1;
        return sum + laneCount * LANE_HEIGHT - BAR_GAP + ROW_GAP;
      }, 0),
    [rows]
  );

  const todayX = timeScale(new Date());
  const hasData = rows.length;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGGElement>, item: GanttItem) => {
      const rect = scrollRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        item,
      });
    },
    []
  );

  const handleZoomIn = () => setZoom((zoom) => Math.min(zoom + 0.5, MAX_ZOOM));
  const handleZoomOut = () => setZoom((zoom) => Math.max(zoom - 0.5, MIN_ZOOM));
  const handleReset = () => setZoom(1);

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm" ref={containerRef}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Timeline</h2>

        {/* Zoom controls */}
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : !hasData ? (
        <div>No sprints or tasks with due dates found for this project.</div>
      ) : (
        <div
          ref={scrollRef}
          style={{ position: 'relative', overflowX: 'auto' }}
        >
          <TimelineChart
            rows={rows}
            timeScale={timeScale}
            rowOffsets={rowOffsets}
            innerWidth={innerWidth}
            ticks={ticks}
            totalInnerHeight={totalInnerHeight}
            todayX={todayX}
            onItemHover={handleMouseMove}
            onItemLeave={() =>
              setTooltip((t) => ({ ...t, visible: false, item: null }))
            }
          />

          {/* Tooltip */}
          {tooltip.visible && tooltip.item && <TimelineTooltip {...tooltip} />}
        </div>
      )}
    </div>
  );
};

export default Timeline;
