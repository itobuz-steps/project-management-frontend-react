import type { GanttItem } from './timeline.types';

interface TimelineTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  item: GanttItem | null;
}

export const TimelineTooltip = ({
  visible,
  x,
  y,
  item,
}: TimelineTooltipProps) => {
  if (!visible || !item) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x + 12,
        top: y - 8,
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        color: '#f1f5f9',
        borderRadius: 12,
        padding: '12px 14px',
        fontSize: 12,
        pointerEvents: 'none',
        zIndex: 50,
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
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
      <div style={{ color: '#cbd5e1', marginBottom: 3, fontSize: 11 }}>
        Start:{' '}
        <span style={{ color: '#f1f5f9', fontWeight: 500 }}>
          {item.startLabel}
        </span>
      </div>
      <div style={{ color: '#cbd5e1', marginBottom: 3, fontSize: 11 }}>
        End:{' '}
        <span style={{ color: '#f1f5f9', fontWeight: 500 }}>
          {item.endLabel}
        </span>
      </div>
      <div style={{ color: '#cbd5e1', marginBottom: 3, fontSize: 11 }}>
        Status:{' '}
        <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{item.status}</span>
      </div>
      <div style={{ color: '#cbd5e1', fontSize: 11 }}>
        Type:{' '}
        <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{item.type}</span>
      </div>
    </div>
  );
};
