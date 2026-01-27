import { fetchWithAuth } from '../components/api/interceptor';
import type { Task } from '../types/tasks.types';

interface TaskResponse {
  result: Task;
}

class TaskService {
  async getTaskById(taskId: string): Promise<Task> {
    const res = await fetchWithAuth<TaskResponse>(`/tasks/${taskId}`, {
      method: 'GET',
    });

    return res.result;
  }
}

export default new TaskService();
