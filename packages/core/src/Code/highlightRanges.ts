import type { SyntaxToken, TokenLine } from './types.js'

interface HighlightRange {
  highlight: Highlight
  range: Range
}

interface HighlightHost {
  highlights: {
    get: (name: string) => Highlight | undefined
    set: (name: string, highlight: Highlight) => void
  }
}

/** Token types painted by the stylesheet, so they never need a generated rule. */
export const HIGHLIGHTED_TOKEN_TYPES = [
  'keyword',
  'string',
  'comment',
  'number',
  'function',
  'type',
  'tag',
  'attribute',
  'property',
  'operator',
  'constant',
  'punctuation',
  'variable',
] as const

const describedTypes = new Set<string>(HIGHLIGHTED_TOKEN_TYPES)
let dynamicStyles: HTMLStyleElement | null = null

/**
 * A custom tokenizer can return any token type. Paint it with its own token
 * variable, falling back to the code text color, by adding one rule for it.
 */
function describeTokenType(type: string): void {
  if (describedTypes.has(type))
    return

  describedTypes.add(type)

  if (typeof document === 'undefined')
    return

  if (dynamicStyles == null) {
    dynamicStyles = document.createElement('style')
    dynamicStyles.setAttribute('data-astryx-code-token-styles', '')
    document.head.appendChild(dynamicStyles)
  }

  const name = CSS.escape(`astryx-${type}`)
  const color = `var(${CSS.escape(`--astryx-code-syntax-${type}`)}, currentColor)`

  dynamicStyles.sheet?.insertRule(`.astryx-code-block code::highlight(${name}) { color: ${color}; }`)
}

function resolveHighlight(type: string): Highlight | null {
  if (typeof CSS === 'undefined')
    return null

  const highlights = (CSS as unknown as Partial<HighlightHost>).highlights

  if (highlights == null)
    return null

  describeTokenType(type)

  const name = `astryx-${type}`
  let highlight = highlights.get(name)

  if (highlight == null) {
    highlight = new Highlight()
    highlights.set(name, highlight)
  }

  return highlight
}

/**
 * The line's own text node. Conditional branches in a template can leave empty
 * text nodes beside the content, so take the first one that carries text.
 */
function findLineTextNode(line: Element): Text | null {
  for (const node of line.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && (node as Text).length > 0)
      return node as Text
  }

  return null
}

function addLineRanges(line: Element, tokens: SyntaxToken[], applied: HighlightRange[]): void {
  const text = findLineTextNode(line)

  if (text == null || tokens.length === 0)
    return

  const length = text.length

  for (const token of tokens) {
    if (token.start >= length || token.end <= 0)
      continue

    const highlight = resolveHighlight(token.type)

    if (highlight == null)
      return

    try {
      const range = new Range()
      range.setStart(text, Math.min(token.start, length))
      range.setEnd(text, Math.min(token.end, length))
      highlight.add(range)
      applied.push({ highlight, range })
    }
    catch {
      // A range the engine refuses simply keeps the code text color.
    }
  }
}

/**
 * Paint syntax tokens with the CSS Custom Highlight API, which leaves the code
 * text itself untouched. The returned function removes every range this call
 * added.
 */
export function applyHighlightRanges(codeElement: HTMLElement, tokenLines: TokenLine[]): () => void {
  const applied: HighlightRange[] = []
  const lines = codeElement.querySelectorAll('[data-line]')

  for (let i = 0; i < lines.length; i++) {
    const tokens = tokenLines[i]

    if (tokens != null && tokens.length > 0)
      addLineRanges(lines[i], tokens, applied)
  }

  return () => {
    for (const { highlight, range } of applied)
      highlight.delete(range)
  }
}
