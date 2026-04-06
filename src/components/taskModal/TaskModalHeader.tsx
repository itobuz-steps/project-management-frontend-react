import { Button, Input, type InputRef, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  ArrowsAltOutlined,
  CloseOutlined,
  FullscreenOutlined,
  ShrinkOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { SidebarRow } from '../ui/SidebarRow';
import { StatusSelect } from '../ui/StatusSelect';
import { Link } from 'react-router-dom';
import type { HeaderProps } from './taskModal.types';
import { useParentTask } from '../../hooks/useParentTask';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import { TaskTimerSection } from './TaskTimerSection';
import { useTaskExport } from '../../hooks/useTaskExport';

export function TaskModalHeader({
  task,
  onUpdated,
  onClose,
  page,
  drawer,
  onToggleView,
  isDrawerView,
}: HeaderProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const inputRef = useRef<InputRef>(null);

  const parentTask = useParentTask(task.parentTask);
  const { columns } = useProjectMetaData(task.projectId as string);
  const { update } = useTaskUpdate(task._id, onUpdated);
  const { exportPDF, exportExcel, exportXML } = useTaskExport(task);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
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

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'pdf',
      icon: <FilePdfOutlined style={{ color: '#ef4444' }} />,
      label: <span className="text-sm">Export as PDF</span>,
      onClick: exportPDF,
    },
    {
      key: 'excel',
      icon: <FileExcelOutlined style={{ color: '#22c55e' }} />,
      label: <span className="text-sm">Export as Excel</span>,
      onClick: exportExcel,
    },
    {
      key: 'xml',
      icon: <FileTextOutlined style={{ color: '#3b82f6' }} />,
      label: <span className="text-sm">Export as XML</span>,
      onClick: exportXML,
    },
  ];

  return (
    <div className="flex flex-col sm:pr-1">
      {/* Top row */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1">
          {parentTask && (
            <>
              <TaskTypeIcon type={parentTask.type} />
              <Link
                to={`/task/${parentTask._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-inherit! hover:underline! dark:hover:text-neutral-200!"
              >
                {parentTask.key}
              </Link>
              <span>/</span>
            </>
          )}
          <TaskTypeIcon type={task.type} />
          <Link
            to={`/task/${task._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-inherit! hover:underline! dark:hover:text-neutral-200!"
          >
            {task.key}
          </Link>
        </div>

        {/* Action buttons */}
        <div
          className={`flex items-center gap-2 ${
            page ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          {/* Export dropdown */}
          <Tooltip title="Export task">
            <Dropdown
              menu={{ items: exportMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                style={{ border: 'var(--color-primary-500) solid 1px' }}
                type="text"
                size="middle"
                icon={<DownloadOutlined />}
              />
            </Dropdown>
          </Tooltip>

          <Button
            style={{ border: 'var(--color-primary-500) solid 1px' }}
            type="text"
            size="middle"
            icon={isDrawerView ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
            onClick={onToggleView}
          />
          <Link to={`/task/${task._id}`} target="_blank">
            <Button
              style={{ border: 'var(--color-primary-500) solid 1px' }}
              type="text"
              size="middle"
              icon={<FullscreenOutlined />}
            />
          </Link>
          <Button
            style={{ border: 'var(--color-primary-500) solid 1px' }}
            type="text"
            size="middle"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </div>
      </div>

      <div className="h-4" />

      <div
        className={`flex gap-2 ${drawer ? 'flex-col' : 'flex-col md:flex-row'}`}
      >
        {/* Editable title */}
        <div className="flex min-w-0 flex-1 items-center">
          {!editing ? (
            <h1
              className="cursor-pointer rounded px-1 text-2xl font-semibold wrap-break-word hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
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
                if (e.key === 'Enter' && !e.shiftKey) saveTitle();
                if (e.key === 'Escape') {
                  setEditing(false);
                  setValue(task.title);
                }
              }}
            />
          )}
        </div>

        {/* Status + timer */}
        <div
          className={`flex shrink-0 items-center self-end ${
            drawer ? '' : 'md:w-74 lg:w-99 2xl:w-124'
          }`}
        >
          <SidebarRow>
            <StatusSelect
              className="px-3! py-4.5!"
              value={task.status}
              columns={columns}
              onChange={(status) =>
                update({ status }, 'Failed to update status')
              }
            />
          </SidebarRow>
          <TaskTimerSection
            taskId={task._id}
            assigneeId={task.assignee?._id}
            status={task.status}
          />
        </div>
      </div>
    </div>
  );
}
