import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export function parseMarkdown(markdown: string): string {
  try {
    return marked.parse(markdown) as string
  } catch (error) {
    console.error('Markdown parse error:', error)
    return markdown
  }
}

export function extractCodeBlocks(markdown: string): Array<{ lang: string; code: string }> {
  const codeBlockRegex = /```(w*)
([sS]*?)```/g
  const blocks: Array<{ lang: string; code: string }> = []

  let match
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      lang: match[1] || 'plaintext',
      code: match[2],
    })
  }

  return blocks
}

export function highlightCodeBlock(code: string, language: string): string {
  // Basic syntax highlighting without external library
  // In production, use Prism.js or highlight.js

  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'],
    python: ['def', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'class'],
  }

  let highlighted = code

  const langs = keywords[language.toLowerCase()] || []
  langs.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g')
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`)
  })

  return highlighted
}

export function sanitizeMarkdown(markdown: string): string {
  // Remove dangerous HTML but keep safe markdown
  return markdown
    .replace(/<script[^>]*>[sS]*?</script>/gi, '')
    .replace(/<iframe[^>]*>[sS]*?</iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onw+s*=/gi, '')
}