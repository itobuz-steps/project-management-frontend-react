import { useMemo } from 'react';
import { Avatar, Empty, List, Spin, Tag, Typography } from 'antd';
import { DateTime } from 'luxon';
import { useQuery } from '@tanstack/react-query';
import { getTaskWorklogs } from '../../services/taskService';

type WorklogsTabProps = {
  taskId: string;
};

export function WorklogsTab({ taskId }: WorklogsTabProps) {
  const worklogsQuery = useQuery({
    queryKey: ['task-worklogs', taskId],
    queryFn: () => getTaskWorklogs(taskId),
  });

  const worklogs = useMemo(
    () =>
      [...(worklogsQuery.data || [])].sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      ),
    [worklogsQuery.data]
  );

  if (worklogsQuery.isLoading) {
    return (
      <div className="py-6 text-center">
        <Spin size="small" />
      </div>
    );
  }

  if (!worklogs.length) {
    return (
      <Empty
        description="No worklogs yet"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <List
      dataSource={worklogs}
      split={false}
      className="space-y-2"
      renderItem={(worklog) => {
        const start = new Date(worklog.startTime);
        const end = worklog.endTime ? new Date(worklog.endTime) : null;
        const durationSeconds = end
          ? Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000))
          : 0;
        const user = typeof worklog.userId === 'string' ? null : worklog.userId;
        const userName =
          typeof worklog.userId === 'string'
            ? worklog.userId
            : worklog.userId.name || 'User';

        return (
          <List.Item className="">
            <div className="flex w-full items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <Avatar src={user?.profileImage} className="mt-0.5">
                  {userName.charAt(0).toUpperCase()}
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Typography.Text strong className="truncate">
                      {userName}
                    </Typography.Text>
                    <Tag color={end ? undefined : 'green'}>
                      {end ? 'Completed' : 'Running'}
                    </Tag>
                  </div>

                  <Typography.Text className="block text-xs text-gray-600">
                    {DateTime.fromJSDate(start).toFormat('dd LLL yyyy, HH:mm')}{' '}
                    {'->'}{' '}
                    {end
                      ? DateTime.fromJSDate(end).toFormat('dd LLL yyyy, HH:mm')
                      : 'Now'}
                  </Typography.Text>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 px-2 py-1 text-right">
                <div className="text-[11px] text-gray-500">Duration</div>
                <div className="text-primary-700 font-semibold">
                  {formatDuration(durationSeconds)}
                </div>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
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
