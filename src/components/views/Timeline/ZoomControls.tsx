import { TIMELINE_CONSTANTS } from './timeline.types';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ZoomControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) => {
  const { MIN_ZOOM, MAX_ZOOM } = TIMELINE_CONSTANTS;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={onZoomOut}
        disabled={zoom <= MIN_ZOOM}
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: '1px solid #e2e8f0',
          background: zoom <= MIN_ZOOM ? '#f8fafc' : '#fff',
          color: zoom <= MIN_ZOOM ? '#cbd5e1' : '#475569',
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
          color: '#94a3b8',
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
          border: '1px solid #e2e8f0',
          background: zoom >= MAX_ZOOM ? '#f8fafc' : '#fff',
          color: zoom >= MAX_ZOOM ? '#cbd5e1' : '#475569',
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
          border: '1px solid #e2e8f0',
          background: '#fff',
          color: '#475569',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        Reset
      </button>
    </div>
  );
};
