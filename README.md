# 🚀 Fullstack Interview Template

A production-ready fullstack application template designed for technical interviews and rapid prototyping. Features a modern tech stack with React, TypeScript, Express, Prisma, and SQLite - all ready to run in seconds.

## ✨ Features

- **🎯 Full TypeScript Stack** - End-to-end type safety from frontend to database
- **⚡ Hot Reload** - Instant feedback with tsx watch and Vite HMR
- **🔄 Complete CRUD** - Working task management API and UI out of the box
- **💾 SQLite Database** - Zero-config database with Prisma ORM
- **🎨 Clean Architecture** - Organized structure with controllers, routes, and services
- **🔧 Ready to Demo** - Sample data and UI components included
- **📦 Monorepo Setup** - Single npm install for both frontend and backend
- **🛠️ Dev Tools** - Prisma Studio, error handling, and request logging built-in

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe frontend development
- **Vite** - Lightning-fast dev server and build tool
- **Axios** - HTTP client for API requests

### Backend
- **Node.js & Express** - Fast, minimal web framework
- **TypeScript** - Type-safe backend development
- **Prisma** - Next-generation ORM
- **SQLite** - Embedded database (no setup required)

### Dev Tools
- **tsx** - TypeScript execution for Node.js
- **Concurrently** - Run frontend and backend simultaneously
- **Prisma Studio** - Visual database browser

## 📋 Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** - Comes with Node.js

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd fullstack_template

# Install all dependencies (frontend + backend)
npm install

# Setup database and seed sample data
npm run db:setup

# Start development servers (both frontend and backend)
npm run dev
```

**That's it!** Your application is now running:
- 🎨 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000
- 📊 **API Docs**: http://localhost:3000/api

## 📝 Available Scripts

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run db:setup` | Initialize database and seed sample data |
| `npm run db:studio` | Open Prisma Studio (visual database browser) |
| `npm run db:reset` | Reset database and reseed data |

### Server Commands

```bash
cd server
npm run dev        # Start backend dev server with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run db:generate # Generate Prisma Client
npm run db:push    # Push schema changes to database
npm run db:migrate # Create and apply migrations
npm run db:seed    # Seed database with sample data
npm run db:studio  # Open Prisma Studio
```

### Client Commands

```bash
cd client
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📁 Project Structure

```
fullstack_template/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   └── package.json
│
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Database seed data
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Server entry point
│   └── package.json
│
├── docs/                   # Documentation
└── package.json           # Root package.json (workspace config)
```

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api`

### Tasks API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/tasks` | Get all tasks | - |
| `GET` | `/tasks/:id` | Get single task | - |
| `POST` | `/tasks` | Create new task | `{ title, description? }` |
| `PUT` | `/tasks/:id` | Update task | `{ title?, description?, completed? }` |
| `DELETE` | `/tasks/:id` | Delete task | - |

### Example Requests

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description"}'
```

**Get all tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Update a task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the fullstack template",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Task not found"
}
```

## 💾 Database Management

### Prisma Studio (Visual Database Browser)

```bash
npm run db:studio
```
Opens a browser interface at http://localhost:5555 to view and edit database records.

### Reset Database

```bash
npm run db:reset
```
Deletes all data and reseeds the database with sample tasks.

### Modify Database Schema

1. Edit `server/prisma/schema.prisma`
2. Run `npm run db:push --workspace=server` to apply changes
3. Update seed data in `server/prisma/seed.ts` if needed

### Sample Data

The database is seeded with sample tasks on setup:
- "Complete project documentation"
- "Setup development environment"
- "Write unit tests"

## 💡 Interview Usage Tips

### Quick Demo Points

1. **Show CRUD Operations** (2 minutes)
   - Open http://localhost:5173
   - Create, edit, toggle, and delete tasks
   - Highlight real-time updates

2. **Explain Architecture** (3 minutes)
   - Monorepo structure with workspaces
   - TypeScript across the stack
   - Prisma ORM for type-safe database access
   - React hooks for state management

3. **Code Walkthrough** (5 minutes)
   - Show controller pattern in `server/src/controllers/taskController.ts`
   - Explain custom hook in `client/src/hooks/useTasks.ts`
   - Demonstrate type safety across API boundaries

### Where to Add Features

- **New API endpoint**: `server/src/routes/` and `server/src/controllers/`
- **New component**: `client/src/components/`
- **New database model**: `server/prisma/schema.prisma`
- **API service**: `client/src/services/api.ts`

### Common Extensions to Showcase

- Add authentication (JWT)
- Implement filtering/sorting
- Add pagination
- Include form validation
- Add error boundaries
- Implement optimistic updates
- Add loading states
- Include search functionality

## 🔧 Development Workflow

### Hot Reload is Enabled

Both frontend and backend support hot reload:
- **Backend**: tsx watch automatically restarts on file changes
- **Frontend**: Vite HMR updates instantly in the browser

### Making Changes

1. **Backend changes** - Edit files in `server/src/`, server restarts automatically
2. **Frontend changes** - Edit files in `client/src/`, browser updates instantly
3. **Database changes** - Run `npm run db:push --workspace=server` after schema changes

### Debugging

- **Backend logs** - Check the terminal running `npm run dev`
- **Frontend errors** - Check browser console
- **Database issues** - Use `npm run db:studio` to inspect data
- **API testing** - Use the `/api` endpoint or tools like Postman/Insomnia

## 📚 Common Tasks

### Add a New API Endpoint

1. Create controller function in `server/src/controllers/`
2. Add route in `server/src/routes/`
3. Update types in `server/src/types/` and `client/src/types/`
4. Create API service function in `client/src/services/api.ts`

### Add a New Component

1. Create component file in `client/src/components/`
2. Import and use in parent component or App.tsx
3. Add TypeScript interfaces for props

### Modify Database Schema

1. Edit `server/prisma/schema.prisma`
2. Run: `npm run db:push --workspace=server`
3. Run: `npm run db:generate --workspace=server`
4. Update seed data in `server/prisma/seed.ts`
5. Restart backend server

### Add Form Validation

1. Install validation library: `npm install zod --workspace=client`
2. Create validation schemas in `client/src/schemas/`
3. Apply in form component
4. Add backend validation in controller

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Database Issues

```bash
# Reset database completely
npm run db:reset

# If that fails, delete the database file
rm server/prisma/dev.db
npm run db:setup
```

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm install
```

### Prisma Client Out of Sync

```bash
cd server
npm run db:generate
```

### TypeScript Errors

```bash
# Check for type errors
cd server && npm run build
cd client && npm run build
```

## 📖 Additional Documentation

- [Quick Reference Guide](docs/QUICK_REFERENCE.md) - Command cheat sheet
- [Interview Guide](docs/INTERVIEW_GUIDE.md) - Interview-specific tips
- [Server Documentation](server/README.md) - Backend API details
- [Client Documentation](client/README.md) - Frontend architecture

## 🤝 Contributing

This is a template project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use this template for interviews, learning, or commercial projects.

---

**Built with ❤️ for technical interviews and rapid prototyping**

Need help? Check the [troubleshooting section](#-troubleshooting) or open an issue.