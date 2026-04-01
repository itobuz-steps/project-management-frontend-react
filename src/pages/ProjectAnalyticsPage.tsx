import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography } from 'antd';
import { Pie, Column, Bar } from '@ant-design/plots';
import { DataLoader } from '../components/ui/DataLoader';
import { getProjectAnalytics } from '../services/analyticsService';
import type { ProjectAnalytics } from '../services/types/analytics.type';
import { useTheme } from '../hooks/useTheme';
import { THEME_COLORS } from '../config/constants';

const STATUS_COLORS: Record<string, string> = {
  todo: '#94a3b8',
  'in-progress': '#3b82f6',
  review: '#f59e0b',
  done: '#22c55e',
  DEPLOYMENT: '#8b5cf6',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-gray-200 shadow-sm dark:border-slate-700">
      <div className="mb-4">
        <Typography.Title level={5} className="mb-0.5!">
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" className="text-xs">
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {children}
    </Card>
  );
}

function StatusOverview({
  data,
  themeColors,
}: {
  data: ProjectAnalytics['statusOverview'];
  themeColors: string[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const config = {
    data,
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    innerRadius: 0.5,
    legend: {
      color: {
        position: 'bottom' as const,
        layout: { justifyContent: 'center' as const },
      },
    },
    color: ({ status }: { status: string }) =>
      STATUS_COLORS[status] ?? themeColors[4],
    tooltip: {
      items: [{ channel: 'y' as const, name: 'Tasks' }],
    },
    annotations: [
      {
        type: 'text' as const,
        style: {
          text: String(total),
          x: '50%',
          y: '50%',
          textAlign: 'center' as const,
          fontSize: 26,
          fontWeight: 'bold',
        },
      },
    ],
  };

  return <Pie {...config} height={320} />;
}

function PriorityBreakdown({
  data,
}: {
  data: ProjectAnalytics['priorityBreakdown'];
}) {
  const config = {
    data,
    xField: 'priority',
    yField: 'count',
    colorField: 'priority',
    color: ({ priority }: { priority: string }) =>
      PRIORITY_COLORS[priority] ?? '#94a3b8',
    tooltip: {
      items: [{ channel: 'y' as const, name: 'Tasks' }],
    },
    axis: {
      x: { labelTransform: 'capitalize' },
    },
  };

  return <Column {...config} height={320} />;
}

function TypesOfWork({
  data,
}: {
  data: ProjectAnalytics['typesOfWork'];
  themeColors: string[];
}) {
  const config = {
    data,
    yField: 'type',
    xField: 'count',
    colorField: 'type',
    tooltip: {
      items: [{ channel: 'x' as const, name: 'Tasks' }],
    },
    style: {
      minWidth: 30,
      maxWidth: 30,
    },
  };

  return <Bar {...config} height={Math.max(160, data.length * 50)} />;
}

function TeamWorkload({
  data,
  themeColors,
}: {
  data: ProjectAnalytics['teamWorkload'];
  themeColors: string[];
}) {
  const config = {
    data: [...data].sort((a, b) => a.count - b.count),
    yField: 'name',
    xField: 'count',
    colorField: 'name',
    color: themeColors[5],
    tooltip: {
      items: [{ channel: 'x' as const, name: 'Open Tasks' }],
    },
    axis: {
      y: false,
    },
    style: {
      minWidth: 20,
      maxWidth: 30,
    },
  };

  return <Bar {...config} height={Math.max(160, data.length * 40)} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectAnalyticsPage() {
  const { projectId } = useParams();
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [theme] = useTheme();
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];

  useEffect(() => {
    if (!projectId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectAnalytics(projectId);
        setAnalytics(data);
      } catch {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-slate-200">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-1">
      {/* Header card */}
      <Card className="border-gray-200 shadow-sm dark:border-slate-700">
        <Typography.Title level={4} className="mb-1!">
          Project Analytics
        </Typography.Title>
        <Typography.Text type="secondary">
          Overview of tasks, team workload, and project progress.
        </Typography.Text>
      </Card>

      <DataLoader
        loading={loading}
        isEmpty={!loading && !analytics}
        emptyText={error ?? 'No analytics data available'}
      >
        {analytics && (
          <>
            {/* Row 1 — Status Overview + Priority Breakdown */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SectionCard
                title="Status Overview"
                subtitle="Distribution of tasks by current status"
              >
                <StatusOverview
                  data={analytics.statusOverview}
                  themeColors={themeColors}
                />
              </SectionCard>

              <SectionCard
                title="Priority Breakdown"
                subtitle="Number of tasks per priority level"
              >
                <PriorityBreakdown data={analytics.priorityBreakdown} />
              </SectionCard>
            </div>

            {/* Row 2 — Types of Work + Team Workload */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SectionCard
                title="Types of Work"
                subtitle="Tasks grouped by type"
              >
                <TypesOfWork
                  data={analytics.typesOfWork}
                  themeColors={themeColors}
                />
              </SectionCard>

              <SectionCard
                title="Team Workload"
                subtitle="Open tasks assigned per team member"
              >
                <TeamWorkload
                  data={analytics.teamWorkload}
                  themeColors={themeColors}
                />
              </SectionCard>
            </div>
          </>
        )}
      </DataLoader>
    </div>
  );
}
