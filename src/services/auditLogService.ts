import axios from 'axios';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';
import type {
  ActivityApiItem,
  AuditLogChange,
  AuditLogEntry,
  ProjectActivitiesApiResponse,
} from './types/auditLog.types';

const activityApi = axios.create({
  baseURL: config.api_base_url,
});

attachInterceptor(activityApi);

const mapChanges = (
  updatedFields?: Record<string, { from?: string; to?: string }>
): AuditLogChange[] | undefined => {
  const changes = Object.entries(updatedFields ?? {})
    .filter(([field]) => field !== 'members')
    .map(([field, value]) => ({
      field,
      from: value.from,
      to: value.to,
    }));

  return changes.length ? changes : undefined;
};

const mapActivityToAuditLog = (
  projectId: string,
  activity: ActivityApiItem
): AuditLogEntry => {
  const entityType = activity.task ? 'task' : 'project';
  const entityId = activity.task?._id ?? projectId;
  const entityLabel =
    activity.task?.key ??
    activity.task?.title ??
    activity.projectName ??
    'Project';

  return {
    id: activity._id,
    projectId,
    action: activity.action,
    entityType,
    entityId,
    entityLabel,
    actor: {
      id: activity.byUser._id,
      name: activity.byUser.name,
      profileImage: activity.byUser.profileImage,
    },
    message: activity.action.toLowerCase().replaceAll('_', ' '),
    createdAt: activity.createdAt,
    changes: mapChanges(activity.updatedFields),
  };
};

export async function getProjectAuditLogs(
  projectId: string,
  page = 1,
  limit = 100
): Promise<AuditLogEntry[]> {
  const response = await activityApi.get<ProjectActivitiesApiResponse>(
    `projects/${projectId}/activities`,
    {
      params: { page, limit },
    }
  );

  return response.data.activities.map((activity) =>
    mapActivityToAuditLog(projectId, activity)
  );
}
