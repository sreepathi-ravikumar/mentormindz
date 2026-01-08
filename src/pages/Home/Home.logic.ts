import { streamText } from '../../services/api.client'
import { processLatexInText } from '../../utils/latex'
import { parseMarkdown } from '../../utils/markdown'

export async function handleStreamingResponse(
  prompt: string,
  language: string,
  mode: string,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
) {
  try {
    let fullResponse = ''

    for await (const chunk of streamText({ prompt, language, mode })) {
      fullResponse += chunk
      
      // Process markdown and LaTeX
      const processed = processLatexInText(parseMarkdown(fullResponse))
      onChunk(processed)
    }

    onComplete()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    onError(message)
  }
}

export function saveToHistory(prompt: string, response: string, userId: string) {
  const history = localStorage.getItem('chatHistory') || '[]'
  const parsed = JSON.parse(history)
  
  parsed.push({
    id: Date.now().toString(),
    prompt,
    response,
    userId,
    createdAt: Date.now(),
  })

  localStorage.setItem('chatHistory', JSON.stringify(parsed))
}

export function loadHistory(userId: string) {
  const history = localStorage.getItem('chatHistory') || '[]'
  const parsed = JSON.parse(history)
  
  return parsed.filter((item: any) => item.userId === userId)
}
