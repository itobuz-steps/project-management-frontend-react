import axios from 'axios';
import type { INotificationResponse } from '../types/notification.types';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';

const api = axios.create({
  baseURL: `${config.api_base_url}/notification/`,
});

attachInterceptor(api);

async function getAllNotification(
  id: string = '',
  page: number,
  limit: number
): Promise<INotificationResponse> {
  const response = await api.get<INotificationResponse>(
    `get/${id}?page=${page}&limit=${limit}`
  );

  return response.data;
}

async function subscribeToPushNotifications(
  subscription: PushSubscription,
  email: string
): Promise<void> {
  await api.post('subscribe', {
    subscription,
    email,
  });
}

export default { getAllNotification, subscribeToPushNotifications };
