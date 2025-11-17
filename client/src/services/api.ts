import axios from 'axios'
import { 
  User, CreateUserDto, UpdateUserDto,
  RegisterDto, LoginDto, GuestDto, ConvertGuestDto, AuthResponse,
  Poll, CreatePollDto, UpdatePollDto, VoteDto
} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// User endpoints (existing)
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users')
  return data.users
}

export const getUserById = async (id: number): Promise<User> => {
  const { data } = await api.get(`/users/${id}`)
  return data.user
}

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const { data } = await api.post('/users', userData)
  return data.user
}

export const updateUser = async (id: number, userData: UpdateUserDto): Promise<User> => {
  const { data } = await api.put(`/users/${id}`, userData)
  return data.user
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`)
}

// Auth endpoints
export const register = async (credentials: RegisterDto): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', credentials)
  return data
}

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export const createGuest = async (guestData: GuestDto): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/guest', guestData)
  return data
}

export const convertGuest = async (conversionData: ConvertGuestDto): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/convert-guest', conversionData)
  return data
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/auth/me')
  return data.user
}

// Poll endpoints
export const getPolls = async (): Promise<Poll[]> => {
  const { data } = await api.get('/polls')
  return data.polls
}

export const getPollById = async (id: number): Promise<Poll> => {
  const { data } = await api.get(`/polls/${id}`)
  return data.poll
}

export const createPoll = async (pollData: CreatePollDto): Promise<Poll> => {
  const { data } = await api.post('/polls', pollData)
  return data.poll
}

export const updatePoll = async (id: number, pollData: UpdatePollDto): Promise<Poll> => {
  const { data } = await api.put(`/polls/${id}`, pollData)
  return data.poll
}

export const voteOnPoll = async (pollId: number, voteData: VoteDto): Promise<void> => {
  await api.post(`/polls/${pollId}/vote`, voteData)
}

export const deletePoll = async (id: number): Promise<void> => {
  await api.delete(`/polls/${id}`)
}