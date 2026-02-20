import { Table } from 'antd';
import type { SubtasksTableProps } from './subtask.types';
import { DataLoader } from '../ui/DataLoader';

export function SubtasksTable({
  loading,
  subtasks,
  columns,
}: SubtasksTableProps) {
  return (
    <DataLoader
      loading={loading}
      isEmpty={!subtasks.length}
      emptyText="No subtasks"
    >
      <div className="rounded-lg border border-gray-200">
        <Table
          className="subtasks-table"
          tableLayout="fixed"
          columns={columns}
          dataSource={subtasks}
          rowKey="_id"
          size="small"
          pagination={false}
          scroll={{ x: 600 }}
          styles={{ content: { padding: 0 } }}
        />
      </div>
    </DataLoader>
  );
}
