export type LoginPayload = {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    _id: string;
    email: string;
  };
  message?: string;
};

export type SignupPayload = {
  message?: string;
  user?: {
    _id: string;
    username: string;
    email: string;
  };
};

export type VerifyOtpPayload = {
  message?: string;
  user?: {
    _id?: string;
    email?: string;
  };
};

export type SendOtpPayload = {
  message?: string;
  error?: string;
};
