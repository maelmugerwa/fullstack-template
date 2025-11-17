import { useState, useEffect } from 'react'
import { Poll, CreatePollDto, UpdatePollDto, VoteDto } from '../types'
import * as api from '../services/api'

export const usePolls = () => {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPolls = async () => {
    try {
      setLoading(true)
      const data = await api.getPolls()
      setPolls(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch polls')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createPoll = async (pollData: CreatePollDto) => {
    try {
      const newPoll = await api.createPoll(pollData)
      setPolls([newPoll, ...polls])
      return newPoll
    } catch (err) {
      setError('Failed to create poll')
      throw err
    }
  }

  const updatePoll = async (id: number, pollData: UpdatePollDto) => {
    try {
      const updatedPoll = await api.updatePoll(id, pollData)
      setPolls(polls.map(p => p.id === id ? updatedPoll : p))
      return updatedPoll
    } catch (err) {
      setError('Failed to update poll')
      throw err
    }
  }

  const vote = async (pollId: number, voteData: VoteDto) => {
    try {
      await api.voteOnPoll(pollId, voteData)
      // Refresh polls to get updated vote counts
      await fetchPolls()
    } catch (err) {
      setError('Failed to vote')
      throw err
    }
  }

  const deletePoll = async (id: number) => {
    try {
      await api.deletePoll(id)
      setPolls(polls.filter(p => p.id !== id))
    } catch (err) {
      setError('Failed to delete poll')
      throw err
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  return { polls, loading, error, createPoll, updatePoll, vote, deletePoll, fetchPolls }
}