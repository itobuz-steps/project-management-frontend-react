import { useState } from 'react';
import { Button, Select, Tag, Collapse, message } from 'antd';
import { SidebarRow } from '../ui/SidebarRow';
import { UserCell } from '../ui/UserCell';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { InputNumber, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  PRIORITIES,
  PRIORITY_COLORS,
  STORY_POINTS,
  TASK_TYPES,
} from './constants';
import { AssigneeCell } from '../ui/AssigneeCell';
import type { EditingField, TaskDetailsProps } from './taskModal.types';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { DueDateCell } from '../ui/DueDateCell';
import { usePermissions } from '../../hooks/usePermissions';
import { formatDistanceToNow } from 'date-fns';
import { Copy } from 'lucide-react';

export function TaskDetails({ task, onUpdated }: TaskDetailsProps) {
  const { can } = usePermissions();
  const [editing, setEditing] = useState<EditingField>(null);
  const [editingLabels, setEditingLabels] = useState(false);

  const { update } = useTaskUpdate(task._id, onUpdated);

  const { members, loadingMembers } = useProjectMetaData(
    task.projectId as string
  );

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

              {/* Labels */}
              <SidebarRow label="Labels">
                {!editingLabels ? (
                  <div
                    className="flex cursor-pointer flex-wrap gap-1"
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
                        Add labels
                      </span>
                    )}
                  </div>
                ) : (
                  <Select
                    autoFocus
                    mode="tags"
                    className="w-full"
                    value={task.tags}
                    onBlur={() => setEditingLabels(false)}
                    onChange={(tags) => {
                      setEditingLabels(false);
                      update({ tags }, 'Failed to update labels');
                    }}
                  />
                )}
              </SidebarRow>

              {/* Priority */}
              <SidebarRow label="Priority">
                {editing !== 'priority' ? (
                  <Tag
                    className="cursor-pointer capitalize"
                    style={{
                      border: 'none',
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
                    className="w-full"
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
              </SidebarRow>

              {/* Type */}
              <SidebarRow label="Type">
                {editing !== 'type' ? (
                  <div
                    className="flex cursor-pointer items-center gap-2"
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
                    className="w-full"
                    onBlur={() => setEditing(null)}
                    onChange={(type) => {
                      setEditing(null);
                      update({ type }, 'Failed to update type');
                    }}
                    options={TASK_TYPES.map((type) => ({
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
              </SidebarRow>

              {/* Story Points */}
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

              {/* Due Date */}
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
