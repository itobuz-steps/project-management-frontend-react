import { SubtasksTab } from '../subtask/SubtasksTab';
import { AttachmentsTab } from '../attachment/AttachmentsTab';
import { CommentsTab } from '../comment/CommentsTab';
import { TaskDescription } from './TaskDescription';
import type { ViewProps } from './taskModal.types';
import { TaskDetails } from './TaskDetails';
import { Tabs, type TabsProps } from 'antd';
import { ActivityTab } from './ActivityTab';
import { LinkedItemsTab } from '../linkedItems/LinkedItemsTab';
import { WorklogsTab } from './WorklogsTab';

export function TaskView({ task, isMobile, onUpdated }: ViewProps) {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Comments',
      children: <CommentsTab task={task} />,
    },
    {
      key: '2',
      label: 'Activity',
      children: <ActivityTab taskId={task._id} />,
    },
    {
      key: '3',
      label: 'Worklogs',
      children: <WorklogsTab taskId={task._id} />,
    },
  ];

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto md:flex-row md:overflow-hidden">
      <div className="flex-1 overflow-visible md:overflow-y-auto md:pr-3">
        {isMobile && <TaskDetails task={task} onUpdated={onUpdated} />}
        <TaskDescription task={task} onUpdated={onUpdated} />

        {!task.parentTask && <SubtasksTab task={task} />}

        <AttachmentsTab task={task} onUpdated={onUpdated} />

        <LinkedItemsTab task={task} onUpdated={onUpdated} />

        <Tabs className="custom-tabs" defaultActiveKey="1" items={items} />
      </div>

      {!isMobile && (
        <div className="shrink-0 p-2 pt-1 sm:w-50 md:w-75 lg:w-100 2xl:w-125">
          <div className="sticky max-h-[calc(100vh-160px)] overflow-auto">
            <TaskDetails task={task} onUpdated={onUpdated} />
          </div>
        </div>
      )}
    </div>
  );
}
