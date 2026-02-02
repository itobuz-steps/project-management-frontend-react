import { SubtasksTab } from './SubtasksTab';
import { AttachmentsTab } from './AttachmentsTab';
import { CommentsTab } from './CommentsTab';
import { TaskDescription } from './TaskDescription';
import type { ViewProps } from './taskDrawer.type';
import { TaskSidebar } from './TaskSidebar';

export function TaskView({ task, isMobile, onUpdated }: ViewProps) {
  return (
    <div
      className={`no-scrollbar flex h-full ${isMobile ? 'flex-col overflow-y-auto' : 'overflow-hidden'} `}
    >
      <div
        className={`flex-1 ${isMobile ? 'overflow-visible px-4' : 'overflow-y-auto pr-2'} `}
      >
        <TaskDescription
          task={task}
          onPatch={(_, patch) => {
            onUpdated({ ...task, ...patch });
          }}
        />
        <SubtasksTab task={task} />
        <AttachmentsTab task={task} />
        <CommentsTab taskId={task._id} />
      </div>

      {!isMobile ? (
        <div className="w-[280px] shrink-0 p-4">
          <div className="sticky top-10 max-h-[calc(100vh-160px)] overflow-auto">
            <TaskSidebar task={task} onUpdated={onUpdated} />
          </div>
        </div>
      ) : (
        <div className="border-t px-4 py-3">
          <TaskSidebar task={task} onUpdated={onUpdated} />
        </div>
      )}
    </div>
  );
}
