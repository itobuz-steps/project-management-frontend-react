import { Button, Card, Tag } from 'antd';
import { motion } from 'framer-motion';
import type { ParsedPreview } from '../importTypes';

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-lg font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export default function ResultCard({
  preview,
  serverRowErrors,
  serverMessage,
  isLoading,
  onConfirm,
  onReset,
}: {
  preview: ParsedPreview;
  serverRowErrors: string[];
  serverMessage: string | null;
  isLoading: boolean;
  onConfirm: () => void;
  onReset: () => void;
}) {
  const hasTasks = preview.tasks.length > 0;
  const displayErrors = serverRowErrors.length
    ? serverRowErrors
    : preview.clientErrors;
  const hasDisplayErrors = displayErrors.length > 0;
  const isServerError = serverRowErrors.length > 0;

  const canImport = hasTasks && !isLoading;

  return (
    <Card className="overflow-hidden border">
      {/* Stats row */}
      <div className="flex items-center gap-4 px-4 py-2">
        <Stat label="Parsed" value={preview.total} color="#6366f1" />
        <Stat label="Ready" value={preview.tasks.length} color="#10b981" />
        {preview.clientErrors.length > 0 && (
          <Stat
            label="Skipped"
            value={preview.clientErrors.length}
            color="#f59e0b"
          />
        )}
        {isServerError && (
          <span className="ml-auto text-xs font-semibold text-red-500">
            ⚠ Server rejected {serverRowErrors.length} row
            {serverRowErrors.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {serverMessage && (
        <div className="bg-red-50 px-4 py-2 text-xs text-red-600 dark:bg-slate-900 dark:text-red-400">
          <div className="flex gap-1">
            <span>⚠</span>
            <span>{serverMessage}</span>
          </div>
        </div>
      )}

      {hasDisplayErrors && (
        <div
          className={`max-h-28 overflow-y-auto px-4 py-2 text-xs ${
            isServerError
              ? 'bg-red-50 text-red-600 dark:bg-slate-900 dark:text-red-400'
              : 'bg-amber-50 text-amber-700 dark:bg-slate-900 dark:text-amber-400'
          }`}
        >
          {displayErrors.map((e, i) => (
            <div key={i} className="flex gap-1">
              <span>⚠</span>
              <span>{e}</span>
            </div>
          ))}
        </div>
      )}

      {hasTasks && (
        <div className="max-h-40 overflow-y-auto px-4 py-2">
          {preview.tasks.slice(0, 5).map((t, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <span className="flex-1 text-sm font-medium">{t.title}</span>
              {t.type && <Tag color="blue">{t.type}</Tag>}
              {t.priority && <Tag color="orange">{t.priority}</Tag>}
            </div>
          ))}
          {preview.tasks.length > 5 && (
            <div className="pt-2 text-center text-xs text-gray-400">
              +{preview.tasks.length - 5} more tasks…
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 px-4 py-2">
        <Button onClick={onReset} disabled={isLoading}>
          Cancel
        </Button>

        <motion.div whileTap={canImport ? { scale: 0.97 } : {}}>
          <Button
            type="primary"
            disabled={!canImport}
            loading={isLoading}
            onClick={canImport ? onConfirm : undefined}
          >
            {isLoading
              ? 'Importing…'
              : `Import ${preview.tasks.length} task${preview.tasks.length !== 1 ? 's' : ''}`}
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}
