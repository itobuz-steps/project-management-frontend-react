import type { ScaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import type { GanttItem, TimelineRow } from './timeline.types';
import { TIMELINE_CONSTANTS } from './timeline.types';

const { BAR_HEIGHT, BAR_GAP, LANE_HEIGHT, MARGIN } = TIMELINE_CONSTANTS;

const formatTick = timeFormat('%b %Y');

interface TimelineChartProps {
  colorMode: 'light' | 'dark';
  rows: TimelineRow[];
  timeScale: ScaleTime<number, number>;
  ticks: Date[];
  innerWidth: number;
  totalInnerHeight: number;
  todayX: number;
  rowOffsets: Record<string, number>;
  onItemHover: (e: React.MouseEvent<SVGGElement>, item: GanttItem) => void;
  onItemLeave: () => void;
}

export const TimelineChart = ({
  colorMode,
  rows,
  timeScale,
  ticks,
  innerWidth,
  totalInnerHeight,
  todayX,
  rowOffsets,
  onItemHover,
  onItemLeave,
}: TimelineChartProps) => {
  const isDark = colorMode === 'dark';
  const svgHeight = totalInnerHeight + MARGIN.top + MARGIN.bottom;
  const svgWidth = innerWidth + MARGIN.left + MARGIN.right;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        {/* Grid columns */}
        {ticks.map((tick) => (
          <line
            key={tick.toISOString()}
            x1={timeScale(tick)}
            x2={timeScale(tick)}
            y1={0}
            y2={totalInnerHeight}
            stroke={isDark ? 'rgba(148,163,184,0.22)' : 'rgba(0,0,0,0.06)'}
            strokeDasharray="3,3"
          />
        ))}

        {/* Rows */}
        {rows.map((row) => {
          const rowY = rowOffsets[row.label];
          const laneCount = Math.max(...row.items.map((i) => i.lane)) + 1;
          const trackHeight = laneCount * LANE_HEIGHT - BAR_GAP;

          return (
            <g key={row.label} transform={`translate(0, ${rowY})`}>
              <text
                x={-8}
                y={trackHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight={600}
                fill={isDark ? '#cbd5e1' : '#475569'}
              >
                {row.label}
              </text>
              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={trackHeight}
                fill={isDark ? '#0f172a' : '#f1f5f9'}
                rx={6}
              />
              {row.items.map((item) => {
                const x = timeScale(item.start);
                const barWidth = Math.max(timeScale(item.end) - x, 4);
                const y = item.lane * LANE_HEIGHT;
                return (
                  <g
                    key={item.key}
                    style={{ cursor: 'pointer' }}
                    onMouseMove={(e) => onItemHover(e, item)}
                    onMouseLeave={onItemLeave}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={BAR_HEIGHT}
                      fill={row.color}
                      rx={5}
                      opacity={0.85}
                    />
                    {barWidth > 30 && (
                      <text
                        x={x + 7}
                        y={y + BAR_HEIGHT / 2}
                        dominantBaseline="middle"
                        fontSize={11}
                        fontWeight={600}
                        fill="#fff"
                        style={{
                          pointerEvents: 'none',
                          userSelect: 'none',
                        }}
                      >
                        {item.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Today line - rendered last so it appears on top */}
        {todayX >= 0 && todayX <= innerWidth && (
          <line
            x1={todayX}
            x2={todayX}
            y1={-4}
            y2={totalInnerHeight + 4}
            stroke="#ef4444"
            strokeWidth={2}
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* X axis */}
        <g transform={`translate(0, ${totalInnerHeight + 8})`}>
          {ticks.map((tick) => (
            <text
              key={tick.toISOString()}
              x={timeScale(tick)}
              y={12}
              textAnchor="middle"
              fontSize={11}
              fill={isDark ? '#94a3b8' : '#64748b'}
            >
              {formatTick(tick)}
            </text>
          ))}
        </g>
      </g>
    </svg>
  );
};
