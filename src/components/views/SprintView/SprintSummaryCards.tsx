import type { SprintStats } from './sprintView.types';

interface SprintSummaryCardsProps {
  stats: SprintStats;
}

const cards = [
  {
    key: 'totalTasks' as const,
    label: 'Total Tasks',
    border: 'border-gray-200',
    bg: '',
    text: 'text-gray-800',
    subText: 'text-gray-500',
  },
  {
    key: 'completedCount' as const,
    label: 'Completed',
    border: 'border-green-200',
    bg: 'bg-green-50',
    text: 'text-green-700',
    subText: 'text-green-600',
  },
  {
    key: 'pendingCount' as const,
    label: 'Pending',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    subText: 'text-orange-600',
  },
  {
    key: 'removedCount' as const,
    label: 'Removed',
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-700',
    subText: 'text-red-600',
  },
];

export function SprintSummaryCards({ stats }: SprintSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map(({ key, label, border, bg, text, subText }) => (
        <div
          key={key}
          className={`rounded-lg border-2 ${border} ${bg} p-4 text-center`}
        >
          <p className={`text-2xl font-bold ${text}`}>{stats[key]}</p>
          <p className={`text-sm ${subText}`}>{label}</p>
        </div>
      ))}
    </div>
  );
}
