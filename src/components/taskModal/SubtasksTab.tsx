import { useEffect, useState } from 'react';
import { Collapse, message } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';

import type { TaskPopulated, User } from '../../services/types/tasks.types';
import getTaskById, {
  getTaskByProjectId,
  updateTask,
} from '../../services/taskService';
import { getProgressFromSubtasks } from '../../utils/getProgressFromSubtasks';
import { useSubtaskColumns } from '../subtask/useSubtaskColumns';
import { SubtasksHeader } from '../subtask/SubtasksHeader';
import { SubtasksTable } from '../subtask/SubtasksTable';
import { ManageSubtasks } from '../subtask/ManageSubtasks';
import {
  getProjectById,
  getProjectMembers,
} from '../../services/projectService';

export function SubtasksTab({ task }: { task: TaskPopulated }) {
  const { projectId } = useParams();
  const [, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [subtasks, setSubtasks] = useState<TaskPopulated[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (task.subTasks ?? []) as string[]
  );
  const [manageOpen, setManageOpen] = useState(false);

  const [, setModalOpen] = useState(false);
  const [projectTasks, setProjectTasks] = useState<TaskPopulated[]>([]);

  const [draftIds, setDraftIds] = useState<string[]>([]);

  const [columns, setColumns] = useState<string[]>([]);

  const progress = getProgressFromSubtasks(subtasks, columns);

  useEffect(() => {
    async function fetchColumns() {
      const project = await getProjectById(task.projectId as unknown as string);
      setColumns(project.columns);
    }

    fetchColumns();
  }, [task.projectId]);

  const [members, setMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      setLoadingMembers(true);
      try {
        const result = await getProjectMembers(task.projectId as string);
        setMembers(result);
      } finally {
        setLoadingMembers(false);
      }
    }

    loadMembers();
  }, [task.projectId]);

  const onSubtaskUpdated = (updated: TaskPopulated) => {
    setSubtasks((prev) =>
      prev.map((task) => (task._id === updated._id ? updated : task))
    );
  };

  useEffect(() => {
    if (!selectedIds.length) {
      setSubtasks([]);
      return;
    }

    const fetchSubtasks = async () => {
      setLoading(true);
      try {
        const res = await Promise.all(selectedIds.map((id) => getTaskById(id)));
        setSubtasks(res);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtasks();
  }, [selectedIds.join(',')]);

  const openManage = async () => {
    setModalOpen(true);
    setDraftIds(selectedIds);

    const tasks = await getTaskByProjectId(
      (projectId as string) ?? task.projectId
    );

    setProjectTasks(
      tasks.filter((newTask: TaskPopulated) => newTask._id !== task._id)
    );
  };

  const saveSubtasks = async () => {
    try {
      await updateTask(task._id, { subTasks: draftIds });

      await Promise.all(
        draftIds.map((id) => updateTask(id, { parentTask: task._id }))
      );

      setSelectedIds(draftIds);
      message.success('Subtasks updated');
      setModalOpen(false);
    } catch {
      message.error('Failed to update subtasks');
    }
  };

  const removeSubtask = async (id: string) => {
    const updated = selectedIds.filter((task) => task !== id);

    setSelectedIds(updated);
    setSubtasks((subtask) => subtask.filter((task) => task._id !== id));

    try {
      await updateTask(task._id, { subTasks: updated });
      await updateTask(id, { parentTask: undefined });
      message.success('Subtask removed');
    } catch {
      message.error('Failed to remove subtask');
    }
  };

  const openTask = (id: string) => {
    setSearchParams({ taskId: id }, { replace: true });
  };

  const updateSubtaskStatus = (id: string, status: string) => {
    setSubtasks((prev) =>
      prev.map((task) => (task._id === id ? { ...task, status } : task))
    );
  };

  const columnsSubtask = useSubtaskColumns({
    columns,
    openTask,
    updateStatus: async (id, status) => {
      updateSubtaskStatus(id, status);
      await updateTask(id, { status });
    },
    removeSubtask,
    members,
    loadingMembers,
    onUpdated: onSubtaskUpdated,
  });

  return (
    <>
      <Collapse
        ghost
        className="jira-subtasks-collapse text-base"
        activeKey={open ? ['1'] : []}
        onChange={() => setOpen((open) => !open)}
        items={[
          {
            key: '1',
            label: (
              <SubtasksHeader
                count={selectedIds.length}
                progress={progress}
                onAdd={() => {
                  openManage();
                  setManageOpen(true);
                }}
              />
            ),
            children: (
              <>
                <SubtasksTable
                  loading={loading}
                  subtasks={subtasks}
                  columns={columnsSubtask}
                />

                {manageOpen && (
                  <ManageSubtasks
                    parentTask={task}
                    projectId={task.projectId as string}
                    columns={columns}
                    projectTasks={projectTasks}
                    setProjectTasks={setProjectTasks}
                    draftIds={draftIds}
                    setDraftIds={setDraftIds}
                    onClose={() => setManageOpen(false)}
                    onSave={saveSubtasks}
                  />
                )}
              </>
            ),
          },
        ]}
      />
    </>
  );
}
