import type { User } from '../../services/types/tasks.types';
import type { IResponse } from './common';

interface IUserResponse extends IResponse {
  result: User;
  message?: string;
}

export type { IUserResponse };
