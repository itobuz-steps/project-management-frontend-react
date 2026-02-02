import { useEffect, useRef, useState } from 'react';
import { Input, message } from 'antd';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';

const { TextArea } = Input;

export function TaskDescription({
  task,
  onPatch,
}: {
  task: TaskPopulated;
  onPatch?: (id: string, patch: Partial<TaskPopulated>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.description || '');
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  useEffect(() => {
    setValue(task.description || '');
  }, [task.description]);

  const save = async () => {
    if (value === task.description) {
      setEditing(false);
      return;
    }

    setSaving(true);
    onPatch?.(task._id, { description: value });

    try {
      await updateTask(task._id, { description: value });
      message.success('Description updated');
    } catch {
      message.error('Failed to update description');
      setValue(task.description || '');
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const cancel = () => {
    setValue(task.description || '');
    setEditing(false);
  };

  return (
    <div className="my-3">
      <h4 className="mb-2 text-sm font-semibold text-gray-600">Description</h4>

      {!editing ? (
        <div
          className="group cursor-pointer rounded-md bg-gray-100 p-3 text-sm hover:bg-gray-200"
          onClick={() => setEditing(true)}
        >
          {task.description ? (
            <span>{task.description}</span>
          ) : (
            <span className="text-gray-400">Add a description…</span>
          )}

          <span className="text-primary-500 ml-2 text-xs opacity-0 group-hover:opacity-100">
            Edit
          </span>
        </div>
      ) : (
        <div className="rounded-md border bg-white p-2">
          <TextArea
            ref={ref}
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancel();
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                save();
              }
            }}
            disabled={saving}
          />
          <div className="mt-1 text-xs text-gray-400">
            Press <b>Ctrl/Cmd + Enter</b> to save · <b>Esc</b> to cancel
          </div>
        </div>
      )}
    </div>
  );
}
