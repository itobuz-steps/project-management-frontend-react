import type { TaskPopulated, User } from '../../services/types/tasks.types';
import type { ColumnsType } from 'antd/es/table';

export type ManageSubtasksProps = {
  parentTask: TaskPopulated;
  projectId: string;
  columns: string[];

  projectTasks: TaskPopulated[];
  setProjectTasks: React.Dispatch<React.SetStateAction<TaskPopulated[]>>;

  draftIds: string[];
  setDraftIds: React.Dispatch<React.SetStateAction<string[]>>;

  onClose: () => void;
  onSave: () => void;
};

export type SubtasksHeaderProps = {
  count: number;
  progress: number;
  onAdd: (e: React.MouseEvent) => void;
};

export type SubtasksTableProps = {
  loading: boolean;
  subtasks: TaskPopulated[];
  columns: ColumnsType<TaskPopulated>;
};

export type Args = {
  columns: string[];
  parentTaskType?: string;
  openTask: (id: string) => void;
  updateStatus: (id: string, status: string) => Promise<void>;
  removeSubtask: (id: string) => void;
  members: User[];
  loadingMembers: boolean;
  onUpdated: (t: TaskPopulated) => void;
};
