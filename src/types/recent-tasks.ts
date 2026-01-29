const KEY = 'recent_created_tasks';

export interface RecentTask {
  _id: string;
  key: string;
  title: string;
  projectId: string;
  createdAt: string;
}

export const getRecentCreatedTasks = (projectId: string): RecentTask[] => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];

  return JSON.parse(raw).filter((t: RecentTask) => t.projectId === projectId);
};

export const addRecentCreatedTask = (task: RecentTask) => {
  const raw = localStorage.getItem(KEY);
  const existing: RecentTask[] = raw ? JSON.parse(raw) : [];

  const updated = [task, ...existing.filter((t) => t._id !== task._id)].slice(
    0,
    5
  ); // limit

  localStorage.setItem(KEY, JSON.stringify(updated));
};
