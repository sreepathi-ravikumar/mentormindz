import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import { initializeFirebase } from './bootstrap'
import Router from './router'

export default function App() {
  useEffect(() => {
    initializeFirebase()
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Router />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}