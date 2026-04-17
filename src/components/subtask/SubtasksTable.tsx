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
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
        <Table
          className="subtasks-table min-w-175"
          tableLayout="fixed"
          columns={columns}
          dataSource={subtasks}
          rowKey="_id"
          size="small"
          pagination={false}
          scroll={{ x: true }}
          styles={{ content: { padding: 0 } }}
        />
      </div>
    </DataLoader>
  );
}
