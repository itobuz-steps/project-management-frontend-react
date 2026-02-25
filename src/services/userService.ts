import axios from 'axios';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';
import type { IUserResponse } from './types/user';

const API_URL = `${config.api_base_url}/auth`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

async function updateUserProfile(data: {
  name?: string;
  profileImage?: File | null;
  push?: boolean;
  email?: boolean;
  inApp?: boolean;
}): Promise<IUserResponse> {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append('name', data.name);
  }

  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }

  if (typeof data.push === 'boolean') {
    formData.append('push', data.push.toString());
  }

  if (typeof data.email === 'boolean') {
    formData.append('email', data.email.toString());
  }

  if (typeof data.inApp === 'boolean') {
    formData.append('inApp', data.inApp.toString());
  }

  const response = await api.patch<IUserResponse>('/profile', formData);

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
