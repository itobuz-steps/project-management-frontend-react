import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Input, Select, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DateTime } from 'luxon';
import { DataLoader } from '../components/ui/DataLoader';
import { getProjectAuditLogs } from '../services/auditLogService';
import type { AuditLogEntry } from '../services/types/auditLog.types';
import { UserCell } from '../components/ui/UserCell';
import { useTheme } from '../hooks/useTheme';
import { THEME_COLORS } from '../config/constants';

const ALL_FILTER_VALUE = 'all';

const ACTION_COLORS: Record<string, string> = {
  TASK_CREATED: 'green',
  TASK_UPDATED: 'blue',
  STATUS_CHANGED: 'geekblue',
  ASSIGNEE_CHANGED: 'cyan',
  COMMENT_ADDED: 'purple',
  TASK_DELETED: 'red',
  PROJECT_UPDATED: 'gold',
  MEMBER_INVITED: 'magenta',
  MEMBER_ADDED: 'violet',
  MEMBER_REMOVED: 'yellow',
  MEMBER_ROLE_CHANGED: 'volcano',
  SPRINT_CREATED: 'lime',
};

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
        <span className="bg-green-100 px-0.5 font-medium text-gray-800 dark:text-slate-200">
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
  const memberChange = entry.changes?.find((c) => c.field === 'member');

  if (entry.action === 'MEMBER_ADDED' && memberChange?.to) {
    return (
      <span>
        Member <ChangeValue to={memberChange.to} /> added
      </span>
    );
  }

  if (entry.action === 'MEMBER_REMOVED' && memberChange?.to) {
    return (
      <span>
        Member <ChangeValue to={memberChange.to} /> removed
      </span>
    );
  }

  if (
    entry.action === 'ROLE_CHANGED' &&
    memberChange?.from &&
    memberChange?.to
  ) {
    return (
      <span>
        Role <ChangeValue from={memberChange.from} to={memberChange.to} />
      </span>
    );
  }

  if (!entry.changes?.length) return <span className="text-gray-400">—</span>;

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

const includesIgnoreCase = (value: string, search: string) =>
  value.toLowerCase().includes(search);

const matchesFilters = (
  entry: AuditLogEntry,
  userFilter: string,
  normalizedSearch: string
) => {
  const matchesUser =
    userFilter === ALL_FILTER_VALUE || entry.actor.name === userFilter;

  if (!normalizedSearch) {
    return matchesUser;
  }

  const matchesSearch =
    includesIgnoreCase(entry.message, normalizedSearch) ||
    includesIgnoreCase(entry.entityLabel, normalizedSearch) ||
    includesIgnoreCase(entry.actor.name, normalizedSearch);

  return matchesUser && matchesSearch;
};

function AuditLogsPage() {
  const { projectId } = useParams();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userFilter, setUserFilter] = useState<string>(ALL_FILTER_VALUE);

  const [theme] = useTheme();
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const loadLogs = async () => {
      try {
        setLoading(true);
        const result = await getProjectAuditLogs(projectId);
        setLogs(result);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [projectId]);

  const userOptions = useMemo(() => {
    const uniqueActors = Array.from(
      new Set(logs.map((entry) => entry.actor.name))
    );

    return [
      { label: 'All users', value: ALL_FILTER_VALUE },
      ...uniqueActors.map((name) => ({ label: name, value: name })),
    ];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return logs.filter((entry) =>
      matchesFilters(entry, userFilter, normalizedSearch)
    );
  }, [logs, userFilter, searchText]);

  const columns: ColumnsType<AuditLogEntry> = useMemo(
    () => [
      {
        title: 'When',
        key: 'createdAt',
        sorter: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        defaultSortOrder: 'descend',
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
            <Tag
              style={{
                backgroundColor: border,
                color: primary,
              }}
            >
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
    []
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
        <div>
          <Typography.Title level={4} className="mb-1!">
            Project Audits
          </Typography.Title>
          <Typography.Text type="secondary">
            Track key project events and permission-sensitive changes.
          </Typography.Text>
        </div>
      </div>

      <div className="mb-4 grid gap-2 md:grid-cols-2">
        <Input.Search
          allowClear
          placeholder="Search by user, entity, or message"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <Select
          value={userFilter}
          options={userOptions}
          onChange={(value) => setUserFilter(value)}
        />
      </div>

      <DataLoader
        loading={loading}
        isEmpty={!loading && filteredLogs.length === 0}
        emptyText="No audit logs match your filters"
      >
        <Table<AuditLogEntry>
          rowKey="id"
          columns={columns}
          dataSource={filteredLogs}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 'max-content' }}
        />
      </DataLoader>
    </Card>
  );
}

export default AuditLogsPage;
