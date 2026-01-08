export interface ProfileData {
  fullName: string
  preferredName: string
  standard: string
  dob: string
  country: string
  interests: string[]
}

export interface ProfileState {
  loading: boolean
  saving: boolean
  error: string | null
}
