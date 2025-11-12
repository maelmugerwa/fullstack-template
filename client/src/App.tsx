import { useState } from 'react'
import { useUsers } from './hooks/useUsers'
import { User } from './types'
import UserForm from './components/UserForm'
import UserList from './components/UserList'
import './App.css'

function App() {
  const { users, loading, error, addUser, updateUser, removeUser } = useUsers()
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleAdd = async (data: { name: string; email: string }) => {
    await addUser(data)
  }

  const handleEdit = async (data: { name: string; email: string }) => {
    if (editingUser) {
      await updateUser(editingUser.id, data)
      setEditingUser(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this user?')) {
      await removeUser(id)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>👥 User Directory</h1>
      </header>
      
      <main>
        <UserForm 
          onSubmit={editingUser ? handleEdit : handleAdd}
          initialData={editingUser || undefined}
          onCancel={editingUser ? () => setEditingUser(null) : undefined}
        />
        
        <UserList 
          users={users}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onEdit={setEditingUser}
        />
      </main>
    </div>
  )
}

export default App