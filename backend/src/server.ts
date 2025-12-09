import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { typeDefs } from './schema/typeDefs';
import resolvers from './schema/resolvers';
import { createContext } from './context';
import { connectDB } from './database';
import { env } from './config';
import { GRAPHQL_PATH, HEALTH_CHECK_PATH } from './constants';
import { AppError } from './errors';
import { logger } from './utils/logger';

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production'
      ? undefined
      : {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://apollo-server-landing-page.cdn.apollographql.com"
            ],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://apollo-server-landing-page.cdn.apollographql.com"
            ],
            imgSrc: [
              "'self'",
              "data:",
              "https://apollo-server-landing-page.cdn.apollographql.com"
            ],
            connectSrc: [
              "'self'",
              "https://apollo-server-landing-page.cdn.apollographql.com"
            ],
            fontSrc: [
              "'self'",
              "https://apollo-server-landing-page.cdn.apollographql.com"
            ],
            manifestSrc: [
              "'self'",
              "https://apollo-server-landing-page.cdn.apollographql.com"
            ],
          },
        },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/graphql', limiter);

// CORS configuration
// Allow GraphQL playground and frontend
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // In development, allow all origins for GraphQL Playground/Apollo Studio Sandbox
      if (env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      // Allow requests with no origin (like mobile apps, Postman, or GraphQL Playground)
      if (!origin) {
        return callback(null, true);
      }
      // Allow frontend URL in production (with or without trailing slash)
      const frontendUrl = env.FRONTEND_URL.replace(/\/$/, ''); // Remove trailing slash
      const originUrl = origin.replace(/\/$/, ''); // Remove trailing slash
      if (originUrl === frontendUrl || origin === env.FRONTEND_URL) {
        return callback(null, true);
      }
      // Also allow Render preview URLs (for testing)
      if (origin.includes('.onrender.com')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
  })
);

// Health check endpoint
app.get(HEALTH_CHECK_PATH, async (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1; // 1 = connected

  const health = {
    status: isDbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: isDbConnected ? 'connected' : 'disconnected',
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState],
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
  };

  const statusCode = isDbConnected ? 200 : 503;
  res.status(statusCode).json(health);
});

// Create Apollo Server configuration
// Note: Apollo Server v3 has type definition issues, so we use type assertion
const serverConfig = {
  typeDefs,
  resolvers,
  context: createContext,
  introspection: true, // Always enable introspection for GraphQL Playground
  debug: env.NODE_ENV === 'development', // Enable debug mode in development
  csrfPrevention: false, // Disable CSRF for GraphQL Playground compatibility
  cache: 'bounded', // Enable caching for better performance
  plugins: [
    {
      requestDidStart() {
        return {
          didEncounterErrors(requestContext: {
            errors: Array<{
              message: string;
              extensions?: { code?: string };
              stack?: string;
              path?: ReadonlyArray<string | number>;
            }>;
          }) {
            const { errors } = requestContext;
            errors.forEach(error => {
              logger.error('GraphQL Error', {
                message: error.message,
                code: error.extensions?.code,
                stack: error.stack,
                path: error.path,
              });
            });
          },
        };
      },
    },
  ],
  formatError: (error: {
    message: string;
    extensions?: { code?: string };
    stack?: string;
    originalError?: Error;
  }) => {
    // Handle custom AppError instances
    if (error.originalError instanceof AppError) {
      return {
        message: error.originalError.message,
        code: error.originalError.code,
        extensions: {
          code: error.originalError.code,
          statusCode: error.originalError.statusCode,
        },
      };
    }

    // Don't expose internal errors in production
    if (env.NODE_ENV === 'production') {
      return {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        extensions: {
          code: 'INTERNAL_ERROR',
        },
      };
    }

    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_ERROR',
      extensions: {
        ...error.extensions,
        stack: env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    };
  },
};

// Apollo Server v3 has type definition issues, but works correctly at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const server = new (ApolloServer as any)(serverConfig);

const startServer = async (): Promise<void> => {
  // Connect to database first
  await connectDB();

  // Start Apollo Server
  // Note: Apollo Server v3 types have issues, but start() method exists at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (server as any).start();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.applyMiddleware({ app: app as any, path: GRAPHQL_PATH });

  // Start Express server
  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📊 GraphQL Playground: http://localhost:${env.PORT}${GRAPHQL_PATH}`);
  });
};

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
