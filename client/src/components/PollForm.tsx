import { useState } from 'react'
import { CreatePollDto } from '../types'

interface Props {
  onSubmit: (data: CreatePollDto) => Promise<any>
}

const PollForm = ({ onSubmit }: Props) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [error, setError] = useState('')

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedOptions = options.map(o => o.trim()).filter(o => o)
    
    if (!question.trim()) {
      setError('Question is required')
      return
    }
    
    if (trimmedOptions.length < 2) {
      setError('At least 2 options are required')
      return
    }

    try {
      await onSubmit({ question: question.trim(), options: trimmedOptions })
      setQuestion('')
      setOptions(['', ''])
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create poll')
    }
  }

  return (
    <form className="poll-form" onSubmit={handleSubmit}>
      <h2>Create New Poll</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      
      <div className="poll-options">
        <label>Options:</label>
        {options.map((option, index) => (
          <div key={index} className="option-input">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              required
            />
            {options.length > 2 && (
              <button 
                type="button" 
                onClick={() => removeOption(index)}
                className="btn-remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={addOption} className="btn-secondary">
          + Add Option
        </button>
        <button type="submit" className="btn-primary">
          Create Poll
        </button>
      </div>
    </form>
  )
}

export default PollForm