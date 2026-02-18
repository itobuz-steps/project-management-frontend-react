import { Link } from 'react-router-dom';
import { TaskTypeColor } from '../../utils/TaskTypeColor';
import type { TaskKeyCellType } from './ui.types';

export function TaskKeyCell({ taskId, type, taskKey }: TaskKeyCellType) {
  return (
    <td>
      <Link
        to={`/task/${taskId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-2 font-medium whitespace-nowrap text-white hover:underline"
      >
        <TaskTypeColor type={type}>{taskKey}</TaskTypeColor>
      </Link>
    </td>
  );
}
