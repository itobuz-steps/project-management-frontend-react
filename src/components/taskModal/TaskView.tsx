import { SubtasksTab } from './SubtasksTab';
import { AttachmentsTab } from './AttachmentsTab';
import { CommentsTab } from './CommentsTab';
import { TaskDescription } from './TaskDescription';
import type { ViewProps } from './taskDrawer.type';
import { TaskDetails } from './TaskDetails';
import { Tabs, type TabsProps } from 'antd';
import { ActivityTab } from './ActivityTab';

export function TaskView({ task, isMobile, onUpdated }: ViewProps) {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Comments',
      children: <CommentsTab taskId={task._id} />,
    },
    {
      key: '2',
      label: 'Activity',
      children: <ActivityTab taskId={task._id} />,
    },
  ];

  return (
    <div
      className={`no-scrollbar flex h-full ${isMobile ? 'flex-col overflow-y-auto' : 'overflow-hidden'} `}
    >
      <div
        className={`flex-1 ${isMobile ? 'overflow-visible' : 'overflow-y-auto pr-2'} `}
      >
        <TaskDescription
          task={task}
          onPatch={(_, patch) => {
            onUpdated({ ...task, ...patch });
          }}
        />
        <SubtasksTab task={task} />
        <AttachmentsTab task={task} />
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>

      {!isMobile ? (
        <div className="w-[400px] shrink-0 p-4 pt-1">
          <div className="sticky max-h-[calc(100vh-160px)] overflow-auto">
            <TaskDetails task={task} onUpdated={onUpdated} />
          </div>
        </div>
      ) : (
        <div>
          <TaskDetails task={task} onUpdated={onUpdated} />
        </div>
      )}
    </div>
  );
}
