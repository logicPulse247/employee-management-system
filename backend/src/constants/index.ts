import { env } from '../config';

// JWT Configuration
export const JWT_EXPIRES_IN: string = env.JWT_EXPIRES_IN;

// Default Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

// Default Sort
export const DEFAULT_SORT_FIELD = 'createdAt';
export const DEFAULT_SORT_ORDER = 'DESC';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

// GraphQL Path
export const GRAPHQL_PATH = '/graphql';

// Health Check Path
export const HEALTH_CHECK_PATH = '/health';
