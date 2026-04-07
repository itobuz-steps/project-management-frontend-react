import { message } from 'antd';
import type { TaskStats } from '../../services/types/tasks.types';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getTaskStats } from '../../services/taskService';
import { CustomStatistic } from './CustomStatistics';
import { ChartsContainer } from './ChartsContainer';

export function StatsContainer() {
  const [data, setData] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getTaskStats();
        setData(stats);
      } catch (error) {
        if (error instanceof AxiosError) {
          message.error(
            'Failed to fetch task stats:',
            error.response?.data?.message || error.message
          );
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return loading ? (
    <div className="flex h-64 items-center justify-center text-gray-600 dark:text-slate-300">
      Loading statistics...
    </div>
  ) : (
    <>
     <div className="w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
          <CustomStatistic
            title="Total Task Assigned Last 7 Days"
            value={data?.totalAssignedTasks || 0}
          />

          <CustomStatistic
            title="Task Completed Last 7 Days"
            value={data?.tasksCompletedThisWeek || 0}
          />

          <CustomStatistic
            title="Story Points Completed Last 7 Days"
            value={data?.storyPointsCompletedThisWeek || 0}
          />
        </div>
      </div>

      <ChartsContainer data={data} />
    </>
  );
}
