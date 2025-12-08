export interface Employee {
  id: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  email: string;
  department?: string;
  position?: string;
  salary?: number;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EmployeesResponse {
  employees: Employee[];
  pagination: PaginationInfo;
}

export interface EmployeeFilters {
  name?: string;
  class?: string;
  department?: string;
  minAge?: number;
  maxAge?: number;
  minAttendance?: number;
  maxAttendance?: number;
}

export type ViewMode = 'grid' | 'tile';

export interface SortInput {
  field: string;
  order: 'ASC' | 'DESC';
}

