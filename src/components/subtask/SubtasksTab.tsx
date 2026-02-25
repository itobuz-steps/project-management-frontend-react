import { useState } from 'react';
import { Collapse, message } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { getProgressFromSubtasks } from '../../utils/getProgressFromSubtasks';
import { useSubtaskColumns } from './useSubtaskColumns';
import { SubtasksHeader } from './SubtasksHeader';
import { SubtasksTable } from './SubtasksTable';
import { ManageSubtasks } from './ManageSubtasks';
import { useManageSubtasks } from '../../hooks/useManageSubtasksModal';
import { useSubtasks } from '../../hooks/useSubtasks';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';

export function SubtasksTab({ task }: { task: TaskPopulated }) {
  const { projectId } = useParams();
  const [, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const { columns, members, loadingMembers } = useProjectMetaData(
    task.projectId as string
  );
  const {
    selectedIds,
    setSelectedIds,
    subtasks,
    loading,
    updateSubtask,
    updateStatus,
    removeSubtask,
  } = useSubtasks(task);

  const manage = useManageSubtasks(task, projectId);
  const progress = getProgressFromSubtasks(subtasks, columns);

  const columnsSubtask = useSubtaskColumns({
    columns,
    openTask: (id) => setSearchParams({ taskId: id }, { replace: true }),
    updateStatus,
    removeSubtask,
    members,
    loadingMembers,
    onUpdated: updateSubtask,
  });

  const saveSubtasks = async () => {
    try {
      await updateTask(task._id, { subTasks: manage.draftIds });
      await Promise.all(
        manage.draftIds.map((id) => updateTask(id, { parentTask: task._id }))
      );
      setSelectedIds(manage.draftIds);
      message.success('Subtasks updated');
      manage.closeModal();
    } catch {
      message.error('Failed to update subtasks');
    }
  };

  return (
    <Collapse
      ghost
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
                manage.openModal(selectedIds);
                setOpen(true);
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

              {manage.open && (
                <ManageSubtasks
                  parentTask={task}
                  projectId={task.projectId as string}
                  columns={columns}
                  projectTasks={manage.projectTasks}
                  setProjectTasks={manage.setProjectTasks}
                  draftIds={manage.draftIds}
                  setDraftIds={manage.setDraftIds}
                  onClose={manage.closeModal}
                  onSave={saveSubtasks}
                />
              )}
            </>
          ),
        },
      ]}
    />
  );
}
