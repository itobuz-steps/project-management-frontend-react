import { useEffect, useState } from 'react';
import { Button, Select, Tag, message } from 'antd';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { SidebarRow } from './SidebarRow';
import { UserCell } from '../../utils/UserCell';
// import { EditTaskModal } from '../../utils/EditTaskModal';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { StatusSelect } from '../../utils/StatusSelect';
import { formatDateForInput } from '../../utils/utils';
import { InputNumber, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { PRIORITIES, PRIORITY_COLORS, TASK_TYPES } from './constants';
import { getProjectById } from '../../services/projectService';

const STORY_POINTS = [1, 2, 3, 5, 8, 13];

export function TaskSidebar({
  task,
  onUpdated,
}: {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
}) {
  const [editing, setEditing] = useState<'priority' | 'type' | null>(null);
  const [editingLabels, setEditingLabels] = useState(false);

  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    async function fetchColumns() {
      // TODO: Change task type from TaskPopulated to Task or populate projectid from backend
      const project = await getProjectById(task.projectId as unknown as string);
      setColumns(project.columns);
    }

    fetchColumns();
  }, [task.projectId]);

  return (
    <>
      <div
        className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm`}
      >
        {/* HEADER */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Task Details</h3>

          {/* <Button
            size="small"
            type="text"
            icon={<EditOutlined />}
            onClick={() => setEditOpen(true)}
          /> */}
        </div>

        <div className="max-h-[calc(100vh-350px)] space-y-3 overflow-y-auto pr-1">
          {/* STATUS — inline editable */}
          <SidebarRow label="Status">
            <StatusSelect
              taskId={task._id}
              value={task.status}
              columns={columns}
              onChange={async (newStatus) => {
                const optimistic = { ...task, status: newStatus };
                onUpdated(optimistic);

                try {
                  await updateTask(task._id, { status: newStatus });
                } catch {
                  message.error('Failed to update status');
                  onUpdated(task);
                }
              }}
            />
          </SidebarRow>
          {/* ASSIGNEE */}
          <SidebarRow label="Assignee">
            <UserCell user={task.assignee} emptyText="Unassigned" />
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

                    {task.tags.length > 3 && <Tag>+{task.tags.length - 3}</Tag>}
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

          {/* PRIORITY */}
          <SidebarRow label="Priority">
            {editing !== 'priority' ? (
              <div
                onClick={() => setEditing('priority')}
                className="cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-sm capitalize hover:bg-gray-200"
              >
                <Tag
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
              <select
                autoFocus
                value={task.priority}
                onBlur={() => setEditing(null)}
                onChange={async (e) => {
                  const newPriority = e.target.value as typeof task.priority;

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
                className="w-full rounded-md border bg-gray-50 p-1 text-sm capitalize"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            )}
          </SidebarRow>
          {/* TYPE with ICON */}
          <SidebarRow label="Type">
            {editing !== 'type' ? (
              <div
                onClick={() => setEditing('type')}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
              >
                <TaskTypeIcon type={task.type} />
                <span className="capitalize">{task.type}</span>
              </div>
            ) : (
              <select
                autoFocus
                value={task.type}
                onBlur={() => setEditing(null)}
                onChange={async (e) => {
                  const newType = e.target.value as typeof task.type;

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
                className="w-full rounded-md border bg-gray-50 p-1 text-sm capitalize"
              >
                {TASK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </SidebarRow>
          {/* STORY POINTS */}
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
          {/* DUE DATE — inline editable */}
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
          {/* REPORTER */}
          <SidebarRow label="Reporter">
            <UserCell user={task.reporter} emptyText="—" />
          </SidebarRow>
        </div>
      </div>

      {/* <EditTaskModal
        open={editOpen}
        task={task}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      /> */}
    </>
  );
}
