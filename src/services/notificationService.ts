import axios from 'axios';
import type { INotificationResponse } from '../types/notification.types';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';

const api = axios.create({
  baseURL: `${config.api_base_url}/notification`,
});

attachInterceptor(api);

async function getAllNotification(
  page: number,
  limit: number
): Promise<INotificationResponse> {
  const response = await api.get<INotificationResponse>(
    `?page=${page}&limit=${limit}`
  );

  return response.data;
}

async function subscribeToPushNotifications(
  subscription: PushSubscription,
  email: string
): Promise<void> {
  await api.post('/subscribe', {
    subscription,
    email,
  });
}

async function deleteNotification(notificationId: string): Promise<void> {
  await api.delete(`/${notificationId}`);
}

async function markAllAsRead(): Promise<void> {
  await api.post('/mark-all-as-read');
}

export default {
  getAllNotification,
  subscribeToPushNotifications,
  deleteNotification,
  markAllAsRead,
};
