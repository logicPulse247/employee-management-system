/**
 * Centralized authentication utilities
 * Provides token validation and cleanup functions
 */

import { isTokenExpired } from './jwt';
import { ROUTES } from '../constants';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Validates token and cleans up if expired
 * @returns true if token is valid, false if expired/invalid
 */
export const validateAndCleanToken = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return false;
  }
  return !!token;
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Gets token from localStorage and validates it
 * @returns token if valid, null if expired/invalid
 */
export const getValidToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !isTokenExpired(token)) {
    return token;
  }
  if (token) {
    clearAuthData();
  }
  return null;
};

/**
 * Redirects to login page
 * Can be used with React Router navigate or window.location
 */
export const redirectToLogin = (navigate?: (path: string) => void): void => {
  if (navigate) {
    navigate(ROUTES.LOGIN);
  } else {
    window.location.href = ROUTES.LOGIN;
  }
};
