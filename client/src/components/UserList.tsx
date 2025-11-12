import { User } from '../types'
import UserItem from './UserItem'

interface Props {
  users: User[]
  loading: boolean
  error: string | null
  onDelete: (id: number) => void
  onEdit: (user: User) => void
}

const UserList = ({ users, loading, error, onDelete, onEdit }: Props) => {
  if (loading) return <div className="loading">Loading users...</div>
  if (error) return <div className="error">{error}</div>
  if (users.length === 0) return <div className="empty">No users found</div>

  return (
    <div className="user-list">
      {users.map(user => (
        <UserItem 
          key={user.id} 
          user={user}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}

export default UserList