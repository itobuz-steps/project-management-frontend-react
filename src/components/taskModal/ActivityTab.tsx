import { Timeline } from 'antd';
import type { Activity } from '../../services/types/activity.types';
import { DateTime } from 'luxon';
import { useEffect, useState, type JSX } from 'react';
import { getTaskActivities } from '../../services/taskService';
import type { TaskPopulated } from '../../services/types/tasks.types';

export function ActivityTab({ taskId }: { taskId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    async function fetchActivities() {
      try {
        const fetchedActivities = await getTaskActivities(taskId);

        setActivities(fetchedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }
    fetchActivities();
  }, [taskId]);

  return (
    <Timeline
      titleSpan="150px"
      styles={{
        root: {
          padding: '10px 6px',
        },
        itemIcon: {
          borderColor: 'var(--color-primary-500)',
        },
      }}
      items={mapActivityListToTimelineProp(activities)}
    />
  );
}

function TimelineTitle({ title }: { title: string }) {
  return (
    <span className="bg-primary-50 border-primary-100 text-primary-900 rounded-sm border px-1.5 py-1 text-nowrap">
      {title}
    </span>
  );
}

export function TimelineItem({ content }: { content: JSX.Element }) {
  return <span>{content}</span>;
}

function mapActivityListToTimelineProp(activities: Activity[]) {
  const timelineItems: { title: JSX.Element; content: JSX.Element }[] = [];

  for (const activity of activities) {
    let content = <></>;
    switch (activity.action) {
      case 'TASK_CREATED':
        content = (
          <>
            <span className="text-primary-500 font-bold">
              {activity.byUser.name}
            </span>{' '}
            created the task.
          </>
        );
        timelineItems.push(createTimelineItem(activity.createdAt, content));
        break;

      case 'TASK_UPDATED': {
        const otherField = Object.keys(
          activity.updatedFields
        )[0] as keyof TaskPopulated;
        if (otherField && activity.updatedFields[otherField]) {
          const fromValue = activity.updatedFields[otherField].from;
          const toValue = activity.updatedFields[otherField].to;
          content = (
            <>
              <span className="text-primary-500 font-bold">
                {activity.byUser.name}
              </span>{' '}
              updated{' '}
              <span className="text-primary-600 font-medium">{otherField}</span>{' '}
              from{' '}
              <span
                className="text-primary-500"
                title={activity.updatedFields[otherField].from}
              >
                {fromValue.length > 40
                  ? fromValue.substring(0, 40) + '...'
                  : fromValue}
              </span>{' '}
              to{' '}
              <span
                className="text-primary-500"
                title={activity.updatedFields[otherField].to}
              >
                {toValue.length > 40
                  ? toValue.substring(0, 40) + '...'
                  : toValue}
              </span>
              .
            </>
          );
          timelineItems.push(createTimelineItem(activity.createdAt, content));
        }
        break;
      }

      case 'STATUS_CHANGED':
        content = (
          <>
            <span className="text-primary-500 font-bold">
              {activity.byUser.name}
            </span>{' '}
            updated status: from{' '}
            <span className="text-primary-500">
              {activity.updatedFields.status?.from}
            </span>{' '}
            to{' '}
            <span className="text-primary-500">
              {activity.updatedFields.status?.to}
            </span>
            .
          </>
        );
        timelineItems.push(createTimelineItem(activity.createdAt, content));
        break;

      case 'ASSIGNEE_CHANGED':
        content = (
          <>
            <span className="text-primary-500 font-bold">
              {activity.byUser.name}
            </span>{' '}
            updated assignee:
            {activity.updatedFields.assignee?.from && (
              <>
                from{' '}
                <span className="text-primary-500">
                  {activity.updatedFields.assignee?.from}
                </span>
              </>
            )}{' '}
            to{' '}
            <span className="text-primary-500">
              {activity.updatedFields.assignee?.to}
            </span>
            .
          </>
        );
        timelineItems.push(createTimelineItem(activity.createdAt, content));
        break;

      case 'TASK_DELETED':
        content = (
          <>
            <span className="text-primary-500 font-bold">
              {activity.byUser.name}
            </span>{' '}
            deleted the task.
          </>
        );
        timelineItems.push(createTimelineItem(activity.createdAt, content));
        break;
    }
  }
  return timelineItems;
}

function createTimelineItem(date: Date, content: JSX.Element) {
  return {
    title: (
      <TimelineTitle
        title={
          DateTime.fromJSDate(date).toRelative() ??
          DateTime.fromJSDate(date).toLocaleString()
        }
      />
    ),
    content: <TimelineItem content={content} />,
  };
}
