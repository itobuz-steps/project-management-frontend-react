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
      return;
    }

    try {
      const dueDate = new Date(dueDateRef.current.value);

      await sprintService.updateSprint(sprint._id, { dueDate });
      message.success('Sprint Updated');

      setSprints?.((prev) =>
        prev.map((newSprint) =>
          newSprint._id === sprint._id ? { ...newSprint, dueDate } : newSprint
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
    createSprint,
    deleteSprint,
  };
}
