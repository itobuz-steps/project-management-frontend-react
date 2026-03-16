import { useRef } from 'react';
import { AxiosError } from 'axios';
import { createSprintService } from '../services/sprints.service';
import type { Sprint } from '../services/types/sprints.types';
import { message } from 'antd';
import { useProject } from '../context/ProjectContext';

export function useSprintActions(
  projectId?: string,
  setSprints?: React.Dispatch<React.SetStateAction<Sprint[]>>
) {
  const dueDateRef = useRef<HTMLInputElement>(null);

  const sprintService = createSprintService(projectId as string);
  const { project } = useProject();

  const startSprint = async (sprint: Sprint) => {
    if (!dueDateRef.current?.value) {
      message.warning('Please select a due date');
      return;
    }

    try {
      const dueDate = new Date(dueDateRef.current.value);
      const startDate = new Date();

      await sprintService.updateSprint(sprint._id, {
        startDate,
        dueDate,
        isStarted: true,
      });
      message.success('Sprint Updated');

      setSprints?.((prev) =>
        prev.map((existingSprint) =>
          existingSprint._id === sprint._id
            ? {
                ...existingSprint,
                startDate,
                dueDate,
                isStarted: true,
              }
            : existingSprint
        )
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        message.error(err.response?.data.message || 'Failed to start sprint');
      }
    }
  };

  const completeSprint = async (sprint: Sprint) => {
    try {
      await sprintService.updateSprint(sprint._id, {
        isCompleted: true,
      });
      message.success('Sprint Completed');

      setSprints?.((prev) =>
        prev.map((completedSprint) =>
          completedSprint._id === sprint._id
            ? { ...completedSprint, isCompleted: true }
            : completedSprint
        )
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        message.error(
          err.response?.data.message || 'Failed to complete sprint'
        );
      }
    }
  };

  const updateSprintDates = async (
    sprint: Sprint,
    startDate: Date,
    dueDate: Date
  ) => {
    try {
      await sprintService.updateSprint(sprint._id, {
        startDate,
        dueDate,
      });

      setSprints?.((prev) =>
        prev.map((existingSprint) =>
          existingSprint._id === sprint._id
            ? {
                ...existingSprint,
                startDate,
                dueDate,
              }
            : existingSprint
        )
      );

      message.success('Sprint dates updated');
    } catch (err) {
      if (err instanceof AxiosError) {
        message.error(
          err.response?.data.message || 'Failed to update sprint dates'
        );
      }
    }
  };

  const createSprint = async (storyPoint: number) => {
    try {
      const sprint = await sprintService.createSprint({
        projectId: project?._id || '',
        storyPoint,
      });
      message.success('Sprint Created');

      setSprints?.((prevSprints) => [sprint, ...prevSprints]);
    } catch (error) {
      if (error instanceof AxiosError) {
        message.error(
          error.response?.data.message || 'Failed to create sprint'
        );
      }
    }
  };

  const deleteSprint = async (sprint: Sprint) => {
    try {
      await sprintService.deleteSprint(sprint._id);

      setSprints?.((prev) =>
        prev.filter((existingSprint) => existingSprint._id !== sprint._id)
      );

      message.success('Sprint deleted successfully');
    } catch (err) {
      if (err instanceof AxiosError) {
        message.error(err.response?.data.message || 'Failed to delete sprint');
      }
    }
  };

  return {
    dueDateRef,
    startSprint,
    completeSprint,
    updateSprintDates,
    createSprint,
    deleteSprint,
  };
}
