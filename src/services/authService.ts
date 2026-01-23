import axios from 'axios';
import { config } from '../config/config';
import type { ILoginResponse, IResponse } from './types/auth';

const API_URL = `${config.api_base_url}/auth`;

const api = axios.create({
  baseURL: API_URL,
});

async function signup(name: string, email: string, password: string) {
  const response = await api.post<IResponse>('/signup', {
    name,
    email,
    password,
  });
  return response.data;
}

async function login(email: string, password: string) {
  const response = await api.post<ILoginResponse>('/login', {
    email,
    password,
  });
  return response.data;
}

export async function sendOtp(email: string) {
  const response = await api.post<IResponse>('/send-otp', { email });
  return response.data;
}

export async function verify(email: string, otp: string) {
  const response = await api.post<IResponse>('/verify', { email, otp });
  return response.data;
}

export async function forgotPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  const response = await api.post<IResponse>('/forgot-password', {
    email,
    otp,
    newPassword,
  });
  return response.data;
}

export default {
  signup,
  login,
  sendOtp,
  verify,
  forgotPassword,
};
