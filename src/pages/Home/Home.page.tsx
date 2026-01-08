import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import styles from './Home.styles.module.css'

export default function Home() {
  const { user } = useAuth()
  const { selectedLanguage, selectedMode } = useTheme()
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    // Streaming logic will be added in Home.logic.ts
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>MentorMindz AI</div>
        <div className={styles.userInfo}>
          {user?.displayName || user?.email}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.chatArea}>
          {response ? (
            <div className={styles.response}>
              <div dangerouslySetInnerHTML={{ __html: response }} />
            </div>
          ) : (
            <div className={styles.welcome}>
              <h1>Welcome to MentorMindz AI</h1>
              <p>Ask me anything about {selectedMode} in {selectedLanguage}</p>
            </div>
          )}
        </div>

        <form className={styles.inputForm} onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask your question..."
            disabled={loading}
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.sendBtn}>
            {loading ? '...' : '→'}
          </button>
        </form>
      </main>
    </div>
  )
}
