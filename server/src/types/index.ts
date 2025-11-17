// User types
export interface User {
  id: number
  name: string
  email: string
  password?: string
  isGuest: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDto {
  name: string
  email: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
}

// Auth types
export interface RegisterDto {
  name: string
  email: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface GuestDto {
  name: string
}

export interface ConvertGuestDto {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  token: string
}

export interface JwtPayload {
  userId: number
  email: string
  isGuest: boolean
}

// Poll types
export interface Poll {
  id: number
  question: string
  authorId: number
  author?: User
  options: PollOption[]
  votes?: Vote[]
  createdAt: Date
  updatedAt: Date
}

export interface PollOption {
  id: number
  text: string
  pollId: number
  votes?: Vote[]
  voteCount?: number
  createdAt: Date
}

export interface Vote {
  id: number
  userId: number
  pollId: number
  optionId: number
  createdAt: Date
}

export interface CreatePollDto {
  question: string
  options: string[] // Array of option texts
}

export interface UpdatePollDto {
  question?: string
  options?: string[]
}

export interface VoteDto {
  optionId: number
}

export interface PollWithResults extends Poll {
  totalVotes: number
  userVote?: Vote
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}