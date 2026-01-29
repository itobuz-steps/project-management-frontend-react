import { useState } from 'react';
import { SprintButton } from './SprintButton';

interface SprintMenuProps {
  dueDateRef: React.RefObject<HTMLInputElement | null>;
  sprintStarted: boolean;
  startSprint: () => void;
  completeSprint: () => void;
}

export function SprintMenu({
  dueDateRef,
  sprintStarted,
  startSprint,
  completeSprint,
}: SprintMenuProps) {
  const [dueDateInputHidden, setDueDateInputHidden] = useState(true);
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
        <SprintButton
          type="button"
          onClick={completeSprint}
          className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 font-medium text-white shadow-xs focus:outline-none"
        >
          Complete Sprint
        </SprintButton>
      )}
    </>
  );
}
