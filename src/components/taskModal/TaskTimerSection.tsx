import { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import { ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTaskWorklogs,
  startTaskTimer,
  stopTaskTimer,
} from '../../services/taskService';
import { useAuthContext } from '../../context/AuthContext';

type TaskTimerSectionProps = {
  taskId: string;
  assigneeId?: string;
};

export function TaskTimerSection({
  taskId,
  assigneeId,
}: TaskTimerSectionProps) {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => Date.now());

  const isAssignee = Boolean(userId && assigneeId && userId === assigneeId);

  const worklogsQuery = useQuery({
    queryKey: ['task-worklogs', taskId],
    queryFn: () => getTaskWorklogs(taskId),
    enabled: isAssignee,
  });

  const activeWorklog = useMemo(() => {
    if (!userId) {
      return null;
    }

    return (
      worklogsQuery.data?.find((worklog) => {
        return worklog.userId._id === userId && !worklog.endTime;
      }) || null
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
    if (!activeWorklog) {
      return;
    }

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeWorklog]);

  if (!isAssignee) {
    return null;
  } // Hide if the user is not the assignee

  const startMs = activeWorklog
    ? new Date(activeWorklog.startTime).getTime()
    : 0;
  const elapsedSeconds = activeWorklog
    ? Math.max(0, Math.floor((now - startMs) / 1000))
    : 0;

  if (!activeWorklog) {
    return (
      <Button
        type="text"
        size="small"
        icon={<ClockCircleOutlined />}
        loading={startMutation.isPending || worklogsQuery.isFetching}
        onClick={() => startMutation.mutate()}
        style={{
          border: '1px solid var(--color-primary-500)',
          marginLeft: '8px',
          color: 'var(--color-primary-700)',
        }}
        className="hover:bg-primary-500! hover:border-none! hover:text-white!"
      >
        Start Timer
      </Button>
    );
  }

  return (
    <div className="ml-2 flex items-center gap-1">
      <ClockCircleOutlined className="text-primary-700 text-xs" />
      <span className="text-primary-700 text-xs font-semibold tabular-nums">
        {formatDuration(elapsedSeconds)}
      </span>
      <Button
        type="text"
        size="small"
        danger
        icon={<StopOutlined />}
        loading={stopMutation.isPending}
        onClick={() => stopMutation.mutate(activeWorklog._id)}
      />
    </div>
  );
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}
