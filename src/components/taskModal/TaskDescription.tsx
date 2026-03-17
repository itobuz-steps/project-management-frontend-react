import { useCallback, useEffect, useRef, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { TextEditor } from '../textEditor/TextEditor';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import type { TaskDescriptionProps } from './taskModal.types';
import ReactMarkdown from 'react-markdown';
import { Button } from 'antd';

export function TaskDescription({ task, onUpdated }: TaskDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.description || '');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const { update } = useTaskUpdate(task._id, onUpdated ?? (() => {}));

  useEffect(() => {
    setValue(task.description || '');
  }, [task.description]);

  const cancel = useCallback(() => {
    setValue(task.description || '');
    closeEditor();
  }, [task.description]);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const clickedInsideEditor =
        editorRef.current && editorRef.current.contains(target);

      const clickedInsideAntdDropdown =
        target.closest('.ant-select-dropdown') ||
        target.closest('.ant-picker-dropdown') ||
        target.closest('.ant-dropdown');

      if (!clickedInsideEditor && !clickedInsideAntdDropdown) {
        cancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editing, cancel]);

  const save = async () => {
    if (value === task.description) {
      closeEditor();
      return;
    }

    setSaving(true);
    try {
      await update(
        { description: value ?? null },
        'Failed to update description'
      );
    } finally {
      setSaving(false);
      closeEditor();
    }
  };

  const openEditor = () => {
    setExpanded(true);
    setEditing(true);
  };

  const closeEditor = () => {
    setExpanded(false);
    setEditing(false);
  };

  const toggleExpanded = () => {
    if (expanded) {
      closeEditor();
    } else {
      setExpanded(true);
    }
  };

  return (
    <div className="my-4">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center gap-2 text-base font-bold"
        onClick={toggleExpanded}
      >
        {expanded ? <DownOutlined /> : <RightOutlined />}
        <span className="text-base">Description</span>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="mt-2 ml-5">
          {!editing ? (
            <div
              className="cursor-pointer rounded-md bg-gray-100 p-3 text-sm hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={openEditor}
            >
              {task.description ? (
                <div className="prose">
                  <ReactMarkdown>{task.description}</ReactMarkdown>
                </div>
              ) : (
                <span className="text-gray-400 dark:text-slate-400">
                  Add a description…
                </span>
              )}
            </div>
          ) : (
            <div ref={editorRef}>
              <TextEditor
                comment={false}
                content={value}
                onChange={setValue}
                onSave={save}
                onCancel={cancel}
                disabled={saving}
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  style={{
                    border: 'var(--color-primary-500) solid 1px',
                  }}
                  type="text"
                  onClick={cancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  style={{
                    backgroundColor: 'var(--color-primary-500)',
                    color: 'white',
                  }}
                  type="primary"
                  loading={saving}
                  onClick={save}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
