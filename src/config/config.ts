interface Config {
  api_base_url: string;
  vapid_public_key: string;
}

export const config: Config = {
  api_base_url: import.meta.env.VITE_API_BASE_URL,
  vapid_public_key: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
};
