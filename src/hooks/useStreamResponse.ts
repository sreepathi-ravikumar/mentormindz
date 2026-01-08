import { useState, useCallback } from 'react'

interface StreamOptions {
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: string
}

export function useStreamResponse() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stream = useCallback(async (url: string, options: StreamOptions = {}) => {
    setLoading(true)
    setError(null)
    setResponse('')

    try {
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let fullText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        fullText += chunk
        setResponse(fullText)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { response, loading, error, stream }
}