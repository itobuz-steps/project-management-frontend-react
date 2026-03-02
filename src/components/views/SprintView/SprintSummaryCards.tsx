import { cards, type SprintSummaryCardsProps } from './sprintView.types';

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
