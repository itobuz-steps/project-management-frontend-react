import type { GanttItem } from './timeline.types';

export function assignLanes(items: Omit<GanttItem, 'lane'>[]): GanttItem[] {
  const sorted = [...items].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  const laneEnds: number[] = [];
  return sorted.map((item) => {
    let lane = laneEnds.findIndex((end) => end <= item.start.getTime());
    if (lane === -1) {
      lane = laneEnds.length;
    }
    laneEnds[lane] = item.end.getTime();
    return { ...item, lane };
  });
}
