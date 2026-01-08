import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleEmailSignup, handleGoogleSignup } from './SignUp.logic'
import styles from '../Login/Login.styles.module.css'

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await handleEmailSignup(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const onGoogleSignup = async () => {
    setError('')
    setLoading(true)

    try {
      await handleGoogleSignup()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🌍</div>
        </div>

        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Sign up to start learning</p>

        <button className={styles.googleBtn} onClick={onGoogleSignup} disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign up with Google
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className={styles.input}
          />

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <button className={styles.switchBtn} onClick={() => navigate('/login')}>
          Already have an account? Log In
        </button>
      </div>
    </div>
  )
}
