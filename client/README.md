# 🎨 Client Documentation

Frontend documentation for the Fullstack Interview Template.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Components](#components)
6. [Custom Hooks](#custom-hooks)
7. [API Service Layer](#api-service-layer)
8. [State Management](#state-management)
9. [Type System](#type-system)
10. [Styling](#styling)
11. [Adding New Features](#adding-new-features)

## Overview

The frontend is a React 18 application built with TypeScript and Vite. It demonstrates modern React patterns including custom hooks, component composition, and clean separation between UI and business logic.

**Key Features:**
- ✅ React 18 with hooks
- ✅ TypeScript for type safety
- ✅ Custom hooks for state management
- ✅ Component composition
- ✅ API service layer abstraction
- ✅ Optimistic updates
- ✅ Error handling and loading states
- ✅ Hot Module Replacement (HMR)

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI library | ^18.2.0 |
| TypeScript | Type safety | ^5.2.2 |
| Vite | Build tool & dev server | ^5.0.8 |
| Axios | HTTP client | ^1.6.0 |
| ESLint | Linting | ^8.55.0 |

## Project Structure

```
client/
├── public/
│   └── vite.svg           # Static assets
│
├── src/
│   ├── components/        # React components
│   │   ├── TaskForm.tsx   # Form for creating/editing tasks
│   │   ├── TaskItem.tsx   # Individual task display
│   │   └── TaskList.tsx   # Task list container
│   │
│   ├── hooks/
│   │   └── useTasks.ts    # Custom hook for task state
│   │
│   ├── services/
│   │   └── api.ts         # API client and methods
│   │
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces
│   │
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   └── main.tsx           # Application entry point
│
├── .env                   # Environment variables
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Getting Started

### Development

```bash
# From client directory
npm run dev              # Start Vite dev server

# From root directory
npm run dev              # Start both frontend and backend
```

The application will be available at http://localhost:5173 with HMR enabled.

### Production Build

```bash
npm run build            # Build for production
npm run preview          # Preview production build
```

### Linting

```bash
npm run lint             # Check for linting errors
```

## Components

### Component Architecture

The application follows a hierarchical component structure:

```
App
├── TaskForm (create/edit)
└── TaskList (display all tasks)
    └── TaskItem × n (individual task)
```

### App Component

**File:** [`App.tsx`](src/App.tsx)

**Purpose:** Root component that orchestrates the entire application.

**Responsibilities:**
- Manages form edit mode state
- Coordinates between TaskForm and TaskList
- Handles task operations (create, update, delete, toggle)

**Key Pattern:**
```typescript
function App() {
  const { tasks, addTask, updateTask, removeTask, toggleTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  
  // Component logic delegates to useTasks hook
  // UI state managed locally (editingTask)
}
```

### TaskForm Component

**File:** [`components/TaskForm.tsx`](src/components/TaskForm.tsx)

**Purpose:** Form for creating and editing tasks.

**Props:**
```typescript
interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  initialData?: { title: string; description?: string };
  onCancel?: () => void;
}
```

**Features:**
- Form validation (required title)
- Controlled inputs with local state
- Submitting state management
- Clear form after successful creation
- Edit mode support with initial data
- Cancel functionality for edit mode

**Usage Example:**
```typescript
// Create mode
<TaskForm onSubmit={handleCreateTask} />

// Edit mode
<TaskForm 
  onSubmit={handleUpdateTask}
  initialData={{ title: "Edit this", description: "..." }}
  onCancel={handleCancel}
/>
```

### TaskList Component

**File:** [`components/TaskList.tsx`](src/components/TaskList.tsx)

**Purpose:** Container component that renders a list of tasks.

**Props:**
```typescript
interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: { id: string; title: string; description?: string }) => void;
}
```

**Features:**
- Loading state display
- Empty state message
- Maps tasks to TaskItem components
- Passes event handlers down to children

**States:**
- **Loading:** Shows "Loading tasks..." message
- **Empty:** Shows "No tasks yet" message
- **Populated:** Renders TaskItem for each task

### TaskItem Component

**File:** [`components/TaskItem.tsx`](src/components/TaskItem.tsx)

**Purpose:** Displays a single task with actions.

**Props:**
```typescript
interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: { id: string; title: string; description?: string }) => void;
}
```

**Features:**
- Checkbox for completion toggle
- Edit and delete buttons
- Formatted timestamps
- Confirmation dialog for delete
- Conditional rendering (completed styling)
- Accessibility labels

**Layout:**
```
┌─────────────────────────────────────────────┐
│ ☐  Task Title               [Edit] [Delete] │
│    Task Description (if exists)             │
│    Created: Jan 1, 2024 · Updated: Jan 2    │
└─────────────────────────────────────────────┘
```

## Custom Hooks

### useTasks Hook

**File:** [`hooks/useTasks.ts`](src/hooks/useTasks.ts)

**Purpose:** Encapsulates all task-related state and operations.

**Interface:**
```typescript
interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (data: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}
```

**Features:**

1. **State Management:**
   - `tasks` - Array of tasks
   - `loading` - Loading state for async operations
   - `error` - Error message (null when no error)

2. **Operations:**
   - `fetchTasks()` - Fetch all tasks from API
   - `addTask()` - Create new task, prepend to list
   - `updateTask()` - Update task, replace in list
   - `removeTask()` - Delete task, remove from list
   - `toggleTask()` - Toggle completed status (optimistic update)

3. **Optimistic Updates:**
```typescript
// Update UI immediately
setTasks(prevTasks => 
  prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
);

// Make API call
await taskApi.updateTask(id, { completed: !task.completed });

// Revert on error
catch (err) {
  setTasks(prevTasks => 
    prevTasks.map(t => t.id === id ? { ...t, completed: task.completed } : t)
  );
}
```

**Usage:**
```typescript
import { useTasks } from './hooks/useTasks';

function MyComponent() {
  const { tasks, loading, error, addTask, toggleTask } = useTasks();
  
  // Use tasks and operations
}
```

**Benefits:**
- ✅ Encapsulates complex state logic
- ✅ Reusable across components
- ✅ Easy to test
- ✅ Consistent error handling
- ✅ Optimistic updates for better UX

## API Service Layer

**File:** [`services/api.ts`](src/services/api.ts)

### Axios Configuration

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,  // 10 seconds
});
```

### Error Interceptor

Transforms axios errors into user-friendly messages:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      throw new Error('Network error: Unable to connect to the server');
    }
    
    const errorData = error.response.data as any;
    const message = errorData?.error?.message || 'An unexpected error occurred';
    throw new Error(message);
  }
);
```

### Task API Methods

```typescript
export const taskApi = {
  // GET /api/tasks
  async getTasks(): Promise<Task[]>
  
  // GET /api/tasks/:id
  async getTaskById(id: string): Promise<Task>
  
  // POST /api/tasks
  async createTask(data: CreateTaskDto): Promise<Task>
  
  // PUT /api/tasks/:id
  async updateTask(id: string, data: UpdateTaskDto): Promise<Task>
  
  // DELETE /api/tasks/:id
  async deleteTask(id: string): Promise<void>
}
```

**Usage:**
```typescript
import { taskApi } from '../services/api';

// Get all tasks
const tasks = await taskApi.getTasks();

// Create task
const newTask = await taskApi.createTask({ 
  title: 'New Task',
  description: 'Description'
});

// Update task
const updated = await taskApi.updateTask('1', { completed: true });

// Delete task
await taskApi.deleteTask('1');
```

## State Management

### Pattern: Custom Hooks

This application uses the **Custom Hooks Pattern** for state management:

**Benefits:**
- No external state library needed
- Simple and lightweight
- Easy to understand
- Sufficient for most applications
- Easy to extend

**Architecture:**
```
Component (TaskForm)
    ↓ calls
useTasks Hook
    ↓ calls
API Service (taskApi)
    ↓ calls
Backend API
```

### State Flow Example

**Creating a Task:**
```typescript
// 1. User submits form
<TaskForm onSubmit={addTask} />

// 2. Hook updates local state
const addTask = async (data) => {
  const newTask = await taskApi.createTask(data);  // API call
  setTasks([newTask, ...tasks]);                    // Update state
};

// 3. Component re-renders with new task
{tasks.map(task => <TaskItem task={task} />)}
```

**Optimistic Update:**
```typescript
const toggleTask = async (id) => {
  // Update UI immediately
  setTasks(prevTasks => 
    prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  );
  
  try {
    await taskApi.updateTask(id, { completed: !task.completed });
  } catch (err) {
    // Revert on failure
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === id ? { ...t, completed: task.completed } : t)
    );
  }
};
```

## Type System

**File:** [`types/index.ts`](src/types/index.ts)

### Core Types

**Task Interface:**
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
```

**Data Transfer Objects (DTOs):**
```typescript
// Create - only user-provided fields
interface CreateTaskDto {
  title: string;
  description?: string;
  completed?: boolean;
}

// Update - all fields optional
interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

**API Response Types:**
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { message: string; details?: any };
  message?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Type Safety Benefits

1. **Compile-Time Checks:**
   ```typescript
   // ❌ TypeScript error
   const task: Task = { title: 'Test' };  // Missing required fields
   
   // ✅ Correct
   const task: Task = {
     id: '1',
     title: 'Test',
     description: null,
     completed: false,
     createdAt: new Date(),
     updatedAt: new Date()
   };
   ```

2. **IntelliSense Support:**
   - Autocomplete for object properties
   - Parameter hints
   - Type hints on hover

3. **Refactoring Safety:**
   - Rename symbol across files
   - Find all references
   - Catch breaking changes early

## Styling

### Approach

This template uses **vanilla CSS** with CSS variables for theming. No CSS framework to keep it simple and customizable.

**File:** [`App.css`](src/App.css)

### CSS Variables

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --border-radius: 8px;
  --spacing: 16px;
}
```

### Component Styling Pattern

Each component is styled with scoped class names:

```css
/* TaskForm styles */
.task-form { }
.form-group { }
.form-actions { }

/* TaskList styles */
.task-list { }
.task-list-empty { }
.task-list-loading { }

/* TaskItem styles */
.task-item { }
.task-item.completed { }
```

### Adding Styles

**Option 1: Extend App.css**
```css
.my-new-component {
  padding: var(--spacing);
  border-radius: var(--border-radius);
}
```

**Option 2: Component-Specific CSS**
```typescript
import './MyComponent.css';

export default function MyComponent() {
  return <div className="my-component">...</div>;
}
```

**Option 3: Add CSS Library**
```bash
# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Or styled-components
npm install styled-components
npm install -D @types/styled-components
```

## Adding New Features

### Add a New Component

**1. Create Component File** - `components/TaskStats.tsx`:
```typescript
interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;
  
  return (
    <div className="task-stats">
      <div className="stat">
        <span className="stat-label">Total:</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Completed:</span>
        <span className="stat-value">{completed}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Remaining:</span>
        <span className="stat-value">{remaining}</span>
      </div>
    </div>
  );
}
```

**2. Use in App:**
```typescript
import TaskStats from './components/TaskStats';

function App() {
  const { tasks } = useTasks();
  
  return (
    <div className="app">
      <TaskStats tasks={tasks} />
      {/* ... rest of app */}
    </div>
  );
}
```

**3. Add Styles** - in `App.css`:
```css
.task-stats {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}
```

### Add a New Hook

**1. Create Hook** - `hooks/useLocalStorage.ts`:
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

**2. Use in Component:**
```typescript
import { useLocalStorage } from '../hooks/useLocalStorage';

function MyComponent() {
  const [filter, setFilter] = useLocalStorage('taskFilter', 'all');
  // Filter persists across page reloads
}
```

### Add API Filtering

**1. Update API Service:**
```typescript
// In services/api.ts
export const taskApi = {
  // ... existing methods
  
  async getFilteredTasks(filter: 'all' | 'active' | 'completed'): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks?filter=${filter}`
    );
    return response.data.data || [];
  },
};
```

**2. Update Hook:**
```typescript
// In hooks/useTasks.ts
const fetchTasks = useCallback(async (filter?: string) => {
  const fetchedTasks = filter 
    ? await taskApi.getFilteredTasks(filter)
    : await taskApi.getTasks();
  setTasks(fetchedTasks);
}, []);
```

**3. Use in Component:**
```typescript
const { tasks, fetchTasks } = useTasks();
const [filter, setFilter] = useState('all');

useEffect(() => {
  fetchTasks(filter);
}, [filter, fetchTasks]);
```

### Add Form Validation

**Option 1: Manual Validation**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Validate
  const errors: string[] = [];
  if (!title.trim()) errors.push('Title is required');
  if (title.length > 200) errors.push('Title too long');
  
  if (errors.length > 0) {
    setError(errors.join(', '));
    return;
  }
  
  // Submit...
};
```

**Option 2: With Validation Library**
```bash
npm install zod
```

```typescript
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000).optional(),
});

const handleSubmit = async (data: CreateTaskDto) => {
  try {
    const validated = taskSchema.parse(data);
    await onSubmit(validated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      setError(err.errors[0].message);
    }
  }
};
```

## Best Practices

### Component Design

**1. Keep Components Small and Focused:**
```typescript
// ✅ Good - Single responsibility
function TaskTitle({ title }: { title: string }) {
  return <h3>{title}</h3>;
}

// ❌ Bad - Too many responsibilities
function TaskEverything({ task, onUpdate, onDelete, user, settings }) {
  // 100+ lines of code
}
```

**2. Use TypeScript Interfaces for Props:**
```typescript
// ✅ Good
interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  initialData?: { title: string; description?: string };
}

function TaskForm({ onSubmit, initialData }: TaskFormProps) { }

// ❌ Bad - No types
function TaskForm({ onSubmit, initialData }) { }
```

**3. Extract Reusable Logic to Hooks:**
```typescript
// ✅ Good - Reusable hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Use in multiple components
const debouncedSearch = useDebounce(searchTerm, 300);
```

### State Management

**1. Use useCallback for Functions:**
```typescript
// ✅ Good - Memoized
const addTask = useCallback(async (data: CreateTaskDto) => {
  // ...
}, []);

// ❌ Bad - New function on every render
const addTask = async (data: CreateTaskDto) => {
  // ...
};
```

**2. Avoid Prop Drilling:**
```typescript
// ✅ Good - Use custom hook
function TaskList() {
  const { tasks, toggleTask } = useTasks();
  return <>{tasks.map(task => <TaskItem task={task} onToggle={toggleTask} />)}</>;
}

// ❌ Bad - Passing through many levels
<TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} ... />
```

### Error Handling

**1. Display Errors to Users:**
```typescript
// ✅ Good
{error && <div className="error-message">{error}</div>}

// ❌ Bad - Silent failure
try { await addTask(data); } catch (err) { }
```

**2. Handle Loading States:**
```typescript
// ✅ Good
{loading ? <Spinner /> : <TaskList tasks={tasks} />}

// ❌ Bad - No loading indicator
<TaskList tasks={tasks} />
```

## Environment Variables

**File:** `.env`

```env
# API endpoint
VITE_API_URL=http://localhost:3000/api
```

**Access in Code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Note:** Vite requires `VITE_` prefix for environment variables.

## Advanced Patterns

### Debounced Search

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  useEffect(() => {
    // Only searches after 300ms of no typing
    if (debouncedSearch) {
      searchTasks(debouncedSearch);
    }
  }, [debouncedSearch]);
}
```

### Infinite Scroll

```typescript
function useInfiniteScroll(callback: () => void) {
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);
}

// Usage
function TaskList() {
  const [page, setPage] = useState(1);
  
  useInfiniteScroll(() => {
    setPage(prev => prev + 1);
  });
  
  useEffect(() => {
    loadMoreTasks(page);
  }, [page]);
}
```

### Context API (For Larger Apps)

```typescript
// Create context
const TaskContext = createContext<UseTasksReturn | null>(null);

// Provider
export function TaskProvider({ children }: { children: ReactNode }) {
  const taskState = useTasks();
  return <TaskContext.Provider value={taskState}>{children}</TaskContext.Provider>;
}

// Consumer hook
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within TaskProvider');
  return context;
}

// Usage
<TaskProvider>
  <App />
</TaskProvider>
```

## Testing

### Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**vite.config.ts:**
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

### Example Tests

**Test Component:**
```typescript
import { render, screen } from '@testing-library/react';
import TaskItem from './TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('renders task title', () => {
    render(<TaskItem task={mockTask} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
  
  it('calls onToggle when checkbox clicked', async () => {
    const onToggle = jest.fn();
    render(<TaskItem task={mockTask} onToggle={onToggle} onDelete={jest.fn()} onEdit={jest.fn()} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
```

**Test Hook:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';

describe('useTasks', () => {
  it('fetches tasks on mount', async () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tasks.length).toBeGreaterThan(0);
    });
  });
});
```

## Performance Optimization

### Memoization

```typescript
import { useMemo, memo } from 'react';

// Memoize expensive computations
function TaskList({ tasks }: { tasks: Task[] }) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tasks]);
  
  return <>{sortedTasks.map(task => <TaskItem task={task} />)}</>;
}

// Memoize components
const TaskItem = memo(({ task }: { task: Task }) => {
  return <div>{task.title}</div>;
});
```

### Code Splitting

```typescript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const TaskAnalytics = lazy(() => import('./components/TaskAnalytics'));

function App() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <TaskAnalytics />
    </Suspense>
  );
}
```

### Virtual Scrolling (For Large Lists)

```bash
npm install react-window
```

```typescript
import { FixedSizeList } from 'react-window';

function VirtualTaskList({ tasks }: { tasks: Task[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={tasks.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <TaskItem task={tasks[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

## Common Enhancements

### Add Search Filter

```typescript
function App() {
  const { tasks } = useTasks();
  const [search, setSearch] = useState('');
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);
  
  return (
    <>
      <input 
        type="text" 
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TaskList tasks={filteredTasks} />
    </>
  );
}
```

### Add Toast Notifications

```bash
npm install react-hot-toast
```

```typescript
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const addTask = async (data: CreateTaskDto) => {
    try {
      await taskApi.createTask(data);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };
  
  return (
    <>
      <Toaster position="top-right" />
      {/* ... app */}
    </>
  );
}
```

### Add Dark Mode

```typescript
function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
  }, [isDark]);
  
  return [isDark, setIsDark] as const;
}

// CSS
body.dark-mode {
  --background: #1a1a1a;
  --text-color: #ffffff;
}
```

## Debugging

### React DevTools

Install [React Developer Tools](https://react.dev/learn/react-developer-tools) browser extension.

**Features:**
- Inspect component tree
- View props and state
- Track re-renders
- Profile performance

### Console Logging

```typescript
// Debug hook state
useEffect(() => {
  console.log('Tasks updated:', tasks);
}, [tasks]);

// Debug API calls
const response = await taskApi.getTasks();
console.log('API Response:', response);
```

### Vite Debugging

```typescript
// vite.config.ts - Enable source maps
export default defineConfig({
  build: {
    sourcemap: true,
  },
});
```

## Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` directory (static files ready to deploy).

### Deploy Options

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy
```

**GitHub Pages:**
```json
// package.json
{
  "homepage": "https://username.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Environment Variables for Production

Create `.env.production`:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Related Documentation

- [Main README](../README.md)
- [Quick Reference](../docs/QUICK_REFERENCE.md)
- [Interview Guide](../docs/INTERVIEW_GUIDE.md)
- [Server Documentation](../server/README.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

**Need help?** Check the [main troubleshooting section](../README.md#-troubleshooting) or open an issue.