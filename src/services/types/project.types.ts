import type { Project } from '../../types/project.types';
import type { User } from './tasks.types';

export interface ProjectResponse {
  result: Project;
  success: boolean;
}

export interface MemberResponse {
  result: User[];
  success: boolean;
}
