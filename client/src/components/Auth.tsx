import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Auth = () => {
  const { register, login, loginAsGuest } = useAuth()
  const [mode, setMode] = useState<'login' | 'register' | 'guest'>('guest')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (mode === 'guest') {
        if (!name.trim()) throw new Error('Name is required')
        await loginAsGuest({ name: name.trim() })
      } else if (mode === 'login') {
        if (!email.trim() || !password) throw new Error('Email and password are required')
        await login({ email: email.trim(), password })
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password) {
          throw new Error('All fields are required')
        }
        await register({ name: name.trim(), email: email.trim(), password })
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Authentication failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🗳️ Poll App</h1>
        
        <div className="auth-tabs">
          <button 
            className={mode === 'guest' ? 'active' : ''}
            onClick={() => setMode('guest')}
          >
            Quick Start
          </button>
          <button 
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button 
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error">{error}</div>}
          
          {(mode === 'register' || mode === 'guest') && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          
          {(mode === 'login' || mode === 'register') && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          
          {(mode === 'login' || mode === 'register') && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          <button type="submit" className="btn-primary">
            {mode === 'guest' ? 'Continue as Guest' : 
             mode === 'login' ? 'Login' : 'Register'}
          </button>

          {mode === 'guest' && (
            <p className="auth-hint">
              Start voting right away! You can register later to save your polls.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Auth