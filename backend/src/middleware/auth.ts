import { Context } from '../types';
import { AuthenticationError, AuthorizationError } from '../errors';
import { hasRole } from '../utils/auth';

export const requireAuth = (context: Context): void => {
  if (!context.user) {
    throw new AuthenticationError();
  }
};

export const requireRole = (context: Context, roles: string[]): void => {
  requireAuth(context);
  if (!hasRole(context.user!, roles)) {
    throw new AuthorizationError('Insufficient permissions');
  }
};
