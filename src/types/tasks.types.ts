export interface Task {
  _id: string;

  //   projectId:
  //     | {
  //         _id: string;
  //         name?: string;
  //       }
  //     | string;

  title: string;
  storyPoint: number;
  description: string;
  type: string;
  key?: string;
  status: string;
  priority: string;
  dueDate: string;
  reporter?: User;

  parentTask?: string;
  assignee?: User;
  subtasks?: SubTask[];
  labels?: string[];

  tags: string[];

  attachments?: FileList | File[];

  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

export type SubTask = {
  _id?: string;
  title: string;
  isCompleted: boolean;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
};
