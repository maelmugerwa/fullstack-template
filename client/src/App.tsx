import { useState } from 'react'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { CreateTaskDto } from './types'

function App() {
  const { tasks, loading, error, addTask, updateTask, removeTask, toggleTask } = useTasks()
  const [editingTask, setEditingTask] = useState<{ id: string; title: string; description?: string } | null>(null)

  const handleCreateTask = async (data: CreateTaskDto) => {
    await addTask(data)
  }

  const handleUpdateTask = async (data: CreateTaskDto) => {
    if (editingTask) {
      await updateTask(editingTask.id, data)
      setEditingTask(null)
    }
  }

  const handleEditTask = (task: { id: string; title: string; description?: string }) => {
    setEditingTask(task)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Task Manager</h1>
        <p className="subtitle">Fullstack Interview Template</p>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="task-form-section">
            <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              initialData={editingTask || undefined}
              onCancel={editingTask ? handleCancelEdit : undefined}
            />
          </section>

          <section className="task-list-section">
            <h2>Tasks</h2>
            {error && <div className="error-message">{error}</div>}
            <TaskList
              tasks={tasks}
              loading={loading}
              onToggle={toggleTask}
              onDelete={removeTask}
              onEdit={handleEditTask}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App