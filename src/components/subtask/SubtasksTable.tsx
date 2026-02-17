import { Empty, Spin, Table } from 'antd';
import type { SubtasksTableProps } from './subtask.types';

export function SubtasksTable({
  loading,
  subtasks,
  columns,
}: SubtasksTableProps) {
  if (loading) {
    return (
      <div className="py-6 text-center">
        <Spin />
      </div>
    );
  }

  if (!subtasks.length) {
    return <Empty description="No subtasks" />;
  }

  return (
    <div className="rounded-lg border border-gray-200">
      <Table
        className="subtasks-table"
        columns={columns}
        dataSource={subtasks}
        rowKey="_id"
        size="small"
        pagination={false}
        scroll={{ x: 600 }}
        styles={{
          content: { padding: 0 },
        }}
      />
    </div>
  );
}
