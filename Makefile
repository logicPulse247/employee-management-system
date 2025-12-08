.PHONY: help install install-backend install-frontend kill-port dev dev-backend dev-frontend build build-backend build-frontend start start-backend start-frontend docker-build docker-up docker-dev docker-down docker-logs docker-logs-dev docker-clean seed lint lint-backend lint-frontend lint-fix format format-backend format-frontend test test-backend test-frontend clean clean-root clean-backend clean-frontend

# Default target
help:
	@echo "Ultraship Employee Management - Makefile Commands"
	@echo ""
	@echo "Installation:"
	@echo "  make install              - Install all dependencies"
	@echo "  make install-backend      - Install backend dependencies"
	@echo "  make install-frontend     - Install frontend dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev                  - Start both backend and frontend in dev mode"
	@echo "  make dev-backend          - Start backend in dev mode"
	@echo "  make dev-frontend         - Start frontend in dev mode"
	@echo ""
	@echo "Build:"
	@echo "  make build                - Build both backend and frontend"
	@echo "  make build-backend        - Build backend TypeScript"
	@echo "  make build-frontend      - Build frontend Vite app"
	@echo ""
	@echo "Start (Production):"
	@echo "  make start                - Start both backend and frontend (requires build first)"
	@echo "  make start-backend        - Start backend in production (requires build first)"
	@echo "  make start-frontend       - Start frontend preview server (requires build first)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build         - Build all Docker images"
	@echo "  make docker-up            - Start all services with Docker Compose (production)"
	@echo "  make docker-dev           - Start all services in development mode (hot reload)"
	@echo "  make docker-down          - Stop all Docker services"
	@echo "  make docker-logs         - View Docker logs (production)"
	@echo "  make docker-logs-dev     - View Docker logs (development)"
	@echo "  make docker-clean        - Remove Docker containers and volumes"
	@echo ""
	@echo "Database:"
	@echo "  make seed                  - Seed the database with sample data"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint                  - Lint both backend and frontend"
	@echo "  make lint-backend          - Lint backend code"
	@echo "  make lint-frontend         - Lint frontend code"
	@echo "  make lint-fix              - Fix linting issues in both"
	@echo "  make format                - Format code with Prettier"
	@echo "  make format-backend        - Format backend code"
	@echo "  make format-frontend       - Format frontend code"
	@echo ""
	@echo "Testing:"
	@echo "  make test                  - Run tests for both"
	@echo "  make test-backend          - Run backend tests"
	@echo "  make test-frontend         - Run frontend tests"
	@echo ""
	@echo "Clean:"
	@echo "  make clean                 - Clean all build artifacts and node_modules (root, backend, frontend)"
	@echo "  make clean-root            - Clean root node_modules"
	@echo "  make clean-backend         - Clean backend build and node_modules"
	@echo "  make clean-frontend        - Clean frontend build and node_modules"

# Installation
install:
	@echo "Installing all dependencies..."
	cd backend && npm install
	cd frontend && npm install --legacy-peer-deps

install-backend:
	cd backend && npm install

install-frontend:
	cd frontend && npm install --legacy-peer-deps

# Helper function to kill process on a port
kill-port:
	@if lsof -ti:$(PORT) > /dev/null 2>&1; then \
		echo "⚠️  Port $(PORT) is in use. Killing process..."; \
		lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
		echo "✅ Port $(PORT) is now free."; \
	else \
		echo "✅ Port $(PORT) is free."; \
	fi

# Development
dev:
	@echo "Starting development servers..."
	@echo "Checking and freeing ports 3000 and 4000..."
	@if lsof -ti:4000 > /dev/null 2>&1; then \
		echo "⚠️  Port 4000 is in use. Killing process..."; \
		lsof -ti:4000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
	fi
	@if lsof -ti:3000 > /dev/null 2>&1; then \
		echo "⚠️  Port 3000 is in use. Killing process..."; \
		lsof -ti:3000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
	fi
	@if [ ! -f "node_modules/.bin/concurrently" ]; then \
		echo "Installing root dependencies..."; \
		npm install; \
	fi
	@echo "✅ Starting servers..."
	npx concurrently "npm run server" "npm run client" --names "backend,frontend" --prefix-colors "blue,green"

dev-backend:
	@echo "Checking port 4000..."
	@if lsof -ti:4000 > /dev/null 2>&1; then \
		echo "⚠️  Port 4000 is in use. Killing process..."; \
		lsof -ti:4000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
		echo "✅ Port 4000 is now free."; \
	fi
	cd backend && npm run dev

dev-frontend:
	@echo "Checking port 3000..."
	@if lsof -ti:3000 > /dev/null 2>&1; then \
		echo "⚠️  Port 3000 is in use. Killing process..."; \
		lsof -ti:3000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
		echo "✅ Port 3000 is now free."; \
	fi
	cd frontend && npm run dev

# Build
build: build-backend build-frontend

build-backend:
	@echo "Building backend..."
	cd backend && npm run build

build-frontend:
	@echo "Building frontend..."
	cd frontend && npm run build

# Start (Production)
# Note: For production, you should build first with 'make build', then use 'make start'
# This uses concurrently to run both servers (useful for testing production builds locally)
start:
	@echo "⚠️  Warning: Make sure you've built the application first with 'make build'"
	@echo "Starting production servers..."
	@echo "Checking and freeing ports 3000 and 4000..."
	@if lsof -ti:4000 > /dev/null 2>&1; then \
		echo "⚠️  Port 4000 is in use. Killing process..."; \
		lsof -ti:4000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
	fi
	@if lsof -ti:3000 > /dev/null 2>&1; then \
		echo "⚠️  Port 3000 is in use. Killing process..."; \
		lsof -ti:3000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
	fi
	@if [ ! -d "backend/dist" ]; then \
		echo "❌ Error: Backend not built. Run 'make build-backend' first."; \
		exit 1; \
	fi
	@if [ ! -d "frontend/dist" ]; then \
		echo "❌ Error: Frontend not built. Run 'make build-frontend' first."; \
		exit 1; \
	fi
	@echo "Starting backend and frontend..."
	@concurrently "cd backend && npm start" "cd frontend && npm run preview" --names "backend,frontend" --prefix-colors "blue,green"

start-backend:
	@echo "⚠️  Warning: Make sure you've built the backend first with 'make build-backend'"
	@if [ ! -d "backend/dist" ]; then \
		echo "❌ Error: Backend not built. Run 'make build-backend' first."; \
		exit 1; \
	fi
	@echo "Checking port 4000..."
	@if lsof -ti:4000 > /dev/null 2>&1; then \
		echo "⚠️  Port 4000 is in use. Killing process..."; \
		lsof -ti:4000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
	fi
	cd backend && npm start

start-frontend:
	@echo "⚠️  Warning: Make sure you've built the frontend first with 'make build-frontend'"
	@if [ ! -d "frontend/dist" ]; then \
		echo "❌ Error: Frontend not built. Run 'make build-frontend' first."; \
		exit 1; \
	fi
	@echo "Checking port 3000..."
	@if lsof -ti:3000 > /dev/null 2>&1; then \
		echo "⚠️  Port 3000 is in use. Killing process..."; \
		lsof -ti:3000 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
	fi
	@echo "Starting frontend preview server..."
	cd frontend && npm run preview

# Docker
docker-build:
	@echo "Building Docker images..."
	docker-compose build

docker-up:
	@echo "Starting Docker services (production)..."
	@echo "Stopping any existing development containers..."
	@docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
	@docker-compose up -d
	@echo "Services started! Backend: http://localhost:4000, Frontend: http://localhost:3000"

docker-dev:
	@echo "Starting Docker services (development with hot reload)..."
	@echo "Stopping any existing production containers..."
	@docker-compose down 2>/dev/null || true
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "Services started! Backend: http://localhost:4000, Frontend: http://localhost:3000"

docker-down:
	@echo "Stopping Docker services..."
	@docker-compose down 2>/dev/null || true
	@docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

docker-logs:
	@echo "Viewing Docker logs (use Ctrl+C to exit)..."
	docker-compose logs -f

docker-logs-dev:
	@echo "Viewing Docker dev logs (use Ctrl+C to exit)..."
	docker-compose -f docker-compose.dev.yml logs -f

docker-clean:
	@echo "Cleaning Docker containers and volumes..."
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f

# Database
seed:
	@echo "Seeding database..."
	@if [ ! -f backend/.env ]; then \
		echo "⚠️  Warning: backend/.env file not found!"; \
		echo "📋 Creating .env from .env.example..."; \
		cp backend/.env.example backend/.env; \
		echo "✅ Created backend/.env file with default values"; \
		echo ""; \
		echo "ℹ️  The .env file has been created with default values suitable for local development."; \
		echo "   You can now run 'make seed' again to seed the database."; \
		echo "   Or edit backend/.env if you need to customize the values."; \
		echo ""; \
		exit 1; \
	fi
	cd backend && npm run seed

# Linting
lint: lint-backend lint-frontend

lint-backend:
	@echo "Linting backend..."
	cd backend && npm run lint

lint-frontend:
	@echo "Linting frontend..."
	cd frontend && npm run lint

lint-fix:
	@echo "Fixing linting issues..."
	cd backend && npm run lint:fix
	cd frontend && npm run lint:fix

# Formatting
format: format-backend format-frontend

format-backend:
	@echo "Formatting backend code..."
	cd backend && npm run format

format-frontend:
	@echo "Formatting frontend code..."
	cd frontend && npm run format

# Testing
test: test-backend test-frontend

test-backend:
	cd backend && npm test

test-frontend:
	cd frontend && npm test

# Clean
clean: clean-backend clean-frontend clean-root

clean-root:
	@echo "Cleaning root node_modules..."
	rm -rf node_modules
	@echo "✅ Root node_modules cleaned"

clean-backend:
	@echo "Cleaning backend..."
	cd backend && rm -rf dist node_modules
	@echo "✅ Backend cleaned"

clean-frontend:
	@echo "Cleaning frontend..."
	cd frontend && rm -rf dist build node_modules
	@echo "✅ Frontend cleaned"

