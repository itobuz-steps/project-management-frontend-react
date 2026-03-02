import { useEffect, useMemo, useState } from 'react';
import { createSprintService } from '../services/sprints.service';
import type {
  Sprint,
  SprintCompletionSummary,
} from '../services/types/sprints.types';
import type { TaskPopulated } from '../services/types/tasks.types';
import type {
  StatusPieItem,
  PriorityColumnItem,
  StoryPointItem,
  SprintStats,
} from '../components/views/SprintView/sprintView.types';

const PRIORITIES = ['low', 'medium', 'high'] as const;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function useSprintReport(projectId?: string) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [summary, setSummary] = useState<SprintCompletionSummary | null>(null);
  const [removedTasks, setRemovedTasks] = useState<TaskPopulated[]>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const sprintService = useMemo(
    () => (projectId ? createSprintService(projectId) : null),
    [projectId]
  );

  // Load completed sprints
  useEffect(() => {
    if (!sprintService) {
      return;
    }
    const load = async () => {
      setLoadingSprints(true);
      try {
        const all = await sprintService.getSprints();
        const completed = all.filter((sprint) => sprint.isCompleted);
        setSprints(completed);
        if (completed.length > 0) {
          setSelectedSprintId(completed[0]._id);
        }
      } catch {
        setSprints([]);
      } finally {
        setLoadingSprints(false);
      }
    };

    load();
  }, [sprintService]);

  // Load sprint data when selection changes
  useEffect(() => {
    if (!sprintService || !selectedSprintId) {
      setSummary(null);
      setRemovedTasks([]);
      return;
    }

    const load = async () => {
      setLoadingData(true);
      try {
        const [summaryRes, removedRes] = await Promise.all([
          sprintService.getSprintCompletionSummary(selectedSprintId),
          sprintService.getTasksRemovedDuringSprint(selectedSprintId),
        ]);
        setSummary(summaryRes);
        setRemovedTasks(removedRes);
      } catch {
        setSummary(null);
        setRemovedTasks([]);
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [sprintService, selectedSprintId]);

  // — Derived data —

  const stats: SprintStats = useMemo(() => {
    const completedCount = summary?.completed.length ?? 0;
    const pendingCount = summary?.pending.length ?? 0;
    return {
      totalTasks: completedCount + pendingCount,
      completedCount,
      pendingCount,
      removedCount: removedTasks.length,
    };
  }, [summary, removedTasks]);

  const statusPieData: StatusPieItem[] = useMemo(
    () => [
      { type: 'Completed', value: stats.completedCount },
      { type: 'Pending', value: stats.pendingCount },
    ],
    [stats.completedCount, stats.pendingCount]
  );

  const typeBreakdownData: StatusPieItem[] = useMemo(() => {
    if (!summary) {
      return [];
    }
    const allTasks = [...summary.completed, ...summary.pending];
    const counts: Record<string, number> = {};
    allTasks.forEach((task) => {
      counts[task.type] = (counts[task.type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, value]) => ({ type, value }));
  }, [summary]);

  const priorityColumnData: PriorityColumnItem[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    return PRIORITIES.flatMap((priority) => [
      {
        priority: capitalize(priority),
        status: 'Completed',
        count: summary.completed.filter((task) => task.priority === priority)
          .length,
      },
      {
        priority: capitalize(priority),
        status: 'Pending',
        count: summary.pending.filter((task) => task.priority === priority)
          .length,
      },
    ]);
  }, [summary]);

  const storyPointData: StoryPointItem[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    const sumPoints = (tasks: TaskPopulated[]) =>
      tasks.reduce((sum, task) => sum + (task.storyPoint ?? 0), 0);

    return [
      { category: 'Completed', points: sumPoints(summary.completed) },
      { category: 'Pending', points: sumPoints(summary.pending) },
      { category: 'Removed', points: sumPoints(removedTasks) },
    ];
  }, [summary, removedTasks]);

  return {
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
  };
}
