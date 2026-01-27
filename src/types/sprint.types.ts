export interface Sprint {
  _id: string;
  key: string;
  tasks: string[]; // array of task IDs
  isCompleted: boolean;
  storyPoint: number;
  projectId: string; // project ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  dueDate: string; // ISO date string
  __v: number;
}
