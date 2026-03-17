import { message, DatePicker, Modal, Tooltip, Popconfirm } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { CheckCircle } from 'lucide-react';
import { SprintButton } from './SprintButton';
import type { Sprint } from '../../services/types/sprints.types';
import { useIsMobile } from '../../utils/isMobile';
import { Can } from '../../utils/PermissionHoc';
import { DeleteOutlined } from '@ant-design/icons';
import { useSprintActions } from '../../hooks/useSprintActions';
import { useProject } from '../../context/ProjectContext';

interface SprintMenuProps {
  sprint: Sprint;
  dueDateRef: React.RefObject<HTMLInputElement | null>;
  sprintStarted: boolean;
  canEditDates: boolean;
  startSprint: () => void;
  updateSprintDates: (startDate: Date, endDate: Date) => Promise<void>;
  completeSprint: () => void;
}

const toDateInputValue = (value?: Date) => {
  if (!value) {
    return '';
  }
  return dayjs(value).format('YYYY-MM-DD');
};

const parseDateInputValue = (value: string) => {
  return dayjs(value, 'YYYY-MM-DD').toDate();
};

export function SprintMenu({
  sprint,
  dueDateRef,
  sprintStarted,
  canEditDates,
  startSprint,
  updateSprintDates,
  completeSprint,
}: SprintMenuProps) {
  const [dueDateInputHidden, setDueDateInputHidden] = useState(true);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [startSprintDueDateInput, setStartSprintDueDateInput] = useState('');
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile(640);
  const { project } = useProject();

  const datePickerFormat = 'DD-MM-YYYY';

  const toPickerValue = (value?: string) => {
    if (!value) {
      return null;
    }
    return dayjs(value, 'YYYY-MM-DD');
  };

  const syncStartSprintDueDate = (value: string) => {
    setStartSprintDueDateInput(value);
    if (dueDateRef.current) {
      dueDateRef.current.value = value;
    }
  };

  const openEditDates = () => {
    setStartDateInput(toDateInputValue(sprint.startDate));
    setEndDateInput(toDateInputValue(sprint.dueDate));
    setIsEditingDates(true);
  };

  const { deleteSprint } = useSprintActions(project?._id);
  const closeEditDates = () => setIsEditingDates(false);

  const handleSaveDates = async () => {
    if (!startDateInput || !endDateInput) {
      message.warning('Please provide both start and end dates');
      return;
    }
    const startDate = parseDateInputValue(startDateInput);
    const endDate = parseDateInputValue(endDateInput);
    if (endDate < startDate) {
      message.warning('End date cannot be before start date');
      return;
    }
    setSaving(true);
    try {
      await updateSprintDates(startDate, endDate);
      setIsEditingDates(false);
    } finally {
      setSaving(false);
    }
  };

  // Shared date picker fields used in both inline and modal
  const DateFields = () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">Start date</span>
        <DatePicker
          value={toPickerValue(startDateInput)}
          format={datePickerFormat}
          size="small"
          className="w-full rounded border text-xs"
          autoFocus
          onChange={(date) =>
            setStartDateInput(date ? date.format('YYYY-MM-DD') : '')
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">End date</span>
        <DatePicker
          value={toPickerValue(endDateInput)}
          format={datePickerFormat}
          size="small"
          className="w-full rounded border text-xs"
          onChange={(date) =>
            setEndDateInput(date ? date.format('YYYY-MM-DD') : '')
          }
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ── Not started, date picker hidden ── */}
      {!sprintStarted && dueDateInputHidden && (
        <SprintButton
          type="button"
          onClick={() => {
            const initialDate = toDateInputValue(sprint.dueDate);
            syncStartSprintDueDate(initialDate);
            setDueDateInputHidden(false);
          }}
          className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 text-xs font-medium text-white shadow-xs focus:outline-none"
        >
          Start Sprint
        </SprintButton>
      )}

      {/* ── Not started, picking a date ── */}
      {!sprintStarted && !dueDateInputHidden && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            className="hidden"
            ref={dueDateRef}
            value={startSprintDueDateInput}
            onChange={(event) => setStartSprintDueDateInput(event.target.value)}
          />
          <DatePicker
            value={toPickerValue(startSprintDueDateInput)}
            format={datePickerFormat}
            size="small"
            className="rounded-sm border border-gray-300 text-xs"
            onChange={(date) =>
              syncStartSprintDueDate(date ? date.format('YYYY-MM-DD') : '')
            }
          />
          <SprintButton
            type="button"
            onClick={startSprint}
            className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 text-xs font-medium text-white shadow-xs focus:outline-none"
          >
            Start
          </SprintButton>
          <button
            type="button"
            onClick={() => setDueDateInputHidden(true)}
            className="cursor-pointer rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Sprint started ── */}
      {sprintStarted && (
        <div className="flex flex-wrap items-center gap-2">
          {canEditDates && (
            <>
              {/* Mobile: modal */}
              {isMobile && (
                <>
                  <button
                    type="button"
                    onClick={openEditDates}
                    className="cursor-pointer rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Edit Dates
                  </button>
                  <Modal
                    title="Edit Sprint Dates"
                    open={isEditingDates}
                    onCancel={closeEditDates}
                    onOk={handleSaveDates}
                    okText="Save"
                    confirmLoading={saving}
                    okButtonProps={{ size: 'small' }}
                    cancelButtonProps={{ size: 'small' }}
                    width="90vw"
                    style={{ maxWidth: 360, marginTop: '20vh' }}
                    maskStyle={{
                      backdropFilter: 'none',
                      backgroundColor: 'rgba(0,0,0,0.55)',
                    }}
                  >
                    <div className="py-2">
                      <DateFields />
                    </div>
                  </Modal>
                </>
              )}

              {/* Desktop: inline */}
              {!isMobile &&
                (isEditingDates ? (
                  <div className="flex items-center gap-2">
                    <DatePicker
                      value={toPickerValue(startDateInput)}
                      format={datePickerFormat}
                      size="small"
                      className="rounded border text-xs"
                      autoFocus
                      onChange={(date) =>
                        setStartDateInput(date ? date.format('YYYY-MM-DD') : '')
                      }
                    />
                    <span className="text-xs text-gray-400">→</span>
                    <DatePicker
                      value={toPickerValue(endDateInput)}
                      format={datePickerFormat}
                      size="small"
                      className="rounded border text-xs"
                      onChange={(date) =>
                        setEndDateInput(date ? date.format('YYYY-MM-DD') : '')
                      }
                    />
                    <SprintButton type="button" onClick={handleSaveDates}>
                      Save
                    </SprintButton>
                    <button
                      type="button"
                      onClick={closeEditDates}
                      className="cursor-pointer rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openEditDates}
                    className="cursor-pointer rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Edit Dates
                  </button>
                ))}
            </>
          )}

          {/* Complete sprint — icon on mobile, text on sm+ */}
          <Tooltip title="Complete Sprint">
            <button
              type="button"
              onClick={completeSprint}
              className="bg-primary-400 hover:bg-primary-500 flex cursor-pointer items-center justify-center rounded-sm px-2 py-1 text-xs font-medium text-white shadow-xs focus:outline-none"
            >
              <CheckCircle className="h-3.5 w-3.5 sm:hidden" />
              <span className="hidden sm:inline">Complete Sprint</span>
            </button>
          </Tooltip>
          <Can permission="DELETE_SPRINT">
            {sprint && (
              <Popconfirm
                title="Delete sprint"
                description="Are you sure you want to delete this sprint?"
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{
                  style: {
                    backgroundColor: 'var(--color-primary-500)',
                    color: 'white',
                  },
                }}
                cancelButtonProps={{
                  style: {
                    border: 'var(--color-primary-500) solid 1px',
                  },
                  type: 'text',
                }}
                onConfirm={() => deleteSprint(sprint)}
              >
                <button
                  title="Delete Sprint"
                  className="flex items-center gap-1 text-gray-500 hover:cursor-pointer hover:text-red-600"
                >
                  <DeleteOutlined size={16} />
                </button>
              </Popconfirm>
            )}
          </Can>
        </div>
      )}
    </div>
  );
}
