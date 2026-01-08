const API_KEY = import.meta.env.VITE_API_KEY
const TEXT_ENDPOINT = import.meta.env.VITE_API_ENDPOINT_TEXT
const IMAGE_ENDPOINT = import.meta.env.VITE_API_ENDPOINT_IMAGE
const VIDEO_ENDPOINT = import.meta.env.VITE_API_ENDPOINT_VIDEO
const VIDEO_MATH_ENDPOINT = import.meta.env.VITE_API_ENDPOINT_VIDEO_MATH

interface APIRequest {
  prompt: string
  language?: string
  mode?: string
  tone?: string
}

interface APIResponse {
  success: boolean
  data?: string
  error?: string
}

export async function* streamText(request: APIRequest): AsyncGenerator<string> {
  const body = JSON.stringify({
    ...request,
    apiKey: API_KEY,
  })

  try {
    const response = await fetch(TEXT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.content) yield data.content
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    if (buffer.startsWith('data: ')) {
      try {
        const data = JSON.parse(buffer.slice(6))
        if (data.content) yield data.content
      } catch {
        // Skip invalid JSON
      }
    }
  } catch (error) {
    throw new Error(`Stream error: ${error instanceof Error ? error.message : 'Unknown'}`)
  }
}

export async function generateImage(request: APIRequest): Promise<string> {
  const body = JSON.stringify({
    ...request,
    apiKey: API_KEY,
  })

  const response = await fetch(IMAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.imageUrl || ''
}

export async function generateVideo(request: APIRequest): Promise<string> {
  const body = JSON.stringify({
    ...request,
    apiKey: API_KEY,
  })

  const response = await fetch(VIDEO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.videoUrl || ''
}

export async function generateMathVideo(request: APIRequest): Promise<string> {
  const body = JSON.stringify({
    ...request,
    apiKey: API_KEY,
  })

  const response = await fetch(VIDEO_MATH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.videoUrl || ''
}