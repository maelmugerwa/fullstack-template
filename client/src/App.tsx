import { useAuth } from './contexts/AuthContext'
import { usePolls } from './hooks/usePolls'
import Auth from './components/Auth'
import GuestConvert from './components/GuestConvert'
import PollForm from './components/PollForm'
import PollDisplay from './components/PollDisplay'
import './App.css'

function App() {
  const { user, loading: authLoading, logout } = useAuth()
  const { polls, loading: pollsLoading, createPoll, vote, deletePoll } = usePolls()

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1>🗳️ Poll App</h1>
          <div className="user-info">
            <span>👤 {user.name}</span>
            {user.isGuest && <span className="guest-badge">Guest</span>}
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <GuestConvert />
      
      <main>
        <PollForm onSubmit={createPoll} />
        
        <div className="polls-section">
          <h2>Active Polls</h2>
          {pollsLoading ? (
            <div className="loading">Loading polls...</div>
          ) : (
            <PollDisplay 
              polls={polls} 
              onVote={vote}
              onDelete={deletePoll}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App