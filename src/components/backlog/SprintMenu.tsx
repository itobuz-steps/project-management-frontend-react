import { message, DatePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { SprintButton } from './SprintButton';
import type { Sprint } from '../../services/types/sprints.types';

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

    await updateSprintDates(startDate, endDate);
    setIsEditingDates(false);
  };

  return (
    <>
      {!sprintStarted && dueDateInputHidden && (
        <SprintButton
          type="button"
          onClick={() => setDueDateInputHidden(!dueDateInputHidden)}
          className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 font-medium text-white shadow-xs focus:outline-none"
        >
          Start Sprint
        </SprintButton>
      )}

      {!sprintStarted && !dueDateInputHidden && (
        <>
          <input
            type="date"
            className="rounded-sm border border-gray-300 px-2 py-1 text-xs"
            ref={dueDateRef}
          />
          <SprintButton
            type="button"
            onClick={startSprint}
            className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 font-medium text-white shadow-xs focus:outline-none"
          >
            Start
          </SprintButton>
        </>
      )}

      {sprintStarted && (
        <>
          {canEditDates &&
            (isEditingDates ? (
              <>
                <DatePicker
                  defaultValue={dayjs(sprint.startDate)}
                  size="small"
                  className="rounded border text-xs"
                  autoFocus
                  onChange={(date) => {
                    if (!date) {
                      return;
                    }

                    setStartDateInput(date.toISOString());
                  }}
                />
                <DatePicker
                  defaultValue={dayjs(sprint.dueDate)}
                  size="small"
                  className="rounded border text-xs"
                  onChange={(date) => {
                    if (!date) {
                      return;
                    }

                    setEndDateInput(date.toISOString());
                  }}
                />

                <SprintButton type="button" onClick={handleSaveDates}>
                  Save Dates
                </SprintButton>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingDates(false);
                  }}
                  className="cursor-pointer rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setStartDateInput(toDateInputValue(sprint.startDate));
                  setEndDateInput(toDateInputValue(sprint.dueDate));
                  setIsEditingDates(true);
                }}
                className="cursor-pointer rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                Edit Dates
              </button>
            ))}

          <SprintButton
            type="button"
            onClick={completeSprint}
            className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 font-medium text-white shadow-xs focus:outline-none"
          >
            Complete Sprint
          </SprintButton>
        </>
      )}
    </>
  );
}
