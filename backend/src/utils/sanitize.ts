/**
 * Sanitizes a string input to prevent XSS attacks
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  // Remove HTML tags and trim whitespace
  return input.trim().replace(/<[^>]*>/g, '');
};

/**
 * Escapes special regex characters to prevent regex injection
 * @param string - The string to escape
 * @returns Escaped string safe for use in regex
 */
export const escapeRegex = (string: string): string => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Sanitizes and escapes a string for use in MongoDB regex queries
 * @param input - The string to sanitize and escape
 * @returns Sanitized and escaped string
 */
export const sanitizeForRegex = (input: string): string => {
  return escapeRegex(sanitizeString(input));
};
