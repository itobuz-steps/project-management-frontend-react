import { useCallback, useMemo, useState } from 'react';
import type { CSSProperties, HTMLAttributes, Key, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import { getPriorityBorder } from '../../../utils/utils';
import { useTaskTableColumns } from './useTaskTableColumns';
import {
  asSingleFilter,
  asMultiFilter,
  DEFAULT_STATUSES,
} from './taskTable.utils';
import type { TaskTableProps } from './taskTable.types';
import { GripVertical } from 'lucide-react';

export type {
  TaskTableFilters,
  TaskTableSort,
  TaskTableSortOrder,
  TaskTableChangeParams,
} from './taskTable.types';

const COLUMN_STORAGE_PREFIX = 'task-table-new-column-order';

type DraggableHeaderCellProps = HTMLAttributes<HTMLTableCellElement> & {
  children?: ReactNode;
  'data-column-key'?: string;
  'data-drop-side'?: 'left' | 'right' | '';
};

function DraggableHeaderCell({
  children,
  style,
  'data-column-key': columnKey,
  'data-drop-side': dropSide,
  className,
  ...restProps
}: DraggableHeaderCellProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnKey ?? '__task_table_header_placeholder__',
    disabled: !columnKey,
  });

  if (!columnKey) {
    return (
      <th style={style} className={className} {...restProps}>
        {children}
      </th>
    );
  }

  const dragStyle: CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 2 } : {}),
  };

  return (
    <th
      ref={setNodeRef}
      style={dragStyle}
      className={`${className ?? ''} ${dropSide ? `task-table-drop-target-${dropSide}` : ''}`.trim()}
      {...restProps}
    >
      <div className="task-table-header-cell-wrap">
        <span
          className="task-table-column-drag-handle"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </span>
        <span className="task-table-header-content">{children}</span>
      </div>
    </th>
  );
}

const getColumnKey = (column: { key?: Key | null }): string =>
  String(column.key ?? '');

const readStoredColumnOrder = (storageKey: string): string[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => String(item)).filter(Boolean);
  } catch {
    return [];
  }
};

const normalizeColumnOrder = (order: string[], availableKeys: string[]) => {
  const normalized = order.filter((key) => availableKeys.includes(key));
  const missing = availableKeys.filter((key) => !normalized.includes(key));
  return [...normalized, ...missing];
};

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
  const { projectId } = useParams();
  const statuses = useMemo(
    () => (statusColumns.length ? statusColumns : DEFAULT_STATUSES),
    [statusColumns]
  );

  const [sessionOrderByStorageKey, setSessionOrderByStorageKey] = useState<
    Record<string, string[]>
  >({});
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    key: string;
    side: 'left' | 'right';
  } | null>(null);

  const columnStorageKey = useMemo(
    () => `${COLUMN_STORAGE_PREFIX}:${projectId ?? 'global'}`,
    [projectId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  const columns = useTaskTableColumns({
    tasks,
    statuses,
    members,
    loadingMembers,
    filters,
    sorting,
    onTaskUpdated,
  });

  const columnKeys = useMemo(
    () => columns.map((column) => getColumnKey(column)).filter(Boolean),
    [columns]
  );

  const persistedColumnOrder = useMemo(
    () => readStoredColumnOrder(columnStorageKey),
    [columnStorageKey]
  );

  const activeColumnOrder = useMemo(() => {
    const inMemoryOrder = sessionOrderByStorageKey[columnStorageKey];
    const sourceOrder = inMemoryOrder ?? persistedColumnOrder;
    return normalizeColumnOrder(sourceOrder, columnKeys);
  }, [
    columnKeys,
    columnStorageKey,
    persistedColumnOrder,
    sessionOrderByStorageKey,
  ]);

  const onHeaderDragStart = useCallback((event: DragStartEvent) => {
    setActiveColumnId(String(event.active.id));
  }, []);

  const onHeaderDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) {
        setDropTarget(null);
        return;
      }

      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) {
        setDropTarget(null);
        return;
      }

      const activeIndex = activeColumnOrder.indexOf(activeId);
      const overIndex = activeColumnOrder.indexOf(overId);
      if (activeIndex < 0 || overIndex < 0) {
        setDropTarget(null);
        return;
      }

      setDropTarget({
        key: overId,
        side: activeIndex < overIndex ? 'right' : 'left',
      });
    },
    [activeColumnOrder]
  );

  const onHeaderDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveColumnId(null);
      setDropTarget(null);
      if (!over || active.id === over.id) {
        return;
      }

      setSessionOrderByStorageKey((prev) => {
        const currentOrder = normalizeColumnOrder(
          prev[columnStorageKey] ?? persistedColumnOrder,
          columnKeys
        );
        const activeIndex = currentOrder.indexOf(String(active.id));
        const overIndex = currentOrder.indexOf(String(over.id));
        if (activeIndex < 0 || overIndex < 0) {
          return prev;
        }

        const nextOrder = arrayMove(currentOrder, activeIndex, overIndex);
        localStorage.setItem(columnStorageKey, JSON.stringify(nextOrder));

        return {
          ...prev,
          [columnStorageKey]: nextOrder,
        };
      });
    },
    [columnKeys, columnStorageKey, persistedColumnOrder]
  );

  const onHeaderDragCancel = useCallback(() => {
    setActiveColumnId(null);
    setDropTarget(null);
  }, []);

  const orderedColumns = useMemo(() => {
    const columnMap = new Map(
      columns.map((column) => [getColumnKey(column), column])
    );

    return activeColumnOrder
      .map((key) => columnMap.get(key))
      .filter((column): column is (typeof columns)[number] => Boolean(column));
  }, [activeColumnOrder, columns]);

  const draggableColumns = useMemo(
    () =>
      orderedColumns.map((column) => {
        const key = getColumnKey(column);
        const currentOnHeaderCell = column.onHeaderCell;

        return {
          ...column,
          onHeaderCell: (nextColumn: unknown) => ({
            ...(currentOnHeaderCell
              ? currentOnHeaderCell(
                  nextColumn as Parameters<
                    NonNullable<typeof currentOnHeaderCell>
                  >[0]
                )
              : {}),
            'data-column-key': key,
            'data-drop-side':
              activeColumnId && dropTarget?.key === key ? dropTarget.side : '',
          }),
        };
      }),
    [activeColumnId, dropTarget, orderedColumns]
  );

  const tableComponents = useMemo(
    () => ({
      header: {
        cell: DraggableHeaderCell,
      },
    }),
    []
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onHeaderDragStart}
      onDragOver={onHeaderDragOver}
      onDragEnd={onHeaderDragEnd}
      onDragCancel={onHeaderDragCancel}
    >
      <SortableContext
        items={activeColumnOrder}
        strategy={horizontalListSortingStrategy}
      >
        <Table<TaskPopulated>
          rowKey="_id"
          className="list-view-task-table"
          columns={draggableColumns}
          components={tableComponents}
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
      </SortableContext>
    </DndContext>
  );
}

export default TaskTable;
