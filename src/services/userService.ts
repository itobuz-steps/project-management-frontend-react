import axios from 'axios';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';
import type { IResponse } from './types/common';
import type { IUserResponse } from './types/user';

const API_URL = `${config.api_base_url}/auth`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

async function updateUserProfile(
  username: string,
  profileImage: File | null
): Promise<IResponse> {
  const formData = new FormData();
  formData.append('name', username);

  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  const response = await api.patch<IResponse>('/profile', formData);

  return response.data;
}

async function getUserInfo(): Promise<IUserResponse> {
  const response = await api.get<IUserResponse>('/profile');

  return response.data;
}

export default {
  updateUserProfile,
  getUserInfo,
};
