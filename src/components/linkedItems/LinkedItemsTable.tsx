import { Table, Tag, Button } from 'antd';
import { Trash2 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type {
  LinkedItemsTableProps,
  LinkedRow,
  StatusCellProps,
} from './linkedItems.types';
import { RELATIONSHIP_CONFIG } from './linkedItems.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { StatusSelect } from '../ui/StatusSelect';
import { useTaskUpdate } from '../../hooks/useTaskUpdate';

function StatusCell({ row, projectColumns, onStatusChange }: StatusCellProps) {
  const { update } = useTaskUpdate(row.item._id, (updatedTask) => {
    onStatusChange({
      ...row.item,
      status: updatedTask.status,
    });
  });

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <StatusSelect
        value={row.item.status}
        columns={projectColumns}
        onChange={(status) => update({ status }, 'Failed to update status')}
      />
    </div>
  );
}

export function LinkedItemsTable({
  rows,
  projectColumns,
  onRemove,
  onChange,
}: LinkedItemsTableProps) {
  const columns: ColumnsType<LinkedRow> = [
    {
      title: 'Type',
      width: 60,
      render: (_, row) => <TaskTypeIcon type={row.item.type} />,
    },
    {
      title: 'Key',
      width: 90,
      render: (_, row) => <Tag color="blue">{row.item.key}</Tag>,
    },
    {
      title: 'Summary',
      render: (_, row) => row.item.title,
    },
    {
      title: 'Relationship',
      width: 140,
      render: (_, row) => <Tag>{RELATIONSHIP_CONFIG[row.type].label}</Tag>,
    },
    {
      title: 'Status',
      width: 150,
      render: (_, row) => (
        <StatusCell
          row={row}
          projectColumns={projectColumns}
          onStatusChange={onChange}
        />
      ),
    },
    {
      title: '',
      width: 60,
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

  if (!rows.length) {
    return null;
  }

  return (
    <Table
      dataSource={rows}
      columns={columns}
      rowKey={(row) => `${row.type}-${row.item._id}`}
      pagination={false}
      size="small"
    />
  );
}
