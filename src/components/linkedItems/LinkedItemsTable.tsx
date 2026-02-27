import { Table } from 'antd';
import type { LinkedItemsTableProps } from './linkedItems.types';
import { useLinkedItemsColumns } from './useLinkedItemsColumns';

export function LinkedItemsTable({
  rows,
  projectColumns,
  onRemove,
  onChange,
}: LinkedItemsTableProps) {
  const columns = useLinkedItemsColumns({
    projectColumns,
    onRemove,
    onChange,
  });

  if (!rows.length) {
    return null;
  }

  return (
    <div className="rounded-sm border border-gray-200">
      <Table
        dataSource={rows}
        columns={columns}
        rowKey={(row) => `${row.type}-${row.item._id}`}
        pagination={false}
        size="small"
        scroll={{ x: 300 }}
        showHeader={false}
        styles={{ content: { padding: 0 } }}
      />
    </div>
  );
}
