import { Button, Checkbox } from 'antd';
import { useState } from 'react';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { createTask } from '../../services/taskService';
import type { ManageSubtasksProps } from './subtask.types';

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

  return (
    <div className="mt-3 rounded-md border border-gray-200 px-3 py-2">
      {/* Header */}
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

      {/* List */}
      <div className="max-h-[200px] overflow-y-auto">
        {projectTasks.map((task) => {
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

      {/* Create new subtask */}
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
                  parentTask: parentTask._id,
                  projectId,
                  type: 'task',
                  status: columns[0],
                });

                setProjectTasks((project) => [...project, newTask]);
                setDraftIds((ids) => [...ids, newTask._id]);

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

      {/* Footer */}
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
