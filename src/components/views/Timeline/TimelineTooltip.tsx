import type { GanttItem } from './timeline.types';

interface TimelineTooltipProps {
  colorMode: 'light' | 'dark';
  visible: boolean;
  x: number;
  y: number;
  item: GanttItem | null;
}

export const TimelineTooltip = ({
  colorMode,
  visible,
  x,
  y,
  item,
}: TimelineTooltipProps) => {
  if (!visible || !item) return null;

  const isDark = colorMode === 'dark';

  return (
    <div
      style={{
        position: 'absolute',
        left: x + 12,
        top: y - 8,
        background: isDark
          ? 'rgba(10, 10, 10, 0.82)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        border: isDark
          ? '1px solid rgba(115, 115, 115, 0.35)'
          : '1px solid rgba(148, 163, 184, 0.35)',
        color: isDark ? '#ededed' : '#0f172a',
        borderRadius: 12,
        padding: '12px 14px',
        fontSize: 12,
        pointerEvents: 'none',
        zIndex: 50,
        boxShadow: isDark
          ? '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.06)'
          : '0 8px 24px rgba(15, 23, 42, 0.12)',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 6,
          letterSpacing: '0.5px',
        }}
      >
        {item.label}
      </div>
      <div
        style={{
          color: isDark ? '#a3a3a3' : '#475569',
          marginBottom: 3,
          fontSize: 11,
        }}
      >
        Start:{' '}
        <span
          style={{ color: isDark ? '#ededed' : '#0f172a', fontWeight: 500 }}
        >
          {item.startLabel}
        </span>
      </div>
      <div
        style={{
          color: isDark ? '#a3a3a3' : '#475569',
          marginBottom: 3,
          fontSize: 11,
        }}
      >
        End:{' '}
        <span
          style={{ color: isDark ? '#ededed' : '#0f172a', fontWeight: 500 }}
        >
          {item.endLabel}
        </span>
      </div>
      <div
        style={{
          color: isDark ? '#a3a3a3' : '#475569',
          marginBottom: 3,
          fontSize: 11,
        }}
      >
        Status:{' '}
        <span
          style={{ color: isDark ? '#ededed' : '#0f172a', fontWeight: 500 }}
        >
          {item.status}
        </span>
      </div>
      <div style={{ color: isDark ? '#a3a3a3' : '#475569', fontSize: 11 }}>
        Type:{' '}
        <span
          style={{ color: isDark ? '#ededed' : '#0f172a', fontWeight: 500 }}
        >
          {item.type}
        </span>
      </div>
    </div>
  );
};
