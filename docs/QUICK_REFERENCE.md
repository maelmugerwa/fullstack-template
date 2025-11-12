# 📖 Quick Reference Guide

One-page cheat sheet for the Fullstack Interview Template.

## ⚡ Quick Start

```bash
npm install              # Install all dependencies
npm run db:setup        # Setup database with sample data
npm run dev             # Start both servers
```

**URLs:**
- Frontend: http://localhost:5173 (User Directory)
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
| GET | `/users` | - |
| GET | `/users/:id` | - |
| POST | `/users` | `{ name, email }` |
| PUT | `/users/:id` | `{ name?, email? }` |
| DELETE | `/users/:id` | - |

### Quick Test Commands

```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'

# Delete a user
curl -X DELETE http://localhost:3000/api/users/1
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
- **Routes**: `server/src/routes/users.ts`
- **Controllers**: `server/src/controllers/userController.ts`
- **DB Schema**: `server/prisma/schema.prisma`
- **Seed Data**: `server/prisma/seed.ts`
- **Types**: `server/src/types/index.ts`
- **Main App**: `server/src/app.ts`
- **Entry**: `server/src/index.ts`

### Frontend Files
- **Main App**: `client/src/App.tsx`
- **Components**: `client/src/components/`
- **Hooks**: `client/src/hooks/useUsers.ts`
- **API Service**: `client/src/services/api.ts`
- **Types**: `client/src/types/index.ts`

## 🎤 Interview Talking Points

### 1-Minute Pitch
> "This is a production-ready fullstack TypeScript template with React, Express, Prisma, and SQLite. It demonstrates CRUD operations on a User Directory, proper separation of concerns with controllers and services, type-safe API boundaries, and modern React patterns with custom hooks. The entire stack is containerized in a monorepo and ready to run in seconds."

### Architecture Highlights
1. **Type Safety**: TypeScript across frontend, backend, and database
2. **Separation of Concerns**: Controllers → Routes → Services pattern
3. **Custom Hooks**: React state management with `useUsers`
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

1. Add controller function in `server/src/controllers/userController.ts`:
```typescript
export const getUsersByDomain = async (req: Request, res: Response) => {
  const { domain } = req.params;
  const users = await prisma.user.findMany({ 
    where: { email: { endsWith: `@${domain}` } } 
  });
  res.json({ success: true, data: users });
};
```

2. Add route in `server/src/routes/users.ts`:
```typescript
router.get('/domain/:domain', getUsersByDomain);
```

### Add New Component (3 min)

1. Create `client/src/components/UserStats.tsx`:
```typescript
interface Props {
  total: number;
}

export default function UserStats({ total }: Props) {
  return (
    <div className="stats">
      <p>Total Users: {total}</p>
    </div>
  );
}
```

2. Use in `App.tsx`:
```typescript
import UserStats from './components/UserStats';
// In render:
<UserStats total={users.length} />
```

### Modify Database Schema (2 min)

1. Edit `server/prisma/schema.prisma`:
```prisma
model User {
  // ... existing fields
  phone     String?  // Add new field
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