import { createContext, useState, useEffect, ReactNode } from 'react'

interface AppContextType {
  theme: 'light' | 'dark' | 'system'
  selectedLanguage: string
  selectedMode: string
  appTone: string
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setSelectedLanguage: (lang: string) => void
  setSelectedMode: (mode: string) => void
  setAppTone: (tone: string) => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedMode, setSelectedMode] = useState('Simple Learn')
  const [appTone, setAppTone] = useState('#6366f1')

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    const savedLanguage = localStorage.getItem('language')
    const savedMode = localStorage.getItem('mode')
    const savedTone = localStorage.getItem('appTone')

    if (savedTheme) setTheme(savedTheme)
    if (savedLanguage) setSelectedLanguage(savedLanguage)
    if (savedMode) setSelectedMode(savedMode)
    if (savedTone) setAppTone(savedTone)
  }, [])

  useEffect(() => {
    // Apply theme to document
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.body.classList.toggle('dark', prefersDark)
    } else {
      document.body.classList.toggle('dark', theme === 'dark')
    }

    // Apply app tone color
    document.documentElement.style.setProperty('--primary-color', appTone)

    // Save to localStorage
    localStorage.setItem('theme', theme)
    localStorage.setItem('appTone', appTone)
  }, [theme, appTone])

  useEffect(() => {
    localStorage.setItem('language', selectedLanguage)
  }, [selectedLanguage])

  useEffect(() => {
    localStorage.setItem('mode', selectedMode)
  }, [selectedMode])

  return (
    <AppContext.Provider
      value={{
        theme,
        selectedLanguage,
        selectedMode,
        appTone,
        setTheme,
        setSelectedLanguage,
        setSelectedMode,
        setAppTone,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}