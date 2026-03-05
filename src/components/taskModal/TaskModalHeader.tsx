import { Button, Input, type InputRef } from 'antd';
import { ArrowsAltOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { SidebarRow } from '../ui/SidebarRow';
import { StatusSelect } from '../ui/StatusSelect';
import { Link } from 'react-router-dom';
import type { HeaderProps } from './taskModal.types';
import { useParentTask } from '../../hooks/useParentTask';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';

export function TaskModalHeader({
  task,
  onUpdated,
  onClose,
  page,
  drawer,
}: HeaderProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  const inputRef = useRef<InputRef>(null);

  const parentTask = useParentTask(task.parentTask);
  const { columns } = useProjectMetaData(task.projectId as string);

  const { update } = useTaskUpdate(task._id, onUpdated);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const saveTitle = async () => {
    if (!value.trim() || value === task.title) {
      setEditing(false);
      setValue(task.title);
      return;
    }

    await update({ title: value }, 'Failed to update title');

    setEditing(false);
  };

  return (
    <div className="flex flex-col pr-1">
      {/* Top row */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          {parentTask && (
            <>
              <TaskTypeIcon type={parentTask.type} />
              <Link
                to={`/task/${parentTask._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit! hover:text-gray-600 hover:underline"
              >
                {parentTask.key}
              </Link>
              <span className="mx-1">/</span>
            </>
          )}

          <TaskTypeIcon type={task.type} />
          <Link
            to={`/task/${task._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit! hover:text-gray-600 hover:underline"
          >
            {task.key}
          </Link>
        </div>

        <div
          className={`flex items-center gap-2 ${
            page ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <Link to={`/task/${task._id}`} target="_blank">
            <Button
              style={{
                border: 'var(--color-primary-500) solid 1px',
              }}
              type="text"
              size="middle"
              icon={<ArrowsAltOutlined />}
            />
          </Link>
          <Button
            style={{
              border: 'var(--color-primary-500) solid 1px',
            }}
            type="text"
            size="middle"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </div>
      </div>

      <div className="h-4" />

      {/* Title + status */}
      <div
        className={`flex gap-2 ${drawer ? 'flex-col' : 'flex-col md:flex-row'}`}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {!editing ? (
            <h1
              className="cursor-pointer rounded px-1 text-2xl font-semibold break-words hover:bg-gray-100"
              onClick={() => {
                setValue(task.title);
                setEditing(true);
              }}
            >
              {task.title}
            </h1>
          ) : (
            <Input.TextArea
              ref={inputRef}
              value={value}
              autoSize={{ minRows: 1, maxRows: 3 }}
              bordered={false}
              className="text-2xl! font-semibold break-all"
              onChange={(e) => setValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  saveTitle();
                }

                if (e.key === 'Escape') {
                  setEditing(false);
                  setValue(task.title);
                }
              }}
            />
          )}
        </div>

        <div
          className={`shrink-0 self-end ${drawer ? 'flex' : 'md:w-[296px] lg:w-[396px] 2xl:w-[496px]'}`}
        >
          <SidebarRow>
            <StatusSelect
              className="px-6! py-4!"
              value={task.status}
              columns={columns}
              onChange={(status) =>
                update({ status }, 'Failed to update status')
              }
            />
          </SidebarRow>
        </div>
      </div>
    </div>
  );
}
