import katex from 'katex'

export function renderLatex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
    })
  } catch (error) {
    console.error('LaTeX render error:', error)
    return latex
  }
}

export function renderDisplayLatex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    })
  } catch (error) {
    console.error('LaTeX render error:', error)
    return latex
  }
}

export function extractLatexExpressions(text: string): string[] {
  const inlineRegex = /$([^$]+)$/g
  const displayRegex = /$$([^$]+)$$/g

  const inlineMatches = [...text.matchAll(inlineRegex)].map((m) => m[1])
  const displayMatches = [...text.matchAll(displayRegex)].map((m) => m[1])

  return [...inlineMatches, ...displayMatches]
}

export function processLatexInText(text: string): string {
  let result = text

  // Display math ($$...$$ or [...])
  result = result.replace(/$$(.+?)$$/gs, (match, latex) => {
    return `<div class="math-display">${renderDisplayLatex(latex)}</div>`
  })

  // Inline math ($...$ or (...))
  result = result.replace(/$(.+?)$/g, (match, latex) => {
    return `<span class="math-inline">${renderLatex(latex)}</span>`
  })

  return result
}