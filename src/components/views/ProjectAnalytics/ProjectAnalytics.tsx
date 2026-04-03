import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography } from 'antd';
import { DataLoader } from '../../ui/DataLoader';
import { getProjectAnalytics } from '../../../services/analyticsService';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';
import { useTheme } from '../../../hooks/useTheme';
import { THEME_COLORS } from '../../../config/constants';
import { SectionCard } from './SectionCard';
import { StatusOverview } from './StatusOverview';
import { PriorityBreakdown } from './PriorityBreakdown';
import { TypesOfWork } from './TypesOfWork';
import { TeamWorkload } from './TeamWorkload';
import { EpicProgress } from './EpicProgess';

export default function ProjectAnalyticsPage() {
  const { projectId } = useParams();
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [theme] = useTheme();
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];

  useEffect(() => {
    if (!projectId) {
      return;
    }
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              {analytics.epicProgress.length > 0 && (
                <SectionCard title="Epic Progress">
                  <EpicProgress data={analytics.epicProgress} />
                </SectionCard>
              )}
            </div>
          </>
        )}
      </DataLoader>
    </div>
  );
}
