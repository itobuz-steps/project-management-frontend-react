import { Button, Checkbox } from 'antd';
import { useMemo, useState } from 'react';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { createTask } from '../../services/taskService';
import type { ManageSubtasksProps } from './subtask.types';
import type { TaskType } from '../../services/types/tasks.types';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getAllowedChildTaskTypes } from '../../utils/taskTypeRules';

const toLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function ManageSubtasks({
  parentTask,
  projectId,
  columns,
  projectTasks,
  setProjectTasks,
  draftIds,
  setDraftIds,
  onClose,
  onSave,
}: ManageSubtasksProps) {
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TaskType | null>(null);

  const allowedTypes = useMemo(() => {
    return getAllowedChildTaskTypes(parentTask.type);
  }, [parentTask.type]);

  const typeOptions = useMemo(
    () => allowedTypes.map((type) => ({ label: toLabel(type), value: type })),
    [allowedTypes]
  );

  const effectiveTypeFilter =
    typeFilter && allowedTypes.includes(typeFilter) ? typeFilter : null;

  const filteredTasks = projectTasks.filter((task) => {
    const allowedByParentType = allowedTypes.includes(task.type);
    if (!allowedByParentType) {
      return false;
    }

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.key!.toLowerCase().includes(search.toLowerCase());

    const matchesType = effectiveTypeFilter
      ? task.type === effectiveTypeFilter
      : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="mt-3 rounded-md border border-gray-200 px-3 py-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          Add existing subtasks
        </span>

        <div className="flex items-center gap-2">
          <Button
            size="small"
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white',
              border: 'var(--color-primary-500)',
            }}
            onClick={() => setCreating(true)}
          >
            + Subtask
          </Button>

          <Button
            style={{
              border: 'var(--color-primary-500) solid 1px',
            }}
            type="text"
            size="small"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <Input
          placeholder="Search tasks..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="flex-1"
        />

        <Select
          placeholder="Type"
          allowClear
          value={effectiveTypeFilter ?? undefined}
          onChange={(value) => setTypeFilter(value ?? null)}
          className="w-30"
          options={typeOptions}
          disabled={typeOptions.length === 0}
        />
      </div>

      <div className="max-h-50 overflow-y-auto">
        {filteredTasks.length === 0 && (
          <div className="py-4 text-center text-sm text-gray-500">
            No tasks found
          </div>
        )}
        {filteredTasks.map((task) => {
          const checked = draftIds.includes(task._id);

          return (
            <div
              key={task._id}
              onClick={() =>
                setDraftIds((prev) =>
                  checked
                    ? prev.filter((id) => id !== task._id)
                    : [...prev, task._id]
                )
              }
              className={`flex cursor-pointer items-center justify-between border-b border-gray-200 px-2 py-2.5 transition ${
                checked ? 'bg-primary-50' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate text-sm text-gray-700">
                <div>
                  <TaskTypeIcon type={task.type} />
                </div>
                <span className="truncate">
                  <span className="mr-1 text-gray-500">{task.key}</span>
                  {task.title}
                </span>
              </div>

              <Checkbox
                checked={checked}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setDraftIds((prev) =>
                    e.target.checked
                      ? [...prev, task._id]
                      : prev.filter((subtask) => subtask !== task._id)
                  )
                }
              />
            </div>
          );
        })}
      </div>

      {creating && (
        <div className="mb-1 flex items-center gap-2 rounded-md border border-gray-50 bg-white px-2 py-3">
          <TaskTypeIcon type="task" />

          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 text-sm outline-none"
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && newTitle.trim()) {
                const newTask = await createTask({
                  title: newTitle,
                  projectId,
                  type: 'task',
                  status: columns[0],
                });

                setProjectTasks((project) => [...project, newTask]);
                setDraftIds((ids) =>
                  ids.includes(newTask._id) ? ids : [...ids, newTask._id]
                );

                setNewTitle('');
                setCreating(false);
              }

              if (e.key === 'Escape') {
                setCreating(false);
                setNewTitle('');
              }
            }}
          />

          <Button
            size="small"
            onClick={() => {
              setCreating(false);
              setNewTitle('');
            }}
          >
            ✕
          </Button>
        </div>
      )}

      <div className="mt-2 flex justify-end gap-2 border-t border-gray-200 pt-2">
        <Button
          style={{
            border: 'var(--color-primary-500) solid 1px',
          }}
          type="text"
          size="small"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          size="small"
          type="primary"
          style={{
            backgroundColor: 'var(--color-primary-500)',
            color: 'white',
          }}
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
