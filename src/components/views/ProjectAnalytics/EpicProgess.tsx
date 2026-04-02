import {
  EPIC_PROGRESS_LEGEND,
  getProgressColorClass,
  getProgressLabel,
} from '../../../config/constants';

import type { ProjectAnalytics } from '../../../services/types/analytics.type';

export function EpicProgress({
  data,
}: {
  data: ProjectAnalytics['epicProgress'];
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        {EPIC_PROGRESS_LEGEND.map(({ label, className }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 shrink-0 rounded-sm ${className}`} />
            <span className="text-[13px] text-gray-500 dark:text-slate-400">
              {label}
            </span>
          </div>
        ))}
      </div>

      {data.map((epic) => {
        const colorClass = getProgressColorClass(epic.percentage);
        const labelIsOverBar = epic.percentage > 15;

        return (
          <div key={String(epic.epicId)} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-semibold text-gray-500 dark:text-slate-400">
                {epic.key}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {epic.title}
              </span>
            </div>

            <div className="relative h-8 overflow-hidden rounded-md bg-gray-100 dark:bg-white/8">
              <div
                className={`h-full rounded-md transition-[width] duration-600 ease-in-out ${colorClass}`}
                style={{
                  width: `${epic.percentage}%`,
                  minWidth: epic.percentage > 0 ? 40 : 0,
                }}
              />

              <span
                className={`absolute top-1/2 left-3 -translate-y-1/2 text-[13px] font-bold ${
                  labelIsOverBar
                    ? 'text-white'
                    : 'text-gray-900 dark:text-slate-100'
                }`}
              >
                {epic.percentage > 0
                  ? `${epic.percentage}%`
                  : getProgressLabel(epic.percentage)}
              </span>

              {epic.total > 0 && (
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500 dark:text-slate-400">
                  {epic.completed}/{epic.total}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
