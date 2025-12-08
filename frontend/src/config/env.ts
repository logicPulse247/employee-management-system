import { z } from 'zod';
import { envSchema, EnvValues } from '../utils/validation';

let env: EnvValues;

try {
  env = envSchema.parse({
    VITE_GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL,
    VITE_ENV: import.meta.env.VITE_ENV || import.meta.env.MODE || 'development',
  });
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors
      .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      .join('\n');
    console.error('❌ Environment variable validation failed:\n', errorMessages);
    throw new Error('Invalid environment configuration');
  }
  throw error;
}

export default env;
