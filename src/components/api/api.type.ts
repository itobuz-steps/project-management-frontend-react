import type { Method } from 'axios';

export type FetchWithAuthOptions = {
  method?: Method;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  headers?: Record<string, string>;
};
