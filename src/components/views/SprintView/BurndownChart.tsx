import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
} from 'recharts';
import type { BurndownChartProps } from './sprintView.types';
import {
  STATUS_CONFIG,
  CHART_COLORS,
  fetchBurndown,
  getMetricCards,
} from './sprintView.config';

export function BurndownChart({ projectId, sprintId }: BurndownChartProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['burndown', projectId, sprintId],
    queryFn: () => fetchBurndown(projectId, sprintId),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Loading burndown...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-500">
        Failed to load burndown data
      </div>
    );
  }

  const { sprint, summary, series, scopeChanges } = data;
  const statusCfg = STATUS_CONFIG[summary.status];
  const metricCards = getMetricCards(summary);

  return (
    <div className="w-full font-sans">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {sprint.key} — Burndown
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {sprint.startDate} → {sprint.endDate} · {sprint.totalWorkingDays}{' '}
            working days
          </p>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-xs font-medium"
          style={{
            color: statusCfg.color,
            background: statusCfg.bg,
            borderColor: statusCfg.border,
          }}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* Metric cards */}
      <div className="mb-5 grid grid-cols-4 gap-2.5">
        {metricCards.map(({ label, value, unit, color }) => (
          <div
            key={label}
            className="rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-3 dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="mb-1 text-xs tracking-wide text-gray-400 uppercase">
              {label}
            </p>
            <p className="text-xl font-semibold">
              <span
                style={{ color: color ?? undefined }}
                className={!color ? 'text-gray-900 dark:text-white' : ''}
              >
                {value}
              </span>
              {unit && (
                <span className="ml-0.5 text-sm font-normal text-gray-400">
                  {unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={series}
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip />
          <Legend
            iconType="plainline"
            iconSize={16}
            formatter={(value) => (
              <span className="text-xs text-gray-500">
                {value === 'ideal' ? 'Ideal burndown' : 'Actual remaining'}
              </span>
            )}
          />
          <Line
            type="linear"
            dataKey="ideal"
            stroke={CHART_COLORS.ideal}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke={CHART_COLORS.actual}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.actual, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          {scopeChanges.map((sc) => (
            <ReferenceDot
              key={sc.date}
              x={sc.date}
              y={sc.actual}
              r={5}
              fill={CHART_COLORS.actual}
              stroke="#fff"
              strokeWidth={2}
              label={{
                value: `+${sc.pointsAdded}`,
                position: 'top',
                fontSize: 10,
                fill: CHART_COLORS.actual,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Variance footer */}
      <div
        className="mt-3.5 rounded-lg border px-3.5 py-2.5 text-xs"
        style={{
          background: statusCfg.bg,
          borderColor: statusCfg.border,
          color: statusCfg.color,
        }}
      >
        Variance:
        <strong>
          {summary.variance > 0 ? '+' : ''}
          {summary.variance} pts
        </strong>{' '}
        ({summary.variancePct > 0 ? '+' : ''}
        {summary.variancePct}% vs ideal)
        {summary.variance > 0
          ? ' — team is behind the ideal pace'
          : summary.variance < 0
            ? ' — team is ahead of the ideal pace'
            : ' — team is exactly on pace'}
      </div>
    </div>
  );
}
