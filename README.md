# Ultraship Employee Management System

A full-stack employee management application built with TypeScript, GraphQL, Node.js, and React. Features a beautiful, modern UI with grid and tile views, role-based authentication, and comprehensive employee management capabilities.

## 🚀 Features

### Frontend

- **Hamburger Menu** with one-level sub-menu support
- **Horizontal Menu** with dropdown sub-menus
- **Grid View** - Display employees in a 10-column table format
- **Tile View** - Beautiful card-based layout showing key employee information
- **Detail Modal** - Expanded view with full employee details
- **Filtering & Sorting** - Advanced filtering and sorting capabilities
- **Pagination** - Efficient data pagination
- **Responsive Design** - Works seamlessly on all devices
- **Modern UI/UX** - Beautiful gradient designs and smooth animations

- Deployed URL: https://employee-management-system-frontend-ixql.onrender.com/

### Backend

- **GraphQL API** - Type-safe GraphQL schema with TypeScript
- **Authentication & Authorization** - JWT-based auth with role-based access control
  - Admin: Full access (add, update, delete employees)
  - Employee: Read-only access
- **Pagination & Sorting** - Efficient data retrieval with pagination and sorting
- **Performance Optimizations**:
  - Database indexing for faster queries
  - DataLoader for batch loading (N+1 problem prevention)
  - Lean queries for better performance
  - Caching strategies
- **MongoDB Integration** - Robust data persistence

- Deployed URL: https://employee-management-system-050e.onrender.com/graphql

## 🛠️ Tech Stack

### Backend

- TypeScript
- Node.js 22 LTS
- Express
- Apollo Server (GraphQL)
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- DataLoader for performance

### Frontend

- TypeScript
- React 19
- Apollo Client (GraphQL)
- React Router v7
- CSS3 with modern animations

## 📦 Installation

### Prerequisites

- Node.js 22 LTS (or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Docker & Docker Compose (optional, for containerized setup)
- Make (optional, for using Makefile commands)

### Setup Options

#### Option 1: Docker (Recommended for Quick Start)

1. **Clone the repository**

   ```bash
   git clone https://github.com/logicPulse247/employee-management-system
   cd employee-management-system
   ```

2. **Create `.env` file in root** (optional, for custom JWT_SECRET):

   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

3. **Start with Docker Compose**

   ```bash
   make docker-up
   # or
   docker-compose up -d
   ```

   The application will be available at:
   - Frontend: <http://localhost:3000>
   - Backend: <http://localhost:4000>
   - GraphQL Playground: <http://localhost:4000/graphql>

4. **Seed the database** (optional):

   ```bash
   make seed
   # or
   docker-compose exec backend npm run seed
   ```

#### Option 2: Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ultraship
   ```

2. **Install dependencies**

   ```bash
   make install
   # or
   npm run install-all
   ```

3. **Backend Setup**

   ```bash
   cd backend
   ```

   Create a `.env` file:

   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/ultraship_employees
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   ```

   For MongoDB Atlas, use:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ultraship_employees
   ```

4. **Frontend Setup**

   ```bash
   cd ../frontend
   ```

   Create a `.env` file:

   ```env
   VITE_GRAPHQL_URL=http://localhost:4000/graphql
   ```

5. **Start MongoDB** (if using local MongoDB)

   ```bash
   mongod
   ```

6. **Run the application**

   Using Makefile:

   ```bash
   make dev
   ```

   Or manually:

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

### Development Tools

#### Makefile Commands

The project includes a comprehensive Makefile for common tasks:

```bash
make help              # Show all available commands
make install           # Install all dependencies
make dev               # Start development servers
make build             # Build both backend and frontend
make docker-up         # Start Docker services
make docker-down       # Stop Docker services
make clean             # Clean all build artifacts and node_modules (root, backend, frontend)
make lint              # Lint code
make format            # Format code with Prettier
make seed              # Seed database
```

See `make help` for full list of commands.

#### Code Quality

**ESLint** - Code linting for both backend and frontend:

```bash
make lint              # Lint all code
make lint-backend      # Lint backend only
make lint-frontend     # Lint frontend only
make lint-fix          # Auto-fix linting issues
```

**Prettier** - Code formatting:

```bash
make format            # Format all code
make format-backend    # Format backend only
make format-frontend   # Format frontend only
```

## 🎯 Usage

### Default Credentials

After starting the application, you can register new users or use these demo credentials:

**Admin User:**

- Username: `admin`
- Password: `admin123`
- Role: `admin`

**Employee User:**

- Username: `employee`
- Password: `emp123`
- Role: `employee`

### GraphQL Playground

Access the GraphQL Playground at: `http://localhost:4000/graphql`

### Example Queries

**Login:**

```graphql
mutation {
  login(username: "admin", password: "admin123") {
    token
    user {
      id
      username
      role
    }
  }
}
```

**Get Employees:**

```graphql
query {
  employees(page: 1, pageSize: 10) {
    employees {
      id
      name
      age
      class
      email
      attendance
    }
    pagination {
      total
      page
      totalPages
    }
  }
}
```

**Add Employee (Admin only):**

```graphql
mutation {
  addEmployee(input: {
    name: "John Doe"
    age: 30
    class: "Engineering"
    subjects: ["Math", "Science"]
    attendance: 95
    email: "john@example.com"
    department: "IT"
    position: "Developer"
    salary: 75000
  }) {
    id
    name
  }
}
```

## 📁 Project Structure

```
ultraship/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── schema/          # GraphQL schema and resolvers
│   │   ├── utils/           # Utility functions (auth, dataloader)
│   │   └── server.ts       # Express server setup
│   ├── dist/               # Compiled TypeScript
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Employee/   # Employee-related components
│   │   │   └── Menu/       # Menu components
│   │   ├── pages/          # Page components
│   │   ├── graphql/        # GraphQL queries and mutations
│   │   ├── context/        # React context (Auth)
│   │   ├── types/          # TypeScript types
│   │   └── apollo/         # Apollo Client setup
│   ├── public/
│   └── package.json
└── README.md
```

## 🔒 Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **Role-Based Access Control**:
  - **Admin**: Can add, update, and delete employees (buttons visible only to admins)
  - **Employee**: Can only view employees (no edit/delete buttons shown)
- **Protected Routes**: Frontend routes are protected with authentication checks
- **GraphQL Context**: User authentication is verified in GraphQL resolvers
- **Centralized Auth Utilities**: Reusable token validation functions
- **Automatic Token Cleanup**: Expired tokens are automatically removed from localStorage

## ⚡ Performance Optimizations

1. **Database Indexing**: Strategic indexes on frequently queried fields (name, class, email, department, position, salary, and compound indexes)
2. **DataLoader**: Batch loading to prevent N+1 query problems (integrated in GraphQL context)
3. **Lean Queries**: Using `.lean()` for faster MongoDB read-only queries
4. **User Token Caching**: In-memory caching for user lookups to reduce database queries
5. **Pagination**: Efficient data pagination to limit response sizes
6. **Apollo Client Caching**: Optimized cache policies for better performance
7. **Optimistic Updates**: Immediate UI updates for mutations (create, update, delete)
8. **Query Optimization**: Optimized GraphQL queries with proper field selection
9. **Centralized Token Validation**: Single source of truth for authentication checks

## 🎨 Design Features

- Modern gradient color schemes
- Smooth animations and transitions
- Responsive design for all screen sizes (mobile, tablet, desktop)
- Intuitive user interface with clear action buttons
- Accessible components with proper ARIA labels
- Beautiful card-based layouts (Tile view)
- Comprehensive table view (Grid view) with optimized column widths
- Interactive hover effects
- Icon-enhanced buttons for better UX
- Role-based UI visibility (admin-only buttons)

## 🚢 Deployment

### Render Deployment (Recommended)

**Quick Start:**
1. See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed step-by-step instructions
2. See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a quick checklist

**Using Render Blueprint:**
1. Push your code to GitHub/GitLab/Bitbucket
2. In Render Dashboard: New → Blueprint
3. Connect your repository
4. Render will auto-detect `render.yaml` and create all services
5. Set required environment variables (MONGODB_URI, JWT_SECRET)
6. Deploy!

**Manual Deployment:**

#### Backend Deployment (Render Web Service)

1. Set environment variables:
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (strong random secret)
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your frontend URL)
   - `JWT_EXPIRES_IN=30d`

2. Build Command: `cd backend && npm install && npm run build`
3. Start Command: `cd backend && npm start`
4. Health Check Path: `/health`

#### Frontend Deployment (Render Static Site)

1. Set environment variables:
   - `VITE_GRAPHQL_URL` (your backend GraphQL endpoint)
   - `VITE_ENV=production`

2. Build Command: `cd frontend && npm install && npm run build`
3. Publish Directory: `dist`

### Other Platforms

#### Backend Deployment (Heroku/Railway)

1. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (auto-set by platform)
   - `NODE_ENV=production`

2. Build the project:

   ```bash
   cd backend
   npm run build
   ```

3. Start the server:

   ```bash
   npm start
   ```

#### Frontend Deployment (Vercel/Netlify)

1. Set environment variable:
   - `VITE_GRAPHQL_URL` (your backend URL)

2. Build the project:

   ```bash
   cd frontend
   npm run build
   ```

3. Deploy the `dist` folder

## 📝 API Documentation

### Queries

- `employees(filters, page, pageSize, sort)` - Get paginated list of employees
- `employee(id)` - Get single employee by ID
- `me` - Get current authenticated user

### Mutations

- `register(username, email, password, role)` - Register new user
- `login(username, password)` - Login user
- `addEmployee(input)` - Add new employee (Admin only)
- `updateEmployee(id, input)` - Update employee (Admin only)
- `deleteEmployee(id)` - Delete employee (Admin only)

## 🧪 Testing

To test the application:

1. Start the backend and frontend servers (or use `make docker-up`)
2. Register or login with credentials
3. Navigate to the employees page
4. Test grid and tile views
5. Click on employees to see detail modal
6. Test filtering and sorting
7. Test pagination

## 🐳 Docker

### Quick Start with Docker

```bash
# Build and start all services
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down

# Clean up (removes containers and volumes)
make docker-clean
```

### Docker Services

- **MongoDB**: Running on port 27017
- **Backend**: Running on port 4000
- **Frontend**: Running on port 3000 (mapped to nginx port 80)

### Environment Variables

Set environment variables in `docker-compose.yml` or use a `.env` file in the root directory.

## 🔧 Development Tools

### ESLint

ESLint is configured for both backend and frontend with TypeScript support:

```bash
# Lint code
make lint

# Auto-fix issues
make lint-fix
```

### Prettier

Prettier is configured for consistent code formatting:

```bash
# Format code
make format

# Check formatting
make format:check
```

### VS Code Integration

For the best experience, install these VS Code extensions:

- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code

The project includes `.editorconfig` for consistent editor settings.

## 📄 License

MIT License

## 🙏 Acknowledgments

- Apollo GraphQL
- React Team
- MongoDB
- All open-source contributors

---

**Note**: This is a demonstration project. For production use, ensure:

- Strong JWT secrets
- Secure MongoDB connection strings
- Environment variable security
- Input validation and sanitization
- Error handling improvements
- Comprehensive testing
- Security audits
