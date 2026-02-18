import { useState } from 'react';
import { Button, Select, Tag, DatePicker, Collapse } from 'antd';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { SidebarRow } from '../ui/SidebarRow';
import { UserCell } from '../ui/UserCell';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { InputNumber, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  PRIORITIES,
  PRIORITY_COLORS,
  STORY_POINTS,
  TASK_TYPES,
} from './constants';
import { AssigneeCell } from '../ui/AssigneeCell';
import type { EditingField, TaskDetailsProps } from './taskModal.types';
import { useTaskPatch } from '../../hooks/useTaskPatch';
import { useProjectMeta } from '../../hooks/useProjectMeta';

export function TaskDetails({ task, onUpdated }: TaskDetailsProps) {
  const [editing, setEditing] = useState<EditingField>(null);
  const [editingLabels, setEditingLabels] = useState(false);

  const { patchTask } = useTaskPatch<TaskPopulated>(task._id, (_, patch) =>
    onUpdated({ ...task, ...patch })
  );

  const { members, loadingMembers } = useProjectMeta(task.projectId as string);

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
            <span className="text-base font-semibold text-gray-900">
              Details
            </span>
          ),
          children: (
            <div className="space-y-4">
              <SidebarRow label="Assignee">
                <AssigneeCell
                  task={task}
                  members={members}
                  loading={loadingMembers}
                  onUpdated={onUpdated}
                />
              </SidebarRow>

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
                      <span className="text-sm text-gray-400">Add labels</span>
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
                      patchTask({ tags }, 'Failed to update labels');
                    }}
                  />
                )}
              </SidebarRow>

              {/* Priority */}
              <SidebarRow label="Priority">
                {editing !== 'priority' ? (
                  <Tag
                    className="cursor-pointer capitalize"
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
                      patchTask({ priority }, 'Failed to update priority');
                    }}
                    options={PRIORITIES.map((p) => ({
                      value: p,
                      label: <span className="capitalize">{p}</span>,
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
                      patchTask({ type }, 'Failed to update type');
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
                      patchTask(
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
                          patchTask(
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
                <DatePicker
                  size="small"
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={task.dueDate ? dayjs(task.dueDate) : null}
                  status={
                    task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day')
                      ? 'error'
                      : undefined
                  }
                  onChange={(date) =>
                    patchTask(
                      { dueDate: date?.toISOString() },
                      'Failed to update due date'
                    )
                  }
                />
              </SidebarRow>

              <div className="pb-3">
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
