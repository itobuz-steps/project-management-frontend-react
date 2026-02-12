import { useEffect, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
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
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.description || '');
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(task.description || '');
  }, [task.description]);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const save = async () => {
    if (value === task.description) {
      setEditing(false);
      setExpanded(false);
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
      setExpanded(false);
    }
  };

  const cancel = () => {
    setValue(task.description || '');
    setEditing(false);
    setExpanded(false);
  };

  const preview = task.description?.slice(0, 140) || '';

  return (
    <div className="my-4">
      {/* Header (Accordion trigger) */}
      <div
        className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-900 hover:text-gray-900"
        onClick={() => {
          setExpanded((v) => !v);
          if (!task.description) setEditing(true);
        }}
      >
        {expanded ? <DownOutlined /> : <RightOutlined />}
        <span>Description</span>
      </div>

      {/* Body */}
      {expanded && (
        <div className="mt-2">
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
      )}

      {/* Collapsed preview */}
      {!expanded && (
        <div
          className="mt-1 ml-5 cursor-pointer text-sm text-gray-500 hover:text-gray-700"
          onClick={() => {
            setExpanded(true);
            setEditing(!task.description);
          }}
        >
          {preview ? (
            <span>
              {preview}
              {task.description && task.description.length > 140 && '…'}
            </span>
          ) : (
            <span>Add a description…</span>
          )}
        </div>
      )}
    </div>
  );
}
