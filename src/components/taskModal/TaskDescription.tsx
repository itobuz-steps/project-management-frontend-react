import { useEffect, useState } from 'react';
import { message } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { TextEditor } from '../textEditor/TextEditor';

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

  useEffect(() => {
    setValue(task.description || '');
  }, [task.description]);

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

  const previewText = value?.replace(/<[^>]+>/g, '').slice(0, 140);

  return (
    <div className="my-4">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center gap-2 text-sm font-bold"
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
              className="cursor-pointer rounded-md bg-gray-100 p-3 text-sm hover:bg-gray-200"
              onClick={() => setEditing(true)}
            >
              {task.description ? (
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
              ) : (
                <span className="text-gray-400">Add a description…</span>
              )}
            </div>
          ) : (
            <TextEditor
              comment={false}
              content={value}
              onChange={setValue}
              onSave={save}
              onCancel={cancel}
              disabled={saving}
            />
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
          {previewText ? (
            <span>
              {previewText}
              {previewText.length >= 140 && '…'}
            </span>
          ) : (
            <span>Add a description…</span>
          )}
        </div>
      )}
    </div>
  );
}
