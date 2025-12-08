export const ROUTES = {
  LOGIN: '/login',
  EMPLOYEES: '/employees',
  HOME: '/',
  REPORTS: '/reports',
  REPORTS_ATTENDANCE: '/reports/attendance',
  REPORTS_PERFORMANCE: '/reports/performance',
  SETTINGS: '/settings',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export const VIEW_MODES = {
  GRID: 'grid',
  TILE: 'tile',
} as const;
