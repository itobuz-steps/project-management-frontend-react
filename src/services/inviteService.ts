import axios from 'axios';
import { config } from '../config/config';
import type { IResponse } from './types/common';
import { attachInterceptor } from '../utils/attachInterceptor';

const API_URL = `${config.api_base_url}/projects/invites`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

export async function sendInvite(
  email: string,
  projectId: string
): Promise<IResponse> {
  const response = await api.post<IResponse>('/send', {
    email,
    projectId,
  });
  return response.data;
}

export async function acceptInvite(token: string): Promise<IResponse> {
  const response = await api.get<IResponse>(`/accept?token=${token}`);
  return response.data;
}
