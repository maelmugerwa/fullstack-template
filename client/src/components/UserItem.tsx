import { User } from '../types'

interface Props {
  user: User
  onDelete: (id: number) => void
  onEdit: (user: User) => void
}

const UserItem = ({ user, onDelete, onEdit }: Props) => {
  return (
    <div className="user-item">
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      <div className="user-actions">
        <button onClick={() => onEdit(user)}>Edit</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    </div>
  )
}

export default UserItem