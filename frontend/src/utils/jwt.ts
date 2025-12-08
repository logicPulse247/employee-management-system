/**
 * JWT Token Utility Functions
 * Handles JWT token decoding and expiration checking
 */

interface JWTPayload {
  userId?: string;
  username?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This does NOT verify the signature, only decodes the payload
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    // Replace URL-safe characters and add padding if needed
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  // Add a 5 second buffer to account for clock skew
  return currentTime >= expirationTime - 5000;
};

/**
 * Get token expiration time
 * @param token - JWT token string
 * @returns expiration timestamp in milliseconds, or null if invalid
 */
export const getTokenExpiration = (token: string | null): number | null => {
  if (!token) {
    return null;
  }

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  return decoded.exp * 1000;
};

/**
 * Get time until token expires in milliseconds
 * @param token - JWT token string
 * @returns milliseconds until expiration, or null if invalid/expired
 */
export const getTimeUntilExpiration = (token: string | null): number | null => {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return null;
  }

  const timeUntilExpiration = expiration - Date.now();
  return timeUntilExpiration > 0 ? timeUntilExpiration : null;
};
