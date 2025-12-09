import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';
import { User } from '../models/User';
import { env } from '../config';
import { TokenPayload } from '../types';
import { JWT_EXPIRES_IN } from '../constants';

// Generate JWT token
export const generateToken = (user: IUser): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as string | number,
  };
  return jwt.sign(
    { userId: user._id.toString(), role: user.role, username: user.username },
    env.JWT_SECRET,
    options
  );
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Simple in-memory cache for user lookups (cleared on each request in production)
// In a production environment, consider using Redis for distributed caching
const userCache = new Map<string, { user: IUser; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get user from token (optimized with caching and .lean())
// Uses JWT payload for basic validation, queries DB with .lean() for performance
export const getUserFromToken = async (token: string | null): Promise<IUser | null> => {
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Check cache first
  const cached = userCache.get(decoded.userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }

  try {
    // Use .lean() for better performance (returns plain object)
    // Then create a User instance for compatibility with IUser interface
    const userData = await User.findById(decoded.userId).lean();
    if (!userData) return null;

    // Create User instance from lean data for interface compatibility
    const user = new User(userData);
    user.isNew = false;

    // Cache the result
    userCache.set(decoded.userId, { user, timestamp: Date.now() });

    // Clean old cache entries (simple cleanup)
    if (userCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of userCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          userCache.delete(key);
        }
      }
    }

    return user;
  } catch (error) {
    return null;
  }
};

// Check if user has required role
export const hasRole = (user: IUser | null, requiredRoles: string[]): boolean => {
  if (!user) return false;
  return requiredRoles.includes(user.role);
};
