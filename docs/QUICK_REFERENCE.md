# 📖 Quick Reference Guide

One-page cheat sheet for the Fullstack Interview Template.

## ⚡ Quick Start

```bash
npm install              # Install all dependencies
npm run db:setup        # Setup database with sample data
npm run dev             # Start both servers
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api
- Prisma Studio: http://localhost:5555 (run `npm run db:studio`)

## 🎯 Most Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset & reseed database |

## 🔌 API Endpoints Quick Reference

**Base URL:** `http://localhost:3000/api`

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/tasks` | - |
| GET | `/tasks/:id` | - |
| POST | `/tasks` | `{ title, description? }` |
| PUT | `/tasks/:id` | `{ title?, description?, completed? }` |
| DELETE | `/tasks/:id` | - |

### Quick Test Commands

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing API"}'

# Update task (mark as complete)
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/1
```

## 💾 Prisma Commands

```bash
# Database operations (from root or cd server)
npm run db:generate     # Generate Prisma Client
npm run db:push         # Push schema changes to DB
npm run db:migrate      # Create migration
npm run db:seed         # Seed sample data
npm run db:studio       # Open Prisma Studio GUI

# Reset everything
npm run db:reset        # From root
# OR
cd server && rm -rf prisma/dev.db && npm run db:push && npm run db:seed
```

## 📂 Key File Locations

### Backend Files
- **Routes**: `server/src/routes/tasks.ts`
- **Controllers**: `server/src/controllers/taskController.ts`
- **DB Schema**: `server/prisma/schema.prisma`
- **Seed Data**: `server/prisma/seed.ts`
- **Types**: `server/src/types/index.ts`
- **Main App**: `server/src/app.ts`
- **Entry**: `server/src/index.ts`

### Frontend Files
- **Main App**: `client/src/App.tsx`
- **Components**: `client/src/components/`
- **Hooks**: `client/src/hooks/useTasks.ts`
- **API Service**: `client/src/services/api.ts`
- **Types**: `client/src/types/index.ts`

## 🎤 Interview Talking Points

### 1-Minute Pitch
> "This is a production-ready fullstack TypeScript template with React, Express, Prisma, and SQLite. It demonstrates CRUD operations, proper separation of concerns with controllers and services, type-safe API boundaries, and modern React patterns with custom hooks. The entire stack is containerized in a monorepo and ready to run in seconds."

### Architecture Highlights
1. **Type Safety**: TypeScript across frontend, backend, and database
2. **Separation of Concerns**: Controllers → Routes → Services pattern
3. **Custom Hooks**: React state management with `useTasks`
4. **Error Handling**: Centralized error middleware
5. **Hot Reload**: Instant feedback during development
6. **Zero Config DB**: SQLite with Prisma ORM

### Tech Decisions
- **Why SQLite?** Zero setup, perfect for demos and interviews
- **Why Prisma?** Type-safe database access, great DX
- **Why Vite?** Fastest dev server, optimized production builds
- **Why Monorepo?** Single install, unified TypeScript config

## 🚀 Adding Features (5-Minute Tasks)

### Add New API Endpoint (2 min)

1. Add controller function in `server/src/controllers/taskController.ts`:
```typescript
export const getCompletedTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({ where: { completed: true } });
  res.json({ success: true, data: tasks });
};
```

2. Add route in `server/src/routes/tasks.ts`:
```typescript
router.get('/completed', getCompletedTasks);
```

### Add New Component (3 min)

1. Create `client/src/components/TaskStats.tsx`:
```typescript
interface Props {
  total: number;
  completed: number;
}

export default function TaskStats({ total, completed }: Props) {
  return (
    <div className="stats">
      <p>Total: {total}</p>
      <p>Completed: {completed}</p>
      <p>Remaining: {total - completed}</p>
    </div>
  );
}
```

2. Use in `App.tsx`:
```typescript
import TaskStats from './components/TaskStats';
// In render:
<TaskStats total={tasks.length} completed={tasks.filter(t => t.completed).length} />
```

### Modify Database Schema (2 min)

1. Edit `server/prisma/schema.prisma`:
```prisma
model Task {
  // ... existing fields
  priority  String?  @default("medium")  // Add new field
}
```

2. Apply changes:
```bash
cd server
npm run db:push
npm run db:generate
```

## 🐛 Quick Fixes

### Port in Use
```bash
lsof -ti:3000 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend
```

### Database Issues
```bash
npm run db:reset               # Reset everything
# OR delete DB file:
rm server/prisma/dev.db && npm run db:setup
```

### Module Errors
```bash
rm -rf node_modules */node_modules
npm install
```

### Prisma Client Sync
```bash
cd server && npm run db:generate
```

## 📊 Project Stats

- **Setup Time**: < 2 minutes
- **Total Files**: ~30 source files
- **Lines of Code**: ~1,500 LOC
- **Dependencies**: 20 (production + dev)
- **Database**: 1 table (easily extensible)

## 🔗 Quick Links

- [Main README](../README.md)
- [Interview Guide](./INTERVIEW_GUIDE.md)
- [Server Docs](../server/README.md)
- [Client Docs](../client/README.md)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)

---

**💡 Tip**: Keep this page open in a browser tab during interviews for quick reference!