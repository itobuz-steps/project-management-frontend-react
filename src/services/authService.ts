import axios from 'axios';
import { config } from '../config/config';
import type { SignupPayload } from './types/auth';

const API_URL = `${config.api_base_url}/auth`;

const api = axios.create({
  baseURL: API_URL,
});

export async function signup(payload: SignupPayload) {
  const response = await api.post('/signup', payload);
  return response;
}
