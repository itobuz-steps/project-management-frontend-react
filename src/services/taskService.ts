import { fetchWithAuth } from '../components/api/interceptor';
import type { Task } from '../types/tasks.types';

class TaskService {
  async getTaskById(taskId: string): Promise<Task> {
    return fetchWithAuth<Task>(`/tasks/${taskId}`, {
      method: 'GET',
    });
  }
}

export default new TaskService();
