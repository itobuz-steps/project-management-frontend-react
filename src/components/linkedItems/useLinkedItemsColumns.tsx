import { Tag, Button } from 'antd';
import { Trash2 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { LinkColumnsProps, LinkedRow } from './linkedItems.types';
import { RELATIONSHIP_CONFIG } from './linkedItems.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { StatusCell } from '../ui/StatusCell';
import { Link } from 'react-router-dom';

export const useLinkedItemsColumns = ({
  projectColumns,
  onRemove,
  onChange,
}: LinkColumnsProps): ColumnsType<LinkedRow> => {
  return [
    {
      width: 100,
      render: (_, row) => <Tag>{RELATIONSHIP_CONFIG[row.type].label}</Tag>,
    },
    {
      render: (_, row) => {
        const isDone =
          row.item.status === projectColumns[projectColumns.length - 1];
        return (
          <div className="flex items-center gap-3">
            <TaskTypeIcon type={row.item.type} />

            <Tag color="blue" className="w-fit">
              {row.item.key}
            </Tag>

            <Link
              to={`?taskId=${row.item._id}`}
              className={`block max-w-[200px] truncate hover:underline! ${isDone ? 'text-gray-400! line-through!' : 'text-gray-800!'} `}
            >
              {row.item.title}
            </Link>
          </div>
        );
      },
    },
    {
      width: 100,
      render: (_, row) => (
        <StatusCell
          row={row}
          projectColumns={projectColumns}
          onStatusChange={onChange}
        />
      ),
    },
    {
      width: 50,
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            danger
            onClick={() => onRemove(row.type, row.item._id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];
};
