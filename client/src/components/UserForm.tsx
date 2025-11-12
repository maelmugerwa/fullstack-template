import { useState, useEffect } from 'react'
import { User, CreateUserDto } from '../types'

interface Props {
  onSubmit: (data: CreateUserDto) => Promise<void>
  initialData?: User
  onCancel?: () => void
}

const UserForm = ({ onSubmit, initialData, onCancel }: Props) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setEmail(initialData.email)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    await onSubmit({ name: name.trim(), email: email.trim() })
    
    if (!initialData) {
      setName('')
      setEmail('')
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit User' : 'Add New User'}</h2>
      
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <div className="form-actions">
        <button type="submit">{initialData ? 'Update' : 'Add'} User</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default UserForm