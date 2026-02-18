import { useEffect, useMemo, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { TextEditor } from '../textEditor/TextEditor';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import type { TaskDescriptionProps } from './taskModal.types';
import ReactMarkdown from 'react-markdown';

export function TaskDescription({ task, onUpdated }: TaskDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.description || '');
  const [saving, setSaving] = useState(false);

  const { update } = useTaskUpdate(task._id, onUpdated ?? (() => {}));

  useEffect(() => {
    setValue(task.description || '');
  }, [task.description]);

  const previewText = useMemo(() => {
    if (!value) {
      return '';
    }

    return value
      .replace(/[`*_>#~\-![\]()]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 140);
  }, [value]);

  const save = async () => {
    if (value === task.description) {
      closeEditor();
      return;
    }

    setSaving(true);

    try {
      await update({ description: value }, 'Failed to update description');
    } finally {
      setSaving(false);
      closeEditor();
    }
  };

  const cancel = () => {
    setValue(task.description || '');
    closeEditor();
  };

  const openEditor = () => {
    setExpanded(true);
    setEditing(true);
  };

  const closeEditor = () => {
    setExpanded(false);
    setEditing(false);
  };

  return (
    <div className="my-4">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center gap-2 text-base font-bold"
        onClick={() => {
          setExpanded((dropdown) => !dropdown);
          if (!task.description) {
            setEditing(true);
          }
        }}
      >
        {expanded ? <DownOutlined /> : <RightOutlined />}
        <span className="text-base">Description</span>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="mt-2">
          {!editing ? (
            <div
              className="cursor-pointer rounded-md bg-gray-100 p-3 text-sm hover:bg-gray-200"
              onClick={openEditor}
            >
              {task.description ? (
                <ReactMarkdown>{task.description}</ReactMarkdown>
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
          className="mt-1 ml-5 line-clamp-2 cursor-pointer text-sm text-gray-500 hover:text-gray-700"
          onClick={openEditor}
        >
          {previewText ? (
            <>
              {previewText}
              {previewText.length >= 140 && '…'}
            </>
          ) : (
            <span>Add a description…</span>
          )}
        </div>
      )}
    </div>
  );
}
