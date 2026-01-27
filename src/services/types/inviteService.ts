import axios from 'axios';
import { config } from '../../config/config';
import type { IResponse } from './common';
import { attachInterceptor } from '../../utils/attachInterceptor';

const API_URL = `${config.api_base_url}/invite/join`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

export async function acceptInvite(token: string): Promise<IResponse> {
  const response = await api.get<IResponse>(`/?token=${token}`);
  return response.data;
}
