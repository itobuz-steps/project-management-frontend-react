import type { RecentTask } from '../types/recent-tasks';

const STORAGE_KEY = 'recent_tasks';
const MAX_RECENTS = 7;

export function getRecentTasks(): RecentTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentTask(task: RecentTask) {
  const existing = getRecentTasks();

  const next = [task, ...existing.filter((t) => t._id !== task._id)].slice(
    0,
    MAX_RECENTS
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
