interface IResponse {
  success: boolean;
  message?: string;
}

interface ILoginResponse extends IResponse {
  accessToken: string;
  refreshToken: string;
}

export type { IResponse, ILoginResponse };
