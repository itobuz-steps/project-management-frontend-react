import { useEffect, useRef, useState } from 'react';

interface UseResizableDrawerOptions {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  enabled?: boolean;
}

interface UseResizableDrawerResult {
  drawerWidth: number;
  startResizing: () => void;
}

export function useResizableDrawer({
  initialWidth,
  minWidth,
  maxWidth,
  enabled = true,
}: UseResizableDrawerOptions): UseResizableDrawerResult {
  const [drawerWidth, setDrawerWidth] = useState(initialWidth);
  const isResizingRef = useRef(false);

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      if (!enabled || !isResizingRef.current) {
        return;
      }

      const nextWidth = window.innerWidth - event.clientX;
      const clampedWidth = Math.min(maxWidth, Math.max(minWidth, nextWidth));
      setDrawerWidth(clampedWidth);
    }

    function onMouseUp() {
      isResizingRef.current = false;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [enabled, maxWidth, minWidth]);

  function startResizing() {
    if (!enabled) {
      return;
    }
    isResizingRef.current = true;
  }

  return {
    drawerWidth,
    startResizing,
  };
}
