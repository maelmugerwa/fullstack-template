import { useState, useEffect } from 'react'
import { User, CreateUserDto, UpdateUserDto } from '../types'
import * as api from '../services/api'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.getUsers()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (userData: CreateUserDto) => {
    try {
      const newUser = await api.createUser(userData)
      setUsers([newUser, ...users])
    } catch (err) {
      setError('Failed to create user')
      throw err
    }
  }

  const updateUser = async (id: number, userData: UpdateUserDto) => {
    try {
      const updatedUser = await api.updateUser(id, userData)
      setUsers(users.map(u => u.id === id ? updatedUser : u))
    } catch (err) {
      setError('Failed to update user')
      throw err
    }
  }

  const removeUser = async (id: number) => {
    try {
      await api.deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      setError('Failed to delete user')
      throw err
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, error, addUser, updateUser, removeUser, fetchUsers }
}