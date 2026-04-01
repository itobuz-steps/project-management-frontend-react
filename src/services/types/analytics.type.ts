export interface ProjectAnalytics {
  statusOverview: { status: string; count: number }[];
  priorityBreakdown: { priority: string; count: number }[];
  typesOfWork: { type: string; count: number }[];
  teamWorkload: {
    userId: string;
    name: string;
    profileImage?: string;
    count: number;
  }[];
  epicProgress: {
    epicId: string;
    title: string;
    key: string;
    epicStatus: string;
    total: number;
    breakdown: Record<string, number>;
  }[];
  recentActivity: {
    _id: string;
    action: string;
    projectName?: string;
    updatedFields?: Record<string, { from: string; to: string }>;
    createdAt: string;
    byUser: { _id: string; name: string; profileImage?: string };
  }[];
}
