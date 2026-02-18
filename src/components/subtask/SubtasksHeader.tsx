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
          strokeColor={{
            '0%': '#3b82f6', // blue
            '100%': '#22c55e', // green
          }}
        />
      </div>

      <Button
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
