import { InputNumber } from 'antd';
import type { Sprint } from '../../services/types/sprints.types';
import { SprintButton } from './SprintButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

interface CreateSprintFormProps {
  sprint?: Sprint | null;
  createSprintHandler: (storyPoint: number) => void;
}

export function CreateSprintForm({
  sprint,
  createSprintHandler,
}: CreateSprintFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [storyPoint, setStoryPoint] = useState<number | null>(null);

  return (
    <>
      {!sprint && !showForm && (
        <SprintButton onClick={() => setShowForm(true)}>
          Create Sprint
        </SprintButton>
      )}

      {showForm && (
        <>
          <div className="flex items-center gap-4">
            <X
              className="-mr-2 size-4 cursor-pointer"
              onClick={() => setShowForm(false)}
            />
            <InputNumber
              min={0}
              onChange={(value) => setStoryPoint(value)}
              placeholder="Story Points"
              style={{ width: '120px' }}
            />{' '}
          </div>
          <SprintButton
            onClick={() => {
              if (
                !storyPoint ||
                !Number.isInteger(storyPoint) ||
                storyPoint < 0
              ) {
                toast.error('Please enter a valid number for story points');
                return;
              }

              createSprintHandler(storyPoint);
              setShowForm(false);
            }}
          >
            Create
          </SprintButton>
        </>
      )}
    </>
  );
}
