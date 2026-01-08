// App State
export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'English' | 'Tamil' | 'Hindi' | 'French' | 'German' | 'Spanish'
export type LearningMode = 'Simple Learn' | 'Deep Dive' | 'Quick Quiz' | 'Interactive' | 'Video Lecture'
export type AppTone = '#6366f1' | '#8b5cf6' | '#ec4899' | '#22c55e' | '#f59e0b' | '#1f2937'

export interface AppState {
  theme: ThemeMode
  language: Language
  mode: LearningMode
  appTone: AppTone
}

// User Profile
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: number
  preferences: {
    theme: ThemeMode
    language: Language
    mode: LearningMode
    appTone: AppTone
  }
  profile: {
    fullName: string
    preferredName: string
    standard: string
    dob: string
    country: string
    interests: string[]
  }
}

// Chat & Content
export interface ChatMessage {
  id: string
  prompt: string
  response: string
  videoUrl?: string
  createdAt: number
  language: Language
  mode: LearningMode
}

export interface StreamChunk {
  content: string
  isComplete: boolean
}

// API
export interface APIRequest {
  prompt: string
  language?: Language
  mode?: LearningMode
  tone?: AppTone
}

export interface APIResponse {
  success: boolean
  data?: string
  error?: string
  videoUrl?: string
}

// Components
export interface VideoPlayerProps {
  src: string
  title: string
  thumbnail?: string
  onShare?: (url: string) => void
  onDownload?: (url: string) => void
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export interface InputProps {
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}