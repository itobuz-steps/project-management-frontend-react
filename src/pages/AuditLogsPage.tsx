import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { DateTime } from 'luxon';
import { DataLoader } from '../components/ui/DataLoader';
import {
  exportProjectAuditLogs,
  getProjectAuditLogs,
} from '../services/auditLogService';
import type { AuditLogEntry } from '../services/types/auditLog.types';
import { UserCell } from '../components/ui/UserCell';
import { useTheme } from '../hooks/useTheme';
import { THEME_COLORS } from '../config/constants';
import * as XLSX from 'xlsx';
import { FileX } from 'lucide-react';

const PAGE_SIZE = 10;

export const ChangeValue = ({
  from,
  to,
}: {
  from?: string | null;
  to?: string | null;
}) => {
  if (from && to) {
    return (
      <span className="flex flex-wrap items-center gap-1">
        <span className="bg-red-200 px-0.5 text-gray-800 line-through">
          {from}
        </span>
        <span className="text-gray-400">→</span>
        <span className="bg-green-100 px-0.5 font-medium text-gray-800">
          {to}
        </span>
      </span>
    );
  }

  return (
    <span className="font-medium text-gray-800 dark:text-slate-200">
      {to ?? from}
    </span>
  );
};

const formatWhen = (dateLike: string) => {
  const date = DateTime.fromISO(dateLike);
  return {
    relative: date.toRelative() ?? date.toLocaleString(DateTime.DATETIME_MED),
    absolute: date.toLocaleString(DateTime.DATETIME_MED),
  };
};

const describeChanges = (entry: AuditLogEntry): ReactNode => {
  if (!entry.changes?.length) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {entry.changes.map((change, i) => (
        <span key={i} className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-gray-500 capitalize">
            {change.field}:
          </span>
          <ChangeValue from={change.from} to={change.to} />
        </span>
      ))}
    </div>
  );
};

function AuditLogsPage() {
  const { projectId } = useParams();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [searchText, setSearchText] = useState('');
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [actionFilter, setActionFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const [allActors, setAllActors] = useState<{ id: string; name: string }[]>(
    []
  );
  const [allActions, setAllActions] = useState<string[]>([]);

  const [theme] = useTheme();
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!projectId) return;
    try {
      setExporting(true);

      const all = await exportProjectAuditLogs(projectId, {
        search: searchText.trim() || undefined,
        byUsers: userFilter.length ? userFilter : undefined,
        actions: actionFilter.length ? actionFilter : undefined,
        dateFrom: dateRange[0]?.toISOString() ?? undefined,
        dateTo: dateRange[1]?.toISOString() ?? undefined,
      });

      const rows = all.map((entry) => ({
        When: DateTime.fromISO(entry.createdAt).toLocaleString(
          DateTime.DATETIME_MED
        ),
        'Performed By': entry.actor.name,
        Action: entry.action.split('_').join(' '),
        Details:
          entry.changes
            ?.map(({ field, from, to }) =>
              from && to
                ? `${field}: ${from} → ${to}`
                : `${field}: ${to ?? from}`
            )
            .join('; ') ?? '—',
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Logs');
      XLSX.writeFile(workbook, `audit-logs-${projectId}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    const loadOptions = async () => {
      const result = await getProjectAuditLogs(projectId, { limit: 500 });
      const actors = Array.from(
        new Map(
          result.activities.map((e) => [
            e.actor.id,
            { id: e.actor.id, name: e.actor.name },
          ])
        ).values()
      );
      const actions = Array.from(
        new Set(result.activities.map((e) => e.action))
      );
      setAllActors(actors);
      setAllActions(actions);
    };

    loadOptions();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const loadLogs = async () => {
      try {
        setLoading(true);
        const result = await getProjectAuditLogs(projectId, {
          page,
          limit: PAGE_SIZE,
          search: searchText.trim() || undefined,
          byUsers: userFilter.length ? userFilter : undefined,
          actions: actionFilter.length ? actionFilter : undefined,
          dateFrom: dateRange[0]?.toISOString() ?? undefined,
          dateTo: dateRange[1]?.toISOString() ?? undefined,
        });
        setLogs(result.activities);
        setTotal(result.total);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [projectId, page, searchText, userFilter, actionFilter, dateRange]);

  useEffect(() => {
    setPage(1);
  }, [searchText, userFilter, actionFilter, dateRange]);

  const userOptions = useMemo(
    () => allActors.map(({ id, name }) => ({ label: name, value: id })),
    [allActors]
  );

  const actionOptions = useMemo(
    () =>
      allActions.map((action) => ({
        label: action.split('_').join(' '),
        value: action,
      })),
    [allActions]
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current);
  };

  const columns: ColumnsType<AuditLogEntry> = useMemo(
    () => [
      {
        title: 'When',
        key: 'createdAt',
        render: (_, entry) => {
          const when = formatWhen(entry.createdAt);
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{when.relative}</span>
              <span className="text-xs text-slate-500">{when.absolute}</span>
            </div>
          );
        },
      },
      {
        title: 'Performed By',
        key: 'actor',
        render: (_, entry) => (
          <UserCell
            user={{
              _id: entry.actor.id,
              name: entry.actor.name,
              profileImage: entry.actor.profileImage,
              email: '',
              notificationPreferences: { email: true, push: true, inApp: true },
              role: 'member',
            }}
            emptyText="Unknown user"
          />
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, entry) => {
          const action = entry.action.split('_').join(' ');
          const primary = themeColors[5];
          const border = themeColors[1];

          return (
            <Tag style={{ backgroundColor: border, color: primary }}>
              {action}
            </Tag>
          );
        },
      },
      {
        title: 'Details',
        key: 'details',
        render: (_, entry) => describeChanges(entry),
      },
    ],
    [themeColors]
  );

  if (!projectId) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-slate-200">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view audit logs.
        </p>
      </div>
    );
  }

  return (
    <Card className="mt-2 border-gray-200 shadow-sm dark:border-slate-700">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <Typography.Title level={4} className="mb-1!">
              Project Audits
            </Typography.Title>
            <Button
              loading={exporting}
              onClick={handleExport}
              style={{
                color: themeColors[4],
                borderColor: themeColors[4],
              }}
            >
              <FileX className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
          <Typography.Text type="secondary">
            Track key project events and permission-sensitive changes.
          </Typography.Text>
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Input.Search
          allowClear
          placeholder="Search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <Select
          mode="multiple"
          allowClear
          placeholder="Filter by user"
          value={userFilter}
          options={userOptions}
          onChange={(values) => setUserFilter(values)}
          maxTagCount="responsive"
        />
        <Select
          mode="multiple"
          allowClear
          placeholder="Filter by action"
          value={actionFilter}
          options={actionOptions}
          onChange={(values) => setActionFilter(values)}
          maxTagCount="responsive"
        />
        <DatePicker.RangePicker
          className="w-full"
          value={dateRange}
          onChange={(range) => setDateRange(range ?? [null, null])}
        />
      </div>

      <DataLoader
        loading={loading}
        isEmpty={!loading && logs.length === 0}
        emptyText="No audit logs match your filters"
      >
        <Table<AuditLogEntry>
          rowKey="id"
          columns={columns}
          dataSource={logs}
          onChange={handleTableChange}
          loading={loading}
          showSorterTooltip={{ target: 'sorter-icon' }}
          size="small"
          pagination={{
            placement: ['bottomCenter'],
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
          }}
          rowClassName={() =>
            'whitespace-nowrap text-sm hover:bg-gray-50 dark:hover:bg-slate-800'
          }
          locale={{
            emptyText: 'No audit logs match your filters',
          }}
          scroll={{ x: 'max-content' }}
        />
      </DataLoader>
    </Card>
  );
}

export default AuditLogsPage;
