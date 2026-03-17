import { useState } from 'react';
import { SubtasksTab } from '../subtask/SubtasksTab';
import { AttachmentsTab } from '../attachment/AttachmentsTab';
import { CommentsTab } from '../comment/CommentsTab';
import { ActivityTab } from '../taskModal/ActivityTab';
import { TaskDescription } from '../taskModal/TaskDescription';
import { TaskDetails } from '../taskModal/TaskDetails';
import { tabs } from './tabsConfig';
import type { Tabs, DrawerViewProps } from './drawer.type';
import { LinkedItemsTab } from '../linkedItems/LinkedItemsTab';
import { WorklogsTab } from '../taskModal/WorklogsTab';

export function DrawerTaskView({ task, onUpdated }: DrawerViewProps) {
  const [activeTab, setActiveTab] = useState<Tabs>('comments');
  const isDrawer = true;

  return (
    <div
      className="flex h-full flex-col overflow-y-auto dark:text-slate-200"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#c1c7d0 transparent' }}
    >
      <div className="px-4 py-0">
        {/* Details / Sidebar fields */}
        <TaskDetails task={task} onUpdated={onUpdated} />

        {/* Divider */}
        <div className="my-4 border-t border-[#dfe1e6] dark:border-slate-700" />

        {/* Description */}
        <TaskDescription task={task} onUpdated={onUpdated} />

        {/* Child issues / Subtasks */}
        <div className="mt-1">
          {!task.parentTask && <SubtasksTab task={task} />}
        </div>

        <LinkedItemsTab task={task} onUpdated={onUpdated} />

        {/* Divider */}
        <div className="my-4 border-t border-[#dfe1e6] dark:border-slate-700" />

        {/* Activity section */}
        <div>
          {/* Tab bar */}
          <div className="no-scrollbar overflow-x-auto">
            <div className="flex min-w-max border-b border-[#dfe1e6] dark:border-slate-700">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative shrink-0 px-2.5 pt-1 pb-2 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-[var(--color-primary-900)]'
                      : 'text-[#383c44] hover:text-[var(--color-primary-900)] dark:text-slate-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[var(--color-primary-700)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="pt-3 pb-6">
            {activeTab === 'comments' && <CommentsTab task={task} />}
            {activeTab === 'attachments' && (
              <AttachmentsTab
                isDrawer={isDrawer}
                task={task}
                onUpdated={onUpdated}
              />
            )}
            {activeTab === 'activity' && <ActivityTab taskId={task._id} />}
            {activeTab === 'worklogs' && <WorklogsTab taskId={task._id} />}
          </div>
        </div>
      </div>
    </div>
  );
}
