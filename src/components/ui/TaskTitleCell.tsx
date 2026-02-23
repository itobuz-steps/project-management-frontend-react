import { useSearchParams } from 'react-router-dom';
import type { TaskTitleCellType } from './ui.types';

export function TaskTitleCell({
  title,
  taskId,
  isCompleted,
}: TaskTitleCellType) {
  const [, setSearchParams] = useSearchParams();

  return (
    <td
      className={`cursor-pointer p-3 px-6 whitespace-nowrap hover:underline ${
        isCompleted ? 'text-gray-400 line-through' : ''
      }`}
      onClick={() => setSearchParams({ taskId }, { replace: true })}
    >
      {title}
    </td>
  );
}
