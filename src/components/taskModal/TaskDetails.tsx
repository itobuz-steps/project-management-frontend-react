import { useState } from 'react';
import { Button, Select, Tag, Collapse, message } from 'antd';
import { SidebarRow } from '../ui/SidebarRow';
import { UserCell } from '../ui/UserCell';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { InputNumber, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { PRIORITIES, PRIORITY_COLORS, STORY_POINTS } from './constants';
import { AssigneeCell } from '../ui/AssigneeCell';
import type { EditingField, TaskDetailsProps } from './taskModal.types';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { DueDateCell } from '../ui/DueDateCell';
import { usePermissions } from '../../hooks/usePermissions';
import { useTaskTotalTracked } from '../../hooks/useTask';
import { useParentTask } from '../../hooks/useParentTask';
import { getAllowedChildTaskTypes } from '../../utils/taskTypeRules';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function TaskDetails({ task, onUpdated }: TaskDetailsProps) {
  const { can } = usePermissions();
  const [editing, setEditing] = useState<EditingField>(null);
  const [editingLabels, setEditingLabels] = useState(false);

  const { update } = useTaskUpdate(task._id, onUpdated);

  const { members, loadingMembers } = useProjectMetaData(
    task.projectId as string
  );

  const { liveTrackedMs } = useTaskTotalTracked(task._id);

  const parentTask = useParentTask(task.parentTask);

  const allowedTaskTypes = getAllowedChildTaskTypes(parentTask?.type);

  const formatTimeTracked = (ms: number) => {
    const d = dayjs.duration(ms);
    return d.format('H[h] m[m] s[s]');
  };

  const formatRelativeTime = (date?: string | Date) => {
    if (!date) {
      return '—';
    }

    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  };

  const branchName = `${task.key}-${task.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')}`;

  const command = `git checkout -b ${branchName}`;

  return (
    <Collapse
      ghost
      bordered
      defaultActiveKey={['details']}
      className="task-details-collapse"
      items={[
        {
          key: 'details',
          label: (
            <span className="text-base font-semibold text-gray-900 dark:text-slate-100">
              Details
            </span>
          ),
          children: (
            <div className="space-y-3">
              <div className="flex truncate">
                <SidebarRow label="Assignee">
                  <AssigneeCell
                    task={task}
                    members={members}
                    loading={loadingMembers}
                    onUpdated={onUpdated}
                  />
                </SidebarRow>
              </div>

              <SidebarRow label="Tags">
                <div className="flex min-h-7 w-full items-center">
                  {!editingLabels ? (
                    <div
                      className="flex cursor-pointer flex-wrap gap-1 text-lg"
                      onClick={() => setEditingLabels(true)}
                    >
                      {task.tags?.length ? (
                        <>
                          {task.tags.slice(0, 3).map((tag) => (
                            <Tag key={tag} color="blue">
                              {tag}
                            </Tag>
                          ))}
                          {task.tags.length > 3 && (
                            <Tag>+{task.tags.length - 3}</Tag>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-slate-400">
                          Add tags
                        </span>
                      )}
                    </div>
                  ) : (
                    <Select
                      autoFocus
                      mode="tags"
                      size="small"
                      value={task.tags}
                      onBlur={() => setEditingLabels(false)}
                      onChange={(tags) => {
                        setEditingLabels(false);
                        update({ tags }, 'Failed to update labels');
                      }}
                      style={{ minWidth: '100px' }}
                    />
                  )}
                </div>
              </SidebarRow>

              <SidebarRow label="Priority">
                <div className="flex h-7 w-full items-center">
                  {editing !== 'priority' ? (
                    <Tag
                      className="cursor-pointer p-1 capitalize"
                      style={{
                        lineHeight: '26px',
                        height: '27px',
                        fontSize: '14px',
                      }}
                      color={
                        PRIORITY_COLORS[
                          task.priority as keyof typeof PRIORITY_COLORS
                        ]
                      }
                      onClick={() => setEditing('priority')}
                    >
                      {task.priority}
                    </Tag>
                  ) : (
                    <Select
                      autoFocus
                      size="small"
                      value={task.priority}
                      style={{ height: 28 }}
                      onBlur={() => setEditing(null)}
                      onChange={(priority) => {
                        setEditing(null);
                        update({ priority }, 'Failed to update priority');
                      }}
                      options={PRIORITIES.map((priority) => ({
                        value: priority,
                        label: <span className="capitalize">{priority}</span>,
                      }))}
                    />
                  )}
                </div>
              </SidebarRow>

              <SidebarRow label="Type">
                <div className="flex h-7 w-full items-center">
                  {editing !== 'type' ? (
                    <div
                      className="flex cursor-pointer items-center gap-2 px-2"
                      onClick={() => setEditing('type')}
                    >
                      <TaskTypeIcon type={task.type} />
                      <span className="capitalize">{task.type}</span>
                    </div>
                  ) : (
                    <Select
                      autoFocus
                      size="small"
                      value={task.type}
                      style={{ height: 28 }}
                      onBlur={() => setEditing(null)}
                      onChange={(type) => {
                        setEditing(null);
                        update({ type }, 'Failed to update type');
                      }}
                      options={allowedTaskTypes.map((type) => ({
                        value: type,
                        label: (
                          <div className="flex items-center gap-2 capitalize">
                            <TaskTypeIcon type={type} />
                            {type}
                          </div>
                        ),
                      }))}
                    />
                  )}
                </div>
              </SidebarRow>
              <div>
                <SidebarRow label="Time Tracked">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 pl-1">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        {formatTimeTracked(liveTrackedMs)}
                      </span>
                    </div>
                  </div>
                </SidebarRow>
              </div>

              <SidebarRow label="Story Points">
                <Space.Compact className="w-full">
                  <InputNumber
                    className="w-full"
                    min={0}
                    value={task.storyPoint}
                    placeholder="—"
                    onChange={(value) =>
                      update(
                        { storyPoint: value ?? undefined },
                        'Failed to update story points'
                      )
                    }
                  />

                  <Dropdown
                    menu={{
                      items: STORY_POINTS.map((points) => ({
                        key: points,
                        label: points,
                        onClick: () =>
                          update(
                            { storyPoint: points },
                            'Failed to update story points'
                          ),
                      })),
                    }}
                  >
                    <Button icon={<DownOutlined />} />
                  </Dropdown>
                </Space.Compact>
              </SidebarRow>

              <SidebarRow label="Due Date">
                <DueDateCell
                  dueDate={task.dueDate}
                  onChange={(dueDate) =>
                    update({ dueDate }, 'Failed to update due date')
                  }
                />
              </SidebarRow>

              <div className="flex truncate">
                <SidebarRow label="Reporter">
                  {can('REPORTER_CHANGE') ? (
                    <AssigneeCell
                      task={task}
                      members={members}
                      loading={loadingMembers}
                      onUpdated={onUpdated}
                      field="reporter"
                    />
                  ) : (
                    <UserCell user={task.reporter} emptyText="—" />
                  )}
                </SidebarRow>
              </div>

              <div className="gap-3 pb-3">
                <SidebarRow label="Created">
                  <span className="text-sm text-gray-700 dark:text-slate-100">
                    {formatRelativeTime(task.createdAt)}
                  </span>
                </SidebarRow>

                <SidebarRow label="Updated">
                  <span className="text-sm text-gray-700 dark:text-slate-100">
                    {formatRelativeTime(task.updatedAt)}
                  </span>
                </SidebarRow>
              </div>
              <div className="gap-1 pb-3">
                <SidebarRow label="Development">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="block h-6 min-w-0 flex-1 overflow-x-auto text-sm whitespace-nowrap">
                      {command}
                    </span>

                    <span className="shrink-0 cursor-pointer">
                      <Copy
                        className="h-4 w-4"
                        onClick={() => {
                          navigator.clipboard.writeText(command);
                          message.success('Branch Name Copied to Clipboard');
                        }}
                      />
                    </span>
                  </div>
                </SidebarRow>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
