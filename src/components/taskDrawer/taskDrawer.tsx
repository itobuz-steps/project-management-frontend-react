import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, Tabs, Tag, Spin } from 'antd';
import type { Task } from '../../types/tasks.types';
import getTaskById from '../../services/taskService';
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

import { TaskDetails } from './TaskDetails';
import { SubtasksTab } from './SubtasksTab';
import { AttachmentsTab } from './AttachmentsTab';
import { CommentsTab } from './CommentsTab';

// export default function TaskModal({ taskId, onClose }: TaskModalProps) {
//   const [task, setTask] = useState<Task | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [searchParams, setSearchParams] = useSearchParams();

//   useEffect(() => {
//     if (!taskId) return;

//     let cancelled = false;

//     async function loadTask() {
//       try {
//         setLoading(true);
//         const data = await getTaskById(taskId);
//         console.log('Fetched task:', data);
//         if (!cancelled) setTask(data);
//       } catch (err) {
//         console.error('Failed to fetch task', err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadTask();
//     return () => {
//       cancelled = true;
//     };
//   }, [taskId]);

//   const closeModal = () => {
//     searchParams.delete('taskId');
//     setSearchParams(searchParams);
//     onClose();
//   };

//   return (
//     <Modal
//       open={!!taskId}
//       onCancel={closeModal}
//       footer={null}
//       width={900}
//       centered
//       destroyOnClose
//       title={
//         <div className="flex items-center gap-3">
//           <Tag color="blue">{task?.key}</Tag>
//           <span className="font-semibold">{task?.title}</span>
//         </div>
//       }
//     >
//       {loading && (
//         <div className="flex justify-center py-20">
//           <Spin size="large" />
//         </div>
//       )}

//       {!loading && task && (
//         <Tabs
//           defaultActiveKey="details"
//           items={[
//             {
//               key: 'details',
//               label: 'Task Details',
//               children: <TaskDetails task={task} />,
//             },
//             {
//               key: 'subtasks',
//               label: `Subtasks (${task.subtasks?.length ?? 0})`,
//               children: <SubtasksTab task={task} />,
//             },
//             {
//               key: 'attachments',
//               label: 'Attachments',
//               children: <AttachmentsTab task={task} />,
//             },
//             {
//               key: 'comments',
//               label: 'Comments',
//               children: <CommentsTab task={task} />,
//             },
//           ]}
//         />
//       )}
//     </Modal>
//   );
// }

export default function TaskDrawer({ taskId, onClose }: TaskModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;

    async function loadTask() {
      try {
        setLoading(true);
        const data = await getTaskById(taskId);
        if (!cancelled) setTask(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTask();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const closeModal = () => {
    searchParams.delete('taskId');
    setSearchParams(searchParams);
    onClose();
  };

  return (
    <Modal
      open={!!taskId}
      onCancel={closeModal}
      footer={null}
      centered={!isMobile}
      width={isMobile ? '100%' : 900}
      style={isMobile ? { top: 0, paddingBottom: 0 } : undefined}
      styles={{
        padding: isMobile ? 6 : 24,
        height: 'auto',
        // overflowY: 'auto',
      }}
      destroyOnHidden
      title={
        <div className="flex flex-wrap items-center gap-2">
          <Tag color="blue">{task?.key}</Tag>
          <span className="font-semibold break-all">{task?.title}</span>
        </div>
      }
    >
      {loading && (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      )}

      {!loading && task && (
        <Tabs
          defaultActiveKey="details"
          tabPlacement="top"
          centered={!isMobile}
          items={[
            {
              key: 'details',
              label: 'Details',
              children: (
                <TaskDetails
                  task={task}
                  isMobile={isMobile}
                  onUpdated={setTask}
                />
              ),
            },
            {
              key: 'subtasks',
              label: `Subtasks (${task.subTask?.length ?? 0})`,
              children: <SubtasksTab task={task} />,
            },
            {
              key: 'attachments',
              label: 'Attachments',
              children: <AttachmentsTab />,
            },
            {
              key: 'comments',
              label: 'Comments',
              children: <CommentsTab />,
            },
          ]}
        />
      )}
    </Modal>
  );
}
