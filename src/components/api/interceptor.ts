import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { api } from './axios';
import { config } from '../../config/config';
import type { FetchWithAuthOptions } from './api.type';

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.get<RefreshTokenResponse>(
          `${config.api_base_url}/auth/refresh-token`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.log(err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export async function fetchWithAuth<T>(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<T> {
  const { method = 'GET', params, data, headers } = options;

  const config: AxiosRequestConfig = {
    url,
    method,
    params,
    data,
    headers,
  };

  const response = await api.request<T>(config);
  return response.data;
}
