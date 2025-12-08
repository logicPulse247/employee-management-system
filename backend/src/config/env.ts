import { z } from 'zod';
import dotenv from 'dotenv';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Load .env file from the backend directory
const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Create logs directory if it doesn't exist
const logsDir = join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(val => parseInt(val, 10)),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('30d'), // Default to 1 month (30 days)
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join('\n');
    console.error('❌ Environment variable validation failed:\n', errorMessages);
    process.exit(1);
  }
  throw error;
}

export default env;
