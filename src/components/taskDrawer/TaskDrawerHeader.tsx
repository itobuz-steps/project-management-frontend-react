import { Button, Input, Tag, message, type InputRef } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';

export function TaskDrawerHeader({
  task,
  onUpdated,
}: {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    setValue(task.title);
  }, [task.title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const save = async () => {
    if (!value.trim() || value === task.title) {
      setEditing(false);
      setValue(task.title);
      return;
    }

    setSaving(true);

    // optimistic update
    onUpdated({ ...task, title: value });

    try {
      await updateTask(task._id, { title: value });
      message.success('Title updated');
    } catch {
      message.error('Failed to update title');
      setValue(task.title);
      onUpdated(task);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const cancel = () => {
    setValue(task.title);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      {/* LEFT */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* TYPE ICON */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gray-100">
          <TaskTypeIcon type={task.type} />
        </div>

        {/* TASK KEY */}
        <Tag color="blue" className="shrink-0">
          {task.key}
        </Tag>

        {/* TITLE */}
        {!editing ? (
          <h1
            className="min-w-0 cursor-pointer truncate rounded px-1 text-lg font-semibold hover:bg-gray-100 sm:text-xl sm:whitespace-normal"
            onClick={() => setEditing(true)}
            title={task.title}
          >
            {task.title}
          </h1>
        ) : (
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
            disabled={saving}
            className="w-full sm:w-105"
          />
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:self-start">
        <Tag color="blue">{task.status}</Tag>

        <Button
          type="text"
          icon={<ExportOutlined />}
          onClick={() => window.open(`/task/${task._id}`, '_blank')}
        />
      </div>
    </div>
  );
}
