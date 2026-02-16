interface Config {
  api_base_url: string;
  vapid_public_key: string;
}

if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined in environment variables');
}

if (!import.meta.env.VITE_VAPID_PUBLIC_KEY) {
  console.warn('VITE_VAPID_PUBLIC_KEY is not defined in environment variables');
}

export const config: Config = {
  api_base_url: import.meta.env.VITE_API_BASE_URL,
  vapid_public_key: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
};
