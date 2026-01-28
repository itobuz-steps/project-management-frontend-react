import axios from 'axios';
import { config } from '../config/config';
import type {
  Comment,
  UpdateCommentPayload,
} from '../services/types/comments.types';
import { attachInterceptor } from '../utils/attachInterceptor';

const API_URL = `${config.api_base_url}/comments`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

class CommentsApi {
  async getAllComments(taskId?: string): Promise<{ result: Comment[] }> {
    try {
      const response = await api.get<{ result: Comment[] }>('/', {
        params: { taskId },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  async createComment(formData: FormData): Promise<Comment> {
    const response = await api.post('/', formData);
    return response.data.result;
  }

  async updateComment(
    id: string,
    payload: UpdateCommentPayload
  ): Promise<Comment> {
    const response = await api.put(`/${id}`, payload);
    return response.data.result;
  }

  async deleteComment(id: string): Promise<void> {
    await api.delete(`/${id}`);
  }
}

export const commentsApi = new CommentsApi();
