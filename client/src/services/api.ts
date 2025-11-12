import axios from 'axios'
import { User, CreateUserDto, UpdateUserDto } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

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