import { useState } from 'react';
import { SubtasksTab } from '../subtask/SubtasksTab';
import { AttachmentsTab } from '../attachment/AttachmentsTab';
import { CommentsTab } from '../comment/CommentsTab';
import { TaskDescription } from '../taskModal/TaskDescription';
import { TaskDetails } from '../taskModal/TaskDetails';
import { tabs } from './tabsConfig';
import type { ActivityTab, DrawerViewProps } from './drawer.type';

export function DrawerTaskView({ task, onUpdated }: DrawerViewProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>('comments');

  return (
    <div
      className="flex h-full flex-col overflow-y-auto"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#c1c7d0 transparent' }}
    >
      <div className="px-5 py-4">
        {/* Details / Sidebar fields */}
        <TaskDetails task={task} onUpdated={onUpdated} />

        {/* Divider */}
        <div className="my-4 border-t border-[#dfe1e6]" />

        {/* Description */}
        <TaskDescription task={task} onUpdated={onUpdated} />

        {/* Child issues / Subtasks */}
        <div className="mt-5">
          <SubtasksTab task={task} />
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-[#dfe1e6]" />

        {/* Activity section */}
        <div>
          <h3 className="mb-3 text-xs font-bold tracking-wider text-[#6B778C] uppercase">
            Activity
          </h3>

          {/* Tab bar */}
          <div className="flex gap-0 border-b border-[#dfe1e6]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-3 pt-1 pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#0052CC]'
                    : 'text-[#6B778C] hover:text-[#172B4D]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[#0052CC]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="pt-3 pb-6">
            {activeTab === 'comments' && <CommentsTab task={task} />}
            {activeTab === 'attachments' && <AttachmentsTab task={task} />}
          </div>
        </div>
      </div>
    </div>
  );
}
