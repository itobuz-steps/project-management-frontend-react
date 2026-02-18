import { Table } from 'antd';
import type { SubtasksTableProps } from './subtask.types';
import { DataState } from '../ui/DataState';

export function SubtasksTable({
  loading,
  subtasks,
  columns,
}: SubtasksTableProps) {
  return (
    <DataState
      loading={loading}
      isEmpty={!subtasks.length}
      emptyText="No subtasks"
    >
      <div className="rounded-lg border border-gray-200">
        <Table
          className="subtasks-table"
          columns={columns}
          dataSource={subtasks}
          rowKey="_id"
          size="small"
          pagination={false}
          scroll={{ x: 600 }}
          styles={{ content: { padding: 0 } }}
        />
      </div>
    </DataState>
  );
}
