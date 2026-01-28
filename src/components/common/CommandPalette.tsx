import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function CommandPalette({
  open,
  onClose,
  value,
  onChange,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // focus input when opened
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // esc to close
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Palette */}
      <div className="relative mx-auto mt-[20vh] w-full max-w-xl rounded-xl bg-white text-black shadow-2xl">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search tasks by key, title, or description…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-t-xl bg-white px-4 py-4 text-lg outline-none placeholder:text-neutral-400"
        />

        <div className="border-t border-neutral-800 px-4 py-3 text-sm text-neutral-400">
          Press <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>,
    document.body
  );
}
