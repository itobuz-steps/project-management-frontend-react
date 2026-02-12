import { useState } from 'react';
import { Button, Select, Tag, message, Collapse } from 'antd';
import type { TaskPopulated, User } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { SidebarRow } from './SidebarRow';
import { UserCell } from '../../utils/UserCell';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { formatDateForInput } from '../../utils/utils';
import { InputNumber, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  PRIORITIES,
  PRIORITY_COLORS,
  STORY_POINTS,
  TASK_TYPES,
} from './constants';
import { getProjectMembers } from '../../services/projectService';

export function TaskDetails({
  task,
  onUpdated,
}: {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
}) {
  const [editing, setEditing] = useState<'priority' | 'type' | null>(null);
  const [editingLabels, setEditingLabels] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const loadMembers = async () => {
    if (members.length) return;

    setLoadingMembers(true);
    try {
      const result = await getProjectMembers(
        task.projectId as unknown as string
      );
      setMembers(result);
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <Collapse
      ghost
      bordered
      defaultActiveKey={['details']}
      className="jira-sidebar-collapse"
      items={[
        {
          key: 'details',
          label: (
            <span className="px-2 py-1 text-base font-semibold text-gray-700">
              Details
            </span>
          ),
          children: (
            <div className="space-y-4">
              <SidebarRow label="Assignee">
                {!editingAssignee ? (
                  <div
                    className="cursor-pointer rounded-md hover:bg-gray-100"
                    onClick={() => {
                      setEditingAssignee(true);
                      loadMembers();
                    }}
                  >
                    <UserCell user={task.assignee} emptyText="Unassigned" />
                  </div>
                ) : (
                  <Select
                    autoFocus
                    className="w-full"
                    loading={loadingMembers}
                    value={task.assignee?._id ?? null}
                    placeholder="Unassigned"
                    allowClear
                    onBlur={() => setEditingAssignee(false)}
                    onChange={async (userId) => {
                      const selectedUser = members.find(
                        (m) => m._id === userId
                      );

                      const optimistic: TaskPopulated = {
                        ...task,
                        assignee: selectedUser as unknown as User,
                      };
                      onUpdated(optimistic);
                      setEditingAssignee(false);

                      try {
                        await updateTask(task._id, {
                          assignee: (userId as unknown as User) ?? undefined,
                        });
                      } catch {
                        message.error('Failed to update assignee');
                        onUpdated(task);
                      }
                    }}
                    options={members.map((member) => ({
                      value: member._id,
                      label: <UserCell user={member} emptyText="—" />,
                    }))}
                  />
                )}
              </SidebarRow>

              <SidebarRow label="Labels">
                {!editingLabels ? (
                  <div
                    className="flex cursor-pointer flex-wrap gap-1"
                    onClick={() => setEditingLabels(true)}
                  >
                    {task.tags?.length ? (
                      <>
                        {task.tags.slice(0, 3).map((label) => (
                          <Tag key={label} color="blue">
                            {label}
                          </Tag>
                        ))}

                        {task.tags.length > 3 && (
                          <Tag>+{task.tags.length - 3}</Tag>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">Add labels</span>
                    )}
                  </div>
                ) : (
                  <Select
                    autoFocus
                    mode="tags"
                    style={{ width: '100%' }}
                    value={task.tags}
                    placeholder="Add labels"
                    onBlur={() => setEditingLabels(false)}
                    onChange={async (values) => {
                      const optimistic = { ...task, tags: values };
                      onUpdated(optimistic);
                      setEditingLabels(false);

                      try {
                        await updateTask(task._id, { tags: values });
                      } catch {
                        message.error('Failed to update labels');
                        onUpdated(task);
                      }
                    }}
                  />
                )}
              </SidebarRow>

              <SidebarRow label="Priority">
                {editing !== 'priority' ? (
                  <div
                    onClick={() => setEditing('priority')}
                    className="flex cursor-pointer items-center rounded-md hover:bg-gray-100"
                  >
                    <Tag
                      className="m-0 capitalize"
                      color={
                        PRIORITY_COLORS[
                          task.priority as keyof typeof PRIORITY_COLORS
                        ] ?? 'green'
                      }
                    >
                      {task.priority}
                    </Tag>
                  </div>
                ) : (
                  <Select
                    autoFocus
                    size="small"
                    value={task.priority}
                    className="w-full"
                    onBlur={() => setEditing(null)}
                    onChange={async (newPriority) => {
                      const optimistic = { ...task, priority: newPriority };
                      onUpdated(optimistic);
                      setEditing(null);

                      try {
                        await updateTask(task._id, { priority: newPriority });
                      } catch {
                        message.error('Failed to update priority');
                        onUpdated(task);
                      }
                    }}
                    options={PRIORITIES.map((p) => ({
                      value: p,
                      label: <span className="capitalize">{p}</span>,
                    }))}
                  />
                )}
              </SidebarRow>

              <SidebarRow label="Type">
                {editing !== 'type' ? (
                  <div
                    onClick={() => setEditing('type')}
                    className="flex cursor-pointer items-center gap-2 rounded-md hover:bg-gray-100"
                  >
                    <TaskTypeIcon type={task.type} />
                    <span className="text-sm capitalize">{task.type}</span>
                  </div>
                ) : (
                  <Select
                    autoFocus
                    size="small"
                    value={task.type}
                    className="w-full"
                    onBlur={() => setEditing(null)}
                    onChange={async (newType) => {
                      const optimistic = { ...task, type: newType };
                      onUpdated(optimistic);
                      setEditing(null);

                      try {
                        await updateTask(task._id, { type: newType });
                      } catch {
                        message.error('Failed to update type');
                        onUpdated(task);
                      }
                    }}
                    options={TASK_TYPES.map((type) => ({
                      value: type,
                      label: (
                        <div className="flex items-center gap-2 capitalize">
                          <TaskTypeIcon type={type} />
                          <span>{type}</span>
                        </div>
                      ),
                    }))}
                  />
                )}
              </SidebarRow>

              <SidebarRow label="Story Points">
                <Space.Compact className="w-full">
                  <InputNumber
                    className="w-full"
                    min={0}
                    value={task.storyPoint}
                    placeholder="—"
                    onChange={async (value) => {
                      const optimistic = {
                        ...task,
                        storyPoint: value ?? undefined,
                      };
                      onUpdated(optimistic);

                      try {
                        await updateTask(task._id, {
                          storyPoint: value ?? undefined,
                        });
                      } catch {
                        message.error('Failed to update story points');
                        onUpdated(task);
                      }
                    }}
                  />

                  <Dropdown
                    menu={{
                      items: STORY_POINTS.map((n) => ({
                        key: n,
                        label: n,
                        onClick: async () => {
                          const optimistic = { ...task, storyPoint: n };
                          onUpdated(optimistic);

                          try {
                            await updateTask(task._id, { storyPoint: n });
                          } catch {
                            message.error('Failed to update story points');
                            onUpdated(task);
                          }
                        },
                      })),
                    }}
                  >
                    <Button icon={<DownOutlined />} />
                  </Dropdown>
                </Space.Compact>
              </SidebarRow>

              <SidebarRow label="Due Date">
                <input
                  type="date"
                  value={formatDateForInput(task.dueDate)}
                  onChange={async (e) => {
                    const newDate = e.target.value;
                    if (!newDate) return;

                    const optimistic = { ...task, dueDate: newDate };
                    onUpdated(optimistic);

                    try {
                      await updateTask(task._id, { dueDate: newDate });
                    } catch {
                      message.error('Failed to update due date');
                      onUpdated(task);
                    }
                  }}
                  className={`w-full rounded-md border bg-gray-50 p-1 text-sm outline-none ${
                    task.dueDate && new Date(task.dueDate) < new Date()
                      ? 'text-red-600'
                      : ''
                  }`}
                />
              </SidebarRow>

              <div className="mb-4">
                <SidebarRow label="Reporter">
                  <UserCell user={task.reporter} emptyText="—" />
                </SidebarRow>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
