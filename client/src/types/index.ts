export interface User {
  id: number
  name: string
  email: string
  isGuest: boolean
  createdAt: string
  updatedAt: string
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
  user: User
  token: string
}

// Poll types
export interface PollOption {
  id: number
  text: string
  pollId: number
  voteCount: number
  createdAt: string
}

export interface Poll {
  id: number
  question: string
  authorId: number
  author?: User
  options: PollOption[]
  totalVotes: number
  userVote?: Vote | null
  createdAt: string
  updatedAt: string
}

export interface Vote {
  id: number
  userId: number
  pollId: number
  optionId: number
  createdAt: string
}

export interface CreatePollDto {
  question: string
  options: string[]
}

export interface UpdatePollDto {
  question?: string
  options?: string[]
}

export interface VoteDto {
  optionId: number
}

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  error?: string
}