import { useEffect, useMemo, useState } from 'react';
import { PlayCircleFilled, PauseOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  getTaskWorklogs,
  startTaskTimer,
  stopTaskTimer,
} from '../../services/taskService';
import { useAuthContext } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';

type TaskTimerSectionProps = {
  taskId: string;
  assigneeId?: string;
  status: string;
};

export function TaskTimerSection({
  taskId,
  assigneeId,
  status,
}: TaskTimerSectionProps) {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => Date.now());
  const shouldReduceMotion = useReducedMotion();
  const { columns } = useProject();

  const isDone = columns[columns.length - 1] === status;
  const isAssignee = Boolean(userId && assigneeId && userId === assigneeId);

  const worklogsQuery = useQuery({
    queryKey: ['task-worklogs', taskId],
    queryFn: () => getTaskWorklogs(taskId),
    enabled: isAssignee,
  });

  const activeWorklog = useMemo(() => {
    if (!userId) return null;
    return (
      worklogsQuery.data?.find(
        (worklog) => worklog.userId._id === userId && !worklog.endTime
      ) || null
    );
  }, [worklogsQuery.data, userId]);

  const startMutation = useMutation({
    mutationFn: () => startTaskTimer(taskId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-worklogs', taskId] }),
  });

  const stopMutation = useMutation({
    mutationFn: (worklogId: string) => stopTaskTimer(worklogId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-worklogs', taskId] }),
  });

  useEffect(() => {
    if (isDone && activeWorklog && !stopMutation.isPending) {
      stopMutation.mutate(activeWorklog._id);
    }
  }, [isDone, activeWorklog, stopMutation]);

  useEffect(() => {
    if (!activeWorklog) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeWorklog]);

  if (!isAssignee || isDone) return null;

  const startMs = activeWorklog
    ? new Date(activeWorklog.startTime).getTime()
    : 0;
  const elapsedSeconds = activeWorklog
    ? Math.max(0, Math.floor((now - startMs) / 1000))
    : 0;

  const isPending = startMutation.isPending || worklogsQuery.isFetching;
  const parts = formatDurationParts(elapsedSeconds);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!activeWorklog ? (
        <motion.button
          key="start"
          type="button"
          onClick={() => startMutation.mutate()}
          disabled={isPending}
          className="group border-primary-500 text-primary-700 relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-md border bg-transparent px-3.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.015 }}
          whileTap={shouldReduceMotion ? undefined : { y: 0, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          {/* hover fill */}
          <motion.span
            className="bg-primary-500 pointer-events-none absolute inset-0"
            style={{ borderRadius: 'inherit' }}
            animate={
              isPending && !shouldReduceMotion
                ? { opacity: [0.7, 1, 0.7], y: 0 }
                : { opacity: 1, y: '100%' }
            }
            whileHover={
              !isPending && !shouldReduceMotion ? { y: 0 } : undefined
            }
            transition={
              isPending && !shouldReduceMotion
                ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 260, damping: 24 }
            }
          />

          {/* ring shimmer when pending */}
          {!shouldReduceMotion && (
            <motion.span
              className="border-primary-300/50 pointer-events-none absolute -inset-px rounded-md border"
              animate={
                isPending
                  ? { opacity: [0.25, 0.75, 0.25], scale: [1, 1.025, 1] }
                  : { opacity: 0.35, scale: 1 }
              }
              transition={
                isPending
                  ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.25 }
              }
              style={{ borderRadius: 'inherit' }}
            />
          )}

          {/* play icon */}
          <motion.span
            className="relative z-10 inline-flex items-center"
            animate={
              isPending && !shouldReduceMotion
                ? { scale: [1, 1.18, 1] }
                : { scale: 1 }
            }
            transition={
              isPending && !shouldReduceMotion
                ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.18 }
            }
          >
            <PlayCircleFilled
              style={{ fontSize: '20px', backgroundColor: 'transparent' }}
            />
          </motion.span>

          <span className="relative z-10 inline-block text-inherit transition-colors duration-200 group-hover:text-white">
            {isPending ? 'Starting...' : 'Start Timer'}
          </span>
        </motion.button>
      ) : (
        <motion.div
          key="timer"
          className="relative inline-flex items-center gap-0.5 overflow-hidden rounded-lg border border-sky-200 bg-sky-50 px-1.5 py-1 dark:border-neutral-700 dark:bg-neutral-800"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          layout
        >
          {/* red wash when stopping */}
          <motion.span
            className="pointer-events-none absolute inset-0 bg-red-500"
            style={{ borderRadius: 'inherit' }}
            initial={{ opacity: 0 }}
            animate={
              stopMutation.isPending && !shouldReduceMotion
                ? { opacity: [0.15, 0.3, 0.15] }
                : { opacity: 0 }
            }
            transition={
              stopMutation.isPending
                ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
          />

          {/* pause button */}
          <motion.button
            type="button"
            onClick={() => stopMutation.mutate(activeWorklog._id)}
            disabled={stopMutation.isPending}
            className="relative z-10 flex h-7 w-7 items-center justify-center rounded-md bg-transparent transition-colors hover:bg-red-100 disabled:cursor-not-allowed"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
            animate={
              stopMutation.isPending && !shouldReduceMotion
                ? { scale: [1, 1.12, 1], opacity: [1, 0.5, 1] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              stopMutation.isPending && !shouldReduceMotion
                ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 380, damping: 20 }
            }
          >
            <PauseOutlined
              style={{
                fontSize: '16px',
                color: stopMutation.isPending ? '#ef4444' : '#dc2626',
              }}
            />
          </motion.button>

          {/* divider */}
          <span className="relative z-10 mx-0.5 h-4 w-px bg-sky-200" />

          {/* time display */}
          <motion.span
            className="relative z-10 flex items-center gap-px font-mono text-base font-semibold tracking-tight tabular-nums"
            animate={{
              color:
                stopMutation.isPending && !shouldReduceMotion
                  ? '#ef4444'
                  : '#0284c5',
            }}
            transition={{ duration: 0.25 }}
          >
            <span>{parts.hhmm}</span>
            <span>:</span>
            <motion.span
              key={parts.ss}
              initial={shouldReduceMotion ? false : { opacity: 0.3, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            >
              {parts.ss}
            </motion.span>
          </motion.span>

          {/* live dot */}
          {!stopMutation.isPending && !shouldReduceMotion && (
            <motion.span
              className="relative z-10 ml-1 h-1.5 w-1.5 rounded-full bg-red-500"
              animate={{ scale: [1, 0.45, 1], opacity: [1, 0.35, 1] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatDurationParts(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    hhmm: `${pad(hours)}:${pad(minutes)}`,
    ss: pad(seconds),
  };
}
