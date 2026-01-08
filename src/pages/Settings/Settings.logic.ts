import { updateUserPreferences } from '../../services/firestore.service'

export async function saveSettingsToFirestore(
  userId: string,
  settings: {
    theme?: string
    language?: string
    appTone?: string
  }
) {
  try {
    await updateUserPreferences(userId, settings as any)
    return true
  } catch (error) {
    console.error('Failed to save settings:', error)
    return false
  }
}

export function loadSettingsFromCache() {
  return {
    theme: localStorage.getItem('theme') || 'system',
    language: localStorage.getItem('language') || 'English',
    appTone: localStorage.getItem('appTone') || '#6366f1',
  }
}

export function saveSettingsToCache(settings: Record<string, string>) {
  Object.entries(settings).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })
}
