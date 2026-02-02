import { Button, Input, Tag, message, type InputRef } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { useNavigate } from 'react-router';

export function TaskDrawerHeader({
  task,
  onUpdated,
}: {
  task: TaskPopulated;
  projectId: string;
  onUpdated: (t: TaskPopulated) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const navigate = useNavigate();

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
    <div className="flex items-start justify-between gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        {/* TYPE ICON */}
        <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-100">
          <TaskTypeIcon type={task.type} />
        </div>

        {/* TASK KEY */}
        <Tag color="blue">{task.key}</Tag>

        {/* TITLE */}
        {!editing ? (
          <h1
            className="cursor-pointer rounded px-1 text-xl font-semibold hover:bg-gray-100"
            onClick={() => setEditing(true)}
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
            className="w-105"
          />
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <Tag color="blue">{task.status}</Tag>

        <Button
          type="text"
          icon={<ExportOutlined />}
          onClick={() => navigate(`/task/${task._id}`)}
          target="_blank"
        />
      </div>
    </div>
  );
}
