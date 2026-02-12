import { Button, Input, message, type InputRef } from 'antd';
import {
  ExportOutlined,
  ArrowsAltOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { SidebarRow } from './SidebarRow';
import { StatusSelect } from '../../utils/StatusSelect';
import { getProjectById } from '../../services/projectService';
import getTaskById from '../../services/taskService';
import { useIsMobile } from '../../utils/isMobile';
import { Link } from 'react-router-dom';

export function TaskModalHeader({
  task,
  onUpdated,
  onClose,
  page,
}: {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
  onClose?: () => void;
  page: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [parentTask, setParentTask] = useState<TaskPopulated | null>(null);
  const isMobile = useIsMobile(768);

  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    setValue(task.title);
  }, [task.title]);

  useEffect(() => {
    if (!task.parentTask) {
      setParentTask(null);
      return;
    }

    let cancelled = false;

    async function fetchParentTask() {
      try {
        const parent = await getTaskById(task.parentTask as string);
        if (!cancelled) {
          setParentTask(parent);
        }
      } catch {
        setParentTask(null);
      }
    }

    fetchParentTask();

    return () => {
      cancelled = true;
    };
  }, [task.parentTask]);

  useEffect(() => {
    async function fetchColumns() {
      const project = await getProjectById(task.projectId as unknown as string);
      setColumns(project.columns);
    }

    fetchColumns();
  }, [task.projectId]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = async () => {
    if (!value.trim() || value === task.title) {
      setEditing(false);
      setValue(task.title);
      return;
    }

    setSaving(true);
    onUpdated({ ...task, title: value });

    try {
      await updateTask(task._id, { title: value });
    } catch {
      message.error('Failed to update title');
      onUpdated(task);
      setValue(task.title);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return (
    <div className="flex flex-col pr-3">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          {/* Parent task */}
          {parentTask && (
            <>
              <TaskTypeIcon type={parentTask.type} />
              <a
                href={`/task/${parentTask._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="!text-inherit text-gray-500 hover:text-gray-600 hover:underline"
              >
                {parentTask.key}
              </a>

              <span className="mx-1">/</span>
            </>
          )}

          <TaskTypeIcon type={task.type} />
          <Link
            to={`/task/${task._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="!text-inherit text-gray-500 hover:text-gray-600 hover:underline"
          >
            {task.key}
          </Link>
        </div>

        <div
          className={`flex items-center gap-2 ${
            page ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <Button
            size="middle"
            icon={<ExportOutlined />}
            onClick={() => window.open(`/task/${task._id}`, '_blank')}
          />
          <Button
            size="middle"
            icon={<ArrowsAltOutlined />}
            onClick={() => window.open(`/task/${task._id}`, '_blank')}
          />
          <Button size="middle" icon={<CloseOutlined />} onClick={onClose} />
        </div>
      </div>

      <div className="h-4" />

      <div className="flex flex-row justify-between gap-2">
        <div className="flex items-center">
          {/* Title */}
          {!editing ? (
            <h1
              className="cursor-pointer rounded px-1 text-2xl font-semibold hover:bg-gray-100"
              onClick={() => setEditing(true)}
            >
              {task.title}
            </h1>
          ) : (
            <Input.TextArea
              ref={inputRef}
              value={value}
              autoSize={{ minRows: 1, maxRows: 3 }}
              bordered={false}
              className="!text-2xl font-semibold"
              onChange={(e) => setValue(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  save();
                }
                if (e.key === 'Escape') {
                  setEditing(false);
                  setValue(task.title);
                }
              }}
              disabled={saving}
            />
          )}
        </div>

        <div className={`flex ${isMobile ? '' : 'w-[380px]'} `}>
          {/* Inline Status */}
          <SidebarRow>
            <StatusSelect
              className="!px-6 !py-4"
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
        </div>
      </div>
    </div>
  );
}
