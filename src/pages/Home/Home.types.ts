export interface ChatMessage {
  id: string
  prompt: string
  response: string
  videoUrl?: string
  createdAt: number
}

export interface StreamState {
  loading: boolean
  error: string | null
  response: string
}
