import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const GuestConvert = () => {
  const { user, convertGuestToUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  if (!user?.isGuest) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await convertGuestToUser({ email: email.trim(), password })
      setShowForm(false)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to convert account')
    }
  }

  return (
    <div className="guest-banner">
      {!showForm ? (
        <div className="guest-info">
          <span>🎭 You're browsing as a guest</span>
          <button onClick={() => setShowForm(true)} className="btn-convert">
            Create Account to Save Your Polls
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="guest-convert-form">
          <h3>Create Your Account</h3>
          {error && <div className="error">{error}</div>}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Create Account
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default GuestConvert