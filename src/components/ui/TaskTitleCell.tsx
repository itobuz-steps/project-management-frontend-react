import { useSearchParams } from 'react-router-dom';
import type { TaskTitleCellType } from './ui.types';

export function TaskTitleCell({ title, taskId }: TaskTitleCellType) {
  const [, setSearchParams] = useSearchParams();

  return (
    <td
      className="cursor-pointer p-3 px-6 whitespace-nowrap hover:underline"
      onClick={() => setSearchParams({ taskId }, { replace: true })}
    >
      {title}
    </td>
  );
}
