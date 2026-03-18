import { TIMELINE_CONSTANTS } from './timeline.types';

interface ZoomControlsProps {
  colorMode: 'light' | 'dark';
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ZoomControls = ({
  colorMode,
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) => {
  const { MIN_ZOOM, MAX_ZOOM } = TIMELINE_CONSTANTS;
  const isDark = colorMode === 'dark';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={onZoomOut}
        disabled={zoom <= MIN_ZOOM}
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
          background:
            zoom <= MIN_ZOOM
              ? isDark
                ? '#141414'
                : '#f8fafc'
              : isDark
                ? '#27272e'
                : '#fff',
          color:
            zoom <= MIN_ZOOM
              ? isDark
                ? '#737373'
                : '#cbd5e1'
              : isDark
                ? '#d4d4d4'
                : '#475569',
          cursor: zoom <= MIN_ZOOM ? 'not-allowed' : 'pointer',
          fontSize: 16,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        −
      </button>
      <span
        style={{
          fontSize: 12,
          color: isDark ? '#a3a3a3' : '#64748b',
          minWidth: 40,
          textAlign: 'center',
        }}
      >
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        disabled={zoom >= MAX_ZOOM}
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
          background:
            zoom >= MAX_ZOOM
              ? isDark
                ? '#141414'
                : '#f8fafc'
              : isDark
                ? '#27272e'
                : '#fff',
          color:
            zoom >= MAX_ZOOM
              ? isDark
                ? '#737373'
                : '#cbd5e1'
              : isDark
                ? '#d4d4d4'
                : '#475569',
          cursor: zoom >= MAX_ZOOM ? 'not-allowed' : 'pointer',
          fontSize: 16,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        +
      </button>
      <button
        onClick={onReset}
        style={{
          height: 28,
          padding: '0 10px',
          borderRadius: 6,
          border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
          background: isDark ? '#27272e' : '#fff',
          color: isDark ? '#d4d4d4' : '#475569',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        Reset
      </button>
    </div>
  );
};
