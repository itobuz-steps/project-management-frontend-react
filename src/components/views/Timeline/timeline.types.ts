export interface GanttItem {
  key: string;
  label: string;
  start: Date;
  end: Date;
  startLabel: string;
  endLabel: string;
  status: string;
  type: 'Sprint' | 'Task';
  lane: number;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  item: GanttItem | null;
}

export interface TimelineRow {
  label: string;
  items: GanttItem[];
  color: string;
}

export const TIMELINE_CONSTANTS = {
  BAR_HEIGHT: 28,
  BAR_GAP: 6,
  LANE_HEIGHT: 28 + 6,
  LABEL_WIDTH: 80,
  ROW_GAP: 24,
  MARGIN: { top: 8, bottom: 40, left: 80, right: 16 },
  MIN_ZOOM: 1,
  MAX_ZOOM: 8,
};
