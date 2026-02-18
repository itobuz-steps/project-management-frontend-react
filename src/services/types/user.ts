import type { User } from '../../services/types/tasks.types';
import type { IResponse } from './common';

interface IUserResponse extends IResponse {
  result: User;
  message?: string;
}

type Role = 'member' | 'admin' | 'superadmin';

export type { IUserResponse, Role };
