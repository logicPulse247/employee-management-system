import { IUser } from '../models/User';
import DataLoader from 'dataloader';
import { IEmployee } from '../models/Employee';
import { Types } from 'mongoose';

// Context Types
export interface Context {
  user: IUser | null;
  token: string | null;
  loaders: {
    employee: DataLoader<Types.ObjectId, IEmployee | null>;
  };
}

// Employee Filter Types
export interface EmployeeFilters {
  name?: string;
  class?: string;
  department?: string;
  minAge?: number;
  maxAge?: number;
  minAttendance?: number;
  maxAttendance?: number;
}

// Sort Input Types
export interface SortInput {
  field: string;
  order: 'ASC' | 'DESC';
}

// Pagination Types
export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Employee Query Args
export interface EmployeeQueryArgs {
  filters?: EmployeeFilters;
  page?: number;
  pageSize?: number;
  sort?: SortInput;
}

// Employee Response
export interface EmployeeResponse {
  employees: Array<Record<string, unknown> & { id: string }>;
  pagination: PaginationInfo;
}

// Auth Response
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Token Payload
export interface TokenPayload {
  userId: string;
  role: string;
  username: string;
}
