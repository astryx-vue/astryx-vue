export interface SourceLine {
  text: string
  start: number
  end: number
  newline: boolean
}

interface FenceMarker {
  char: string
  length: number
}

export function splitSourceLines(source: string): SourceLine[] {
  if (source.length === 0)
    return []

  const lines: SourceLine[] = []
  let start = 0
  for (let index = 0; index < source.length; index++) {
    if (source.charCodeAt(index) !== 10)
      continue
    const contentEnd = index > start && source.charCodeAt(index - 1) === 13 ? index - 1 : index
    lines.push({
      text: source.slice(start, contentEnd),
      start,
      end: index + 1,
      newline: true,
    })
    start = index + 1
  }
  if (start < source.length) {
    lines.push({
      text: source.slice(start),
      start,
      end: source.length,
      newline: false,
    })
  }
  return lines
}

function fenceOpener(text: string): FenceMarker | null {
  const indent = /^ {0,3}/.exec(text)
  const rest = text.slice(indent?.[0].length ?? 0)
  const markerMatch = /^(`{3,}|~{3,})/.exec(rest)
  if (markerMatch == null)
    return null
  const marker = markerMatch[1] ?? ''
  const info = rest.slice(marker.length)
  if (marker.startsWith('`') && info.includes('`'))
    return null
  const char = marker[0]
  if (char == null)
    return null
  return { char, length: marker.length }
}

function isFenceClose(text: string, marker: FenceMarker): boolean {
  const match = /^ {0,3}([`~]+)[ \t]*$/.exec(text)
  if (match == null)
    return false
  const closing = match[1] ?? ''
  return closing.length >= marker.length && [...closing].every(char => char === marker.char)
}

function isAtxHeading(text: string): boolean {
  return /^ {0,3}#{1,6}(?:[ \t]|$)/.test(text)
}

function isThematicBreak(text: string): boolean {
  return /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/.test(text)
}

function isSetextUnderline(text: string): boolean {
  return /^ {0,3}(?:=+|-+)[ \t]*$/.test(text)
}

function isListItem(text: string): boolean {
  return /^ {0,3}(?:[-+*]|\d{1,9}[.)])[ \t]/.test(text)
}

function isBlockquote(text: string): boolean {
  return /^ {0,3}>/.test(text)
}

function isBlank(text: string): boolean {
  return /^[ \t]*$/.test(text)
}

function isIndented(text: string): boolean {
  return /^[ \t]+\S/.test(text)
}

function continuesList(text: string): boolean {
  return isListItem(text) || isIndented(text)
}

function continuesQuote(text: string): boolean {
  return isBlockquote(text) || isIndented(text)
}

function hasUnsettledParagraph(lines: SourceLine[], index: number, settled: number): boolean {
  const previous = lines[index - 1]
  if (previous == null || isBlank(previous.text) || settled > previous.start)
    return false
  if (isAtxHeading(previous.text) || isListItem(previous.text) || isBlockquote(previous.text))
    return false
  if (isThematicBreak(previous.text) || fenceOpener(previous.text) != null)
    return false
  return true
}

/**
 * End index of the prefix whose blocks can no longer change if text is only
 * appended. The last open block stays after this index and is re-parsed.
 * The index never moves backwards as `source` grows by appending.
 */
export function findSettledEnd(source: string): number {
  const lines = splitSourceLines(source)
  let settled = 0
  let container: 'top' | 'list' | 'quote' = 'top'
  let fence: FenceMarker | null = null

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (line == null || !line.newline)
      return settled

    if (fence != null) {
      if (isFenceClose(line.text, fence)) {
        fence = null
        if (container === 'top')
          settled = line.end
      }
      continue
    }

    const opener = fenceOpener(line.text)
    if (opener != null) {
      fence = opener
      continue
    }

    if (container === 'top' && isAtxHeading(line.text)) {
      settled = line.end
      continue
    }

    if (container === 'top' && isSetextUnderline(line.text) && hasUnsettledParagraph(lines, index, settled)) {
      settled = line.end
      continue
    }

    if (container === 'top' && isThematicBreak(line.text)) {
      settled = line.end
      continue
    }

    if (isBlank(line.text)) {
      const next = lines[index + 1]
      if (next == null || !next.newline)
        return settled
      if (container === 'list' && continuesList(next.text))
        continue
      if (container === 'quote' && continuesQuote(next.text))
        continue
      container = 'top'
      settled = line.end
      continue
    }

    if (container === 'top' && isListItem(line.text)) {
      container = 'list'
      continue
    }

    if (container === 'top' && isBlockquote(line.text)) {
      container = 'quote'
    }
  }

  return settled
}

/** True when a fenced code block has been opened and not closed. */
export function hasOpenFence(source: string): boolean {
  const lines = splitSourceLines(source)
  let fence: FenceMarker | null = null
  for (const line of lines) {
    if (!line.newline)
      return fence != null || fenceOpener(line.text) != null
    if (fence != null) {
      if (isFenceClose(line.text, fence))
        fence = null
      continue
    }
    const opener = fenceOpener(line.text)
    if (opener != null)
      fence = opener
  }
  return fence != null
}
