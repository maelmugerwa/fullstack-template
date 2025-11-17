import { Poll, VoteDto } from '../types'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  polls: Poll[]
  onVote: (pollId: number, voteData: VoteDto) => Promise<void>
  onDelete: (pollId: number) => Promise<void>
}

const PollDisplay = ({ polls, onVote, onDelete }: Props) => {
  const { user } = useAuth()

  const handleVote = async (pollId: number, optionId: number) => {
    try {
      await onVote(pollId, { optionId })
    } catch (err) {
      console.error('Vote failed:', err)
    }
  }

  const getPercentage = (voteCount: number, totalVotes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((voteCount / totalVotes) * 100)
  }

  if (polls.length === 0) {
    return <div className="empty">No polls yet. Create one to get started!</div>
  }

  return (
    <div className="polls-container">
      {polls.map(poll => {
        const hasVoted = !!poll.userVote
        const canDelete = user && poll.authorId === user.id

        return (
          <div key={poll.id} className="poll-card">
            <div className="poll-header">
              <h3>{poll.question}</h3>
              <div className="poll-meta">
                <span>by {poll.author?.name || 'Unknown'}</span>
                <span>•</span>
                <span>{poll.totalVotes} votes</span>
                {canDelete && (
                  <>
                    <span>•</span>
                    <button 
                      onClick={() => onDelete(poll.id)}
                      className="btn-delete-small"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="poll-options">
              {poll.options.map(option => {
                const percentage = getPercentage(option.voteCount, poll.totalVotes)
                const isUserVote = hasVoted && poll.userVote?.optionId === option.id

                return (
                  <div key={option.id} className="poll-option">
                    <button
                      onClick={() => handleVote(poll.id, option.id)}
                      className={`option-button ${isUserVote ? 'selected' : ''}`}
                      disabled={!user}
                    >
                      <div className="option-content">
                        <span className="option-text">{option.text}</span>
                        {hasVoted && (
                          <span className="option-stats">
                            {option.voteCount} ({percentage}%)
                          </span>
                        )}
                      </div>
                      {hasVoted && (
                        <div 
                          className="option-bar" 
                          style={{ width: `${percentage}%` }}
                        />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {!user && (
              <p className="poll-hint">Login to vote on this poll</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PollDisplay