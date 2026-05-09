import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  CircleCheckBig,
  Folder,
  FolderOpen,
  Import,
  File as FileIcon,
} from 'lucide-react';
import { message } from 'antd';
import { useImportTasks } from '../../../hooks/useImportTasks';
import type { ParsedPreview } from './importTypes';
import parseCsvPreview, { sanitizeCsvForImport } from './utils/importHelpers';
import ResultCard from './components/ResultCard';

interface CsvImportSectionProps {
  projectId: string;
  onSuccess?: (importedCount: number, keys: string[]) => void;
}

export default function CsvImportSection({
  projectId,
  onSuccess,
}: CsvImportSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<ParsedPreview | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    importTasksAsync,
    isLoading,
    serverRowErrors,
    serverMessage,
    reset: resetMutation,
  } = useImportTasks(projectId);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv')) {
        alert('Please upload a .csv file.');
        return;
      }
      resetMutation();
      setRawFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const { csvText, droppedHeaders, cleanupWarnings } =
          sanitizeCsvForImport(text);
        const parsed = parseCsvPreview(csvText);

        const droppedMessage = droppedHeaders.length
          ? `Ignored extra CSV column${droppedHeaders.length !== 1 ? 's' : ''}: ${droppedHeaders.join(', ')}`
          : null;

        const transformedMessages = cleanupWarnings;

        setPreview({
          ...parsed,
          clientErrors: [
            ...(droppedMessage ? [droppedMessage] : []),
            ...transformedMessages,
            ...parsed.clientErrors,
          ],
        });

        const sanitizedFile = new File([csvText], file.name, {
          type: 'text/csv;charset=utf-8',
        });
        setRawFile(sanitizedFile);
      };
      reader.readAsText(file);
    },
    [resetMutation]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleConfirm = async () => {
    if (!rawFile || !preview || isLoading) return;

    try {
      const result = await importTasksAsync(rawFile);
      setImportedCount(result.importedCount);
      setPreview(null);
      setRawFile(null);
      setFileName(null);
      onSuccess?.(result.importedCount, result.keys);
      setTimeout(() => setImportedCount(null), 3500);
    } catch {
      message.error('Error importing tasks');
    }
  };

  const handleReset = () => {
    setPreview(null);
    setRawFile(null);
    setFileName(null);
    resetMutation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mt-7 overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-gray-700 dark:bg-slate-900"
    >
      <div
        className="flex cursor-pointer items-center justify-between rounded-t-lg border-b border-gray-100 px-4 py-3 select-none dark:border-gray-800 dark:bg-slate-900"
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Import className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="text-primary-600 dark:text-primary-400 text-sm font-semibold">
              Import Tasks via CSV
            </div>
            <div
              className="mt-0.5 text-gray-400 dark:text-gray-300"
              style={{ fontSize: 12 }}
            >
              Bulk-import tasks, stories, bugs and more from a spreadsheet
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="text-sm text-gray-400 dark:text-gray-500"
        >
          <ChevronDown />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-4">
              {/* ── Format instructions ── */}
              <div className="mb-4 rounded-lg border border-gray-100 bg-white dark:border-gray-700 dark:bg-slate-900">
                <div className="flex items-center gap-2 border-b border-gray-100 px-2 py-3.5 dark:border-gray-700">
                  <span
                    className="font-semibold text-gray-700 dark:text-gray-300"
                    style={{ fontSize: 12 }}
                  >
                    Required CSV Format
                  </span>
                </div>

                <div className="p-2">
                  <div
                    style={{ fontSize: 12 }}
                    className="mb-3 rounded-md border border-gray-300 bg-blue-50 px-4 py-2.5 dark:border-gray-800 dark:bg-blue-950"
                  >
                    <strong className="text-cyan-700 dark:text-cyan-200">
                      Header rules:{' '}
                    </strong>{' '}
                    Column headers must match the keywords exactly — casing
                    doesn't matter ( Title , TITLE , and title all work).
                    Spaces, underscores, and dashes inside the keyword are
                    stripped automatically, but the{' '}
                    <strong>word itself must be present</strong> — no
                    abbreviations or aliases. Extra columns are ignored
                    automatically. Only title is required. The{' '}
                    <strong>assignee</strong> column must be a member's{' '}
                    <strong>email address</strong> (not display name).
                  </div>
                </div>
              </div>

              <motion.div
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
                animate={{ scale: isDragging ? 1.012 : 1 }}
                transition={{ duration: 0.18 }}
                className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed px-4 py-5 transition-all ${
                  preview ? 'cursor-default' : 'cursor-pointer'
                } ${
                  isDragging
                    ? 'border-primary-500 bg-transparent'
                    : preview
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-transparent'
                }`}
              >
                <AnimatePresence>
                  {isDragging && (
                    <motion.div
                      key="shimmer"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 0.9,
                        ease: 'easeInOut',
                        repeat: Infinity,
                      }}
                      className="pointer-events-none absolute top-0 left-0 h-full w-1/2 bg-linear-to-r from-transparent to-transparent"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {importedCount !== null ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ duration: 0.45 }}
                        className="text-3xl"
                      >
                        <CircleCheckBig className="text-green-600" />
                      </motion.div>
                      <span className="text-sm font-semibold text-green-600">
                        {importedCount} task{importedCount !== 1 ? 's' : ''}{' '}
                        imported!
                      </span>
                    </motion.div>
                  ) : preview ? (
                    <motion.div
                      key="parsed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <FileIcon className="dark:text-gray-800" />
                      <div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-800">
                          {fileName}
                        </div>
                        <div className="text-xs text-green-600">
                          {preview.tasks.length} task
                          {preview.tasks.length !== 1 ? 's' : ''} ready to
                          import
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <motion.div
                        animate={
                          isDragging
                            ? { y: [-3, 3, -3], scale: 1.15 }
                            : { y: 0, scale: 1 }
                        }
                        transition={
                          isDragging
                            ? {
                                duration: 0.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }
                            : {}
                        }
                      >
                        {isDragging ? (
                          <FolderOpen className="text-primary-500 dark:text-primary-500" />
                        ) : (
                          <Folder className="text-gray-700 dark:text-gray-200" />
                        )}
                      </motion.div>
                      <span
                        className={`text-sm font-semibold ${
                          isDragging
                            ? 'text-primary-500'
                            : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {isDragging
                          ? 'Drop your CSV here'
                          : 'Drop CSV or click to browse'}
                      </span>
                      <span className="text-xs text-gray-400">
                        .csv files only · Multiple tasks supported
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {preview && (
                <ResultCard
                  preview={preview}
                  serverRowErrors={serverRowErrors}
                  serverMessage={serverMessage}
                  isLoading={isLoading}
                  onConfirm={handleConfirm}
                  onReset={handleReset}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
