import type { IResponse } from './common';

interface ILoginResponse extends IResponse {
  accessToken: string;
  refreshToken: string;
}

export type { ILoginResponse };
