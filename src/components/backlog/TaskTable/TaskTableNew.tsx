import { useMemo } from 'react';
import { ConfigProvider, Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import { THEME_COLORS } from '../../../config/constants';
import { getPriorityBorder } from '../../../utils/utils';
import { useTheme } from '../../../hooks/useTheme';
import { oklchToHex } from '../../../utils/oklchToHex';
import { useTaskTableColumns } from './useTaskTableColumns';
import {
  asSingleFilter,
  asMultiFilter,
  DEFAULT_STATUSES,
} from './taskTable.utils';
import type { TaskTableProps } from './taskTable.types';

export type {
  TaskTableFilters,
  TaskTableSort,
  TaskTableSortOrder,
  TaskTableChangeParams,
} from './taskTable.types';

export function TaskTable({
  tasks,
  statusColumns,
  members,
  loadingMembers,
  onTaskUpdated,
  pagination,
  filters,
  sorting,
  onTableChange,
  loading = false,
  error = null,
}: TaskTableProps) {
  const statuses = useMemo(
    () => (statusColumns.length ? statusColumns : DEFAULT_STATUSES),
    [statusColumns]
  );
  const [theme] = useTheme();

  const columns = useTaskTableColumns({
    tasks,
    statuses,
    members,
    loadingMembers,
    filters,
    sorting,
    onTaskUpdated,
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: oklchToHex(THEME_COLORS[theme ?? 'indigo'][4]),
        },
      }}
    >
      <Table<TaskPopulated>
        rowKey="_id"
        className="list-view-task-table"
        columns={columns}
        dataSource={tasks}
        loading={loading}
        showSorterTooltip={{ target: 'sorter-icon' }}
        size="small"
        onChange={(nextPagination, nextFilters, nextSorter) => {
          const sorter = Array.isArray(nextSorter)
            ? nextSorter[0]
            : (nextSorter as SorterResult<TaskPopulated>);

          onTableChange?.({
            page: nextPagination.current ?? 1,
            pageSize: nextPagination.pageSize ?? pagination?.limit ?? 10,
            filters: {
              type: asSingleFilter(nextFilters.type),
              status: asSingleFilter(nextFilters.status),
              assignee: asSingleFilter(nextFilters.assignee),
              reporter: asSingleFilter(nextFilters.reporter),
              tags: asMultiFilter(nextFilters.tags),
            },
            sorting: {
              field:
                typeof sorter?.field === 'string'
                  ? sorter.field
                  : (sorter?.columnKey as string | null),
              order: sorter?.order ?? null,
            },
          });
        }}
        pagination={{
          placement: ['bottomCenter'],
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        rowClassName={(record) =>
          `whitespace-nowrap text-sm hover:bg-gray-50 ${getPriorityBorder(record.priority)}`
        }
        locale={{
          emptyText: error ?? 'No tasks available',
        }}
      />
    </ConfigProvider>
  );
}

export default TaskTable;
