import { Button, Tag } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { TaskPopulated } from '../../services/types/tasks.types';

export function TaskDrawerHeader({
  task,
  projectId,
}: {
  task: TaskPopulated;
  projectId: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        <Tag color="blue">{task.key}</Tag>
        <h1 className="text-xl font-semibold">{task.title}</h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <Tag color="blue">{task.status}</Tag>

        <Button
          type="text"
          icon={<ExportOutlined />}
          href={`/projects/${projectId}/tasks/${task._id}`}
          target="_blank"
        />
      </div>
    </div>
  );
}
