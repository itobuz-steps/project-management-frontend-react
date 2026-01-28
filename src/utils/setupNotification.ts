import notificationService from '../services/notificationService';
import userService from '../services/userService';

const PUBLIC_VAPID_KEY =
  'BBxyBixxdLHGQaKCZSYguTcuFmIW9tyQQnMKOsZcQxgwjBFsHRWbSXMK2aiqQqOWkCriNtu6mDnRljyFzss8kOU';

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export async function setupPushNotifications(): Promise<PushSubscription | void> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return;
  }

  try {
    const registration =
      await navigator.serviceWorker.register('/service-worker.js');

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return;
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          PUBLIC_VAPID_KEY
        ) as BufferSource,
      });
    }

    const res = await userService.getUserInfo();
    const email = res.result.email;

    if (!email) {
      return;
    }

    await notificationService.subscribeToPushNotifications(subscription, email);

    return subscription;
  } catch (err) {
    console.error('Push setup failed:', err);
  }
}
