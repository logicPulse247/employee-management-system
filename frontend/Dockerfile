# Frontend Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./

# Install dependencies (using --legacy-peer-deps to match dev environment)
RUN npm install --legacy-peer-deps

# Copy source files
COPY public ./public
COPY src ./src
COPY index.html ./

# Build Vite app with environment variables
# Note: Vite environment variables must be available at build time
# These ARGs must be provided at build time via --build-arg or docker-compose build args
ARG VITE_GRAPHQL_URL
ARG VITE_ENV
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_ENV=$VITE_ENV
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

