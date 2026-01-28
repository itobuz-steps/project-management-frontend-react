export interface INotification {
  _id: string;
  userId: string;
  taskId?: string;
  projectId?: string;
  title: string;
  message: string;
  profileImage?: string | null;
  unread: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface INotificationResponse {
  success: boolean;
  result: INotification[];
  pagination: IPagination;
}
