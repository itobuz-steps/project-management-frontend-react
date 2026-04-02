import { useColorMode } from '../../../hooks/useColorMode';
import type { ProjectAnalytics } from '../../../services/types/analytics.type';

function getProgressColor(percentage: number): string {
  if (percentage === 0) return '#94a3b8';
  if (percentage < 40) return '#f87171';
  if (percentage < 70) return '#3b82f6';
  return '#4ade80';
}

function getProgressLabel(percentage: number): string {
  if (percentage === 0) return 'To do';
  if (percentage === 100) return 'Done';
  return 'In progress';
}

export function EpicProgress({
  data,
}: {
  data: ProjectAnalytics['epicProgress'];
}) {
  const [colorMode] = useColorMode();
  const isDark = colorMode === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#111827';
  const mutedColor = isDark ? '#94a3b8' : '#6b7280';
  const trackColor = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {[
          { label: 'Done', color: '#4ade80' },
          { label: 'In progress', color: '#3b82f6' },
          { label: 'To do', color: '#94a3b8' },
        ].map(({ label, color }) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: mutedColor }}>{label}</span>
          </div>
        ))}
      </div>

      {data.map((epic) => {
        const color = getProgressColor(epic.percentage);
        return (
          <div
            key={String(epic.epicId)}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {/* Epic key + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: mutedColor,
                  fontFamily: 'monospace',
                }}
              >
                {epic.key}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: textColor }}>
                {epic.title}
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                height: 32,
                borderRadius: 6,
                background: trackColor,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${epic.percentage}%`,
                  background: color,
                  borderRadius: 6,
                  transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                  minWidth: epic.percentage > 0 ? 40 : 0,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: epic.percentage > 15 ? '#fff' : textColor,
                }}
              >
                {epic.percentage > 0
                  ? `${epic.percentage}%`
                  : getProgressLabel(epic.percentage)}
              </span>
              {epic.total > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 12,
                    color: mutedColor,
                  }}
                >
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
