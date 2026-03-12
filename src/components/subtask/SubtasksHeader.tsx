import { Button, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { SubtasksHeaderProps } from './subtask.types';

export function SubtasksHeader({
  count,
  progress,
  onAdd,
}: SubtasksHeaderProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="text-base font-bold whitespace-nowrap">
        Subtasks ({count})
      </span>

      <div className="flex-1">
        <Progress
          percent={progress}
          size="small"
          showInfo
          strokeColor="var(--color-primary-500)"
        />
      </div>

      <Button
        style={{
          border: 'var(--color-primary-500) solid 1px',
        }}
        type="text"
        size="small"
        icon={<PlusOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          onAdd(e);
        }}
      />
    </div>
  );
}
