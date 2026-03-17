export interface WorklogUser {
  _id: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

export interface Worklog {
  _id: string;
  taskId: string;
  userId: WorklogUser;
  startTime: string | Date;
  endTime?: string | Date | null;
  duration?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
