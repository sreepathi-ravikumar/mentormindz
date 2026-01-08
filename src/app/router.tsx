import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Home from '../pages/Home/Home.page'
import Login from '../pages/Login/Login.page'
import SignUp from '../pages/SignUp/SignUp.page'
import Profile from '../pages/Profile/Profile.page'
import Settings from '../pages/Settings/Settings.page'

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  return <>{element}</>
}

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}