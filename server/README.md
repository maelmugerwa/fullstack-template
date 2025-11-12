# 🔧 Server Documentation

Backend API documentation for the Fullstack Interview Template.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [API Routes](#api-routes)
6. [Controllers](#controllers)
7. [Database Schema](#database-schema)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Adding New Features](#adding-new-features)

## Overview

The backend is a RESTful API built with Express and TypeScript, using Prisma ORM for database operations. It follows a clean architecture pattern with separation of concerns between routes, controllers, and data access.

**Key Features:**
- ✅ RESTful API design
- ✅ Type-safe database access with Prisma
- ✅ Centralized error handling
- ✅ Request logging middleware
- ✅ Graceful shutdown handling
- ✅ CORS configuration
- ✅ Hot reload with tsx watch

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Express | Web framework | ^4.21.1 |
| TypeScript | Type safety | ^5.6.3 |
| Prisma | ORM | ^5.22.0 |
| SQLite | Database | (via Prisma) |
| tsx | Dev runner | ^4.19.2 |
| dotenv | Environment config | ^16.4.5 |
| cors | CORS middleware | ^2.8.5 |

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   ├── seed.ts            # Database seed script
│   └── dev.db             # SQLite database file (generated)
│
├── src/
│   ├── config/
│   │   └── database.ts    # Prisma client configuration
│   │
│   ├── controllers/
│   │   └── taskController.ts  # Task business logic
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling middleware
│   │   └── logger.ts           # Request logging middleware
│   │
│   ├── routes/
│   │   ├── index.ts            # Main router
│   │   └── tasks.ts            # Task routes
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   │
│   ├── app.ts             # Express app configuration
│   └── index.ts           # Server entry point
│
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### Development

```bash
# From server directory
npm run dev              # Start with hot reload

# From root directory
npm run dev              # Start both frontend and backend
```

The server will start on http://localhost:3000 with hot reload enabled.

### Production Build

```bash
npm run build           # Compile TypeScript to JavaScript
npm start               # Run compiled server
```

### Database Commands

```bash
npm run db:generate     # Generate Prisma Client
npm run db:push         # Push schema changes without migration
npm run db:migrate      # Create and apply migration
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio (GUI)
```

## API Routes

### Base Structure

All API endpoints are prefixed with `/api`:

```typescript
// routes/index.ts
import taskRoutes from './tasks';

router.use('/tasks', taskRoutes);  // Mounts at /api/tasks
```

### Task Routes

**File:** [`routes/tasks.ts`](src/routes/tasks.ts)

| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/api/tasks` | `getAllTasks` | Get all tasks |
| GET | `/api/tasks/:id` | `getTaskById` | Get single task |
| POST | `/api/tasks` | `createTask` | Create new task |
| PUT | `/api/tasks/:id` | `updateTask` | Update task |
| DELETE | `/api/tasks/:id` | `deleteTask` | Delete task |

### Request/Response Examples

**Create Task:**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write comprehensive API docs"
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete documentation",
    "description": "Write comprehensive API docs",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

**Update Task:**
```bash
PUT /api/tasks/1
Content-Type: application/json

{
  "completed": true
}

Response (200):
{
  "success": true,
  "data": { /* updated task */ },
  "message": "Task updated successfully"
}
```

**Error Response:**
```bash
GET /api/tasks/999

Response (404):
{
  "success": false,
  "error": {
    "message": "Task with ID 999 not found"
  }
}
```

## Controllers

Controllers contain the business logic for handling requests.

### Task Controller

**File:** [`controllers/taskController.ts`](src/controllers/taskController.ts)

Each controller function follows this pattern:

```typescript
export const controllerName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Extract and validate input
      // 2. Perform business logic
      // 3. Send success response
    } catch (error) {
      // 4. Pass error to error handler
      next(new AppError(statusCode, message));
    }
  }
);
```

**Key Features:**
- ✅ Input validation before database operations
- ✅ Consistent response format
- ✅ Proper HTTP status codes
- ✅ Error propagation to centralized handler
- ✅ Async/await with error wrapping

### Controller Best Practices

1. **Validate Early:**
   ```typescript
   if (!title || title.trim().length === 0) {
     return next(new AppError(400, 'Title is required'));
   }
   ```

2. **Check Existence:**
   ```typescript
   const task = await prisma.task.findUnique({ where: { id } });
   if (!task) {
     return next(new AppError(404, 'Task not found'));
   }
   ```

3. **Use Proper Status Codes:**
   - `200` - Success
   - `201` - Created
   - `400` - Bad Request
   - `404` - Not Found
   - `500` - Internal Server Error

## Database Schema

**File:** [`prisma/schema.prisma`](prisma/schema.prisma)

### Task Model

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("tasks")
}
```

**Field Details:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Int | Primary key, auto-increment | Unique identifier |
| `title` | String | Required | Task title |
| `description` | String | Optional (nullable) | Task description |
| `completed` | Boolean | Default: false | Completion status |
| `createdAt` | DateTime | Default: now() | Creation timestamp |
| `updatedAt` | DateTime | Auto-updated | Last update timestamp |

### Database Operations

**Using Prisma Client:**

```typescript
import { prisma } from './config/database';

// Find all
const tasks = await prisma.task.findMany();

// Find by ID
const task = await prisma.task.findUnique({ where: { id: 1 } });

// Create
const task = await prisma.task.create({
  data: { title: 'New task', description: 'Description' }
});

// Update
const task = await prisma.task.update({
  where: { id: 1 },
  data: { completed: true }
});

// Delete
await prisma.task.delete({ where: { id: 1 } });

// Find with filters
const tasks = await prisma.task.findMany({
  where: { completed: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0
});
```

### Modifying Schema

1. Edit `prisma/schema.prisma`
2. Apply changes: `npm run db:push`
3. Generate client: `npm run db:generate`
4. Update seed data if needed
5. Restart server (if not using watch mode)

**Example - Add Priority Field:**
```prisma
model Task {
  // ... existing fields
  priority String @default("medium")  // Add this
}
```

## Middleware

### 1. Logger Middleware

**File:** [`middleware/logger.ts`](src/middleware/logger.ts)

Logs all HTTP requests with method, URL, status code, and response time.

```typescript
// Example output:
[2024-01-01T12:00:00.000Z] GET /api/tasks - Status: 200 - 45ms
[2024-01-01T12:00:01.000Z] POST /api/tasks - Status: 201 - 89ms
```

**Usage:**
```typescript
app.use(logger);  // Applied globally in app.ts
```

### 2. Error Handler Middleware

**File:** [`middleware/errorHandler.ts`](src/middleware/errorHandler.ts)

Centralized error handling with consistent error responses.

**Features:**
- Custom `AppError` class for operational errors
- Automatic status code detection
- Stack traces in development mode
- Consistent JSON error format

**Usage:**
```typescript
// Throw errors anywhere in your code
throw new AppError(404, 'Resource not found');

// Or pass to next()
next(new AppError(400, 'Invalid input'));
```

### 3. CORS Middleware

**File:** [`app.ts`](src/app.ts:21-26)

Configured to allow requests from the frontend:

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
```

### 4. Body Parser Middleware

```typescript
app.use(express.json());                    // Parse JSON
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded
```

## Error Handling

### Custom Error Class

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}
```

### Async Handler Wrapper

Automatically catches errors in async route handlers:

```typescript
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
export const getTask = asyncHandler(async (req, res, next) => {
  // Your async code - errors automatically caught
});
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Task not found",
    "stack": "Error: Task not found\n    at...",  // Development only
    "details": "Full error message"              // Development only
  }
}
```

## Adding New Features

### Add a New Endpoint (Step by Step)

**1. Define Route** - `routes/tasks.ts`:
```typescript
router.get('/completed', getCompletedTasks);
```

**2. Create Controller** - `controllers/taskController.ts`:
```typescript
export const getCompletedTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await prisma.task.findMany({
        where: { completed: true },
        orderBy: { updatedAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: tasks,
        message: `Retrieved ${tasks.length} completed tasks`
      });
    } catch (error) {
      next(new AppError(500, 'Failed to retrieve completed tasks'));
    }
  }
);
```

**3. Update Types** - `types/index.ts` (if needed):
```typescript
export interface TaskFilter {
  completed?: boolean;
  priority?: string;
}
```

**4. Test:**
```bash
curl http://localhost:3000/api/tasks/completed
```

### Add a New Model

**1. Update Schema** - `prisma/schema.prisma`:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Task {
  // ... existing fields
  userId    Int?
  user      User?    @relation(fields: [userId], references: [id])
}
```

**2. Apply Changes:**
```bash
npm run db:push
npm run db:generate
```

**3. Create Controller** - `controllers/userController.ts`:
```typescript
import { prisma } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
    include: { tasks: true }  // Include related tasks
  });
  
  res.json({ success: true, data: users });
});
```

**4. Create Routes** - `routes/users.ts`:
```typescript
import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';

const router = Router();
router.get('/', getAllUsers);

export default router;
```

**5. Mount Route** - `routes/index.ts`:
```typescript
import userRoutes from './users';
router.use('/users', userRoutes);
```

### Add Middleware

**Create** - `middleware/authenticate.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(new AppError(401, 'Unauthorized'));
  }
  
  // Verify token logic here
  next();
};
```

**Use in Routes:**
```typescript
import { authenticate } from '../middleware/authenticate';

router.get('/', authenticate, getAllTasks);  // Protected route
```

## Database Management

### Prisma Commands Reference

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema to database (no migration)
npm run db:push

# Create migration (production-ready)
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (visual editor)
npm run db:studio  # Opens at http://localhost:5555

# Reset database (delete all data, reseed)
npm run db:reset
```

### Prisma Studio

Visual database browser at http://localhost:5555

**Features:**
- View all tables and records
- Edit data directly
- Filter and sort records
- Create new records
- Delete records

**Access:**
```bash
npm run db:studio
```

### Database Seed Data

**File:** [`prisma/seed.ts`](prisma/seed.ts)

The seed script creates sample tasks. Customize it for your needs:

```typescript
const tasks = [
  { title: 'Task 1', description: 'Description 1', completed: false },
  { title: 'Task 2', description: 'Description 2', completed: true },
];

await prisma.task.createMany({ data: tasks });
```

Run with: `npm run db:seed`

## Environment Variables

**File:** `.env`

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```

**Access in Code:**
```typescript
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
```

## Testing the API

### Using curl

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Get single task
curl http://localhost:3000/api/tasks/1

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description"}'

# Update task
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete task
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Using Postman/Insomnia

Import this collection or create requests manually:

**Base URL:** `http://localhost:3000`

1. Create collection/folder: "Fullstack Template API"
2. Add requests for each endpoint
3. Set `Content-Type: application/json` header
4. Save example responses

## Advanced Topics

### Adding Validation with Zod

```bash
npm install zod
```

```typescript
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional(),
});

export const createTask = asyncHandler(async (req, res, next) => {
  // Validate request body
  const result = createTaskSchema.safeParse(req.body);
  
  if (!result.success) {
    return next(new AppError(400, result.error.message));
  }
  
  const task = await prisma.task.create({ data: result.data });
  res.status(201).json({ success: true, data: task });
});
```

### Adding Authentication

```bash
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

**Create auth middleware:**
```typescript
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(new AppError(401, 'Unauthorized'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError(401, 'Invalid token'));
  }
};
```

### Adding Pagination

```typescript
export const getAllTasks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.task.count()
  ]);

  res.json({
    success: true,
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
```

### Adding Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api', limiter);
```

## Debugging

### Enable Detailed Logging

```typescript
// In development, log request bodies
app.use((req, res, next) => {
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  next();
});
```

### Prisma Query Logging

```typescript
// config/database.ts
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],  // Enable all logs
});
```

### Common Issues

**Port Already in Use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Prisma Client Not Generated:**
```bash
npm run db:generate
```

**Database Locked:**
```bash
# Close Prisma Studio and any DB connections
# Then restart server
```

## Performance Optimization

### Database Indexes

Add indexes for frequently queried fields:
```prisma
model Task {
  // ... fields
  
  @@index([completed])
  @@index([createdAt])
}
```

### Select Only Needed Fields

```typescript
const tasks = await prisma.task.findMany({
  select: {
    id: true,
    title: true,
    completed: true,
    // Don't fetch description if not needed
  }
});
```

### Use Connection Pooling

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection pooling for production
}
```

## Production Considerations

### Environment Setup

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="https://yourdomain.com"
```

### Security Checklist

- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable rate limiting
- [ ] Add helmet for security headers
- [ ] Implement authentication
- [ ] Add input sanitization
- [ ] Use HTTPS
- [ ] Set up proper CORS
- [ ] Add request validation
- [ ] Implement API versioning
- [ ] Add audit logging

### Deployment

```bash
# Build
npm run build

# Run production server
NODE_ENV=production npm start

# Or with PM2
pm2 start dist/index.js --name api-server
```

## Related Documentation

- [Main README](../README.md)
- [Quick Reference](../docs/QUICK_REFERENCE.md)
- [Interview Guide](../docs/INTERVIEW_GUIDE.md)
- [Client Documentation](../client/README.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com)

---

**Need help?** Check the [main troubleshooting section](../README.md#-troubleshooting) or open an issue.