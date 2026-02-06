import axios from 'axios';
import { config } from '../config/config';
import type {
  Comment,
  UpdateCommentPayload,
} from '../services/types/comments.types';
import { attachInterceptor } from '../utils/attachInterceptor';

const API_URL = `${config.api_base_url}/tasks`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

class CommentsApi {
  async getAllComments(taskId: string): Promise<{ result: Comment[] }> {
    try {
      const response = await api.get<{ result: Comment[] }>(
        `/${taskId}/comments`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  async createComment(taskId: string, formData: FormData): Promise<Comment> {
    const response = await api.post(`/${taskId}/comments`, formData);
    return response.data.result;
  }

  async updateComment(
    taskId: string,
    commentId: string,
    payload: UpdateCommentPayload
  ): Promise<Comment> {
    const response = await api.patch(
      `/${taskId}/comments/${commentId}`,
      payload
    );
    return response.data.result;
  }

  async deleteComment(taskId: string, commentId: string): Promise<void> {
    await api.delete(`/${taskId}/comments/${commentId}`);
  }
}

export const commentsApi = new CommentsApi();
