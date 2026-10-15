export interface RichPart {
  code: boolean
  text: string
}

/** Split prose that uses Markdown backticks into text and code runs. */
export function richText(value: string): RichPart[] {
  const parts: RichPart[] = []
  const pattern = /`([^`]+)`/g
  let cursor = 0
  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > cursor)
      parts.push({ code: false, text: value.slice(cursor, index) })
    parts.push({ code: true, text: match[1] ?? '' })
    cursor = index + match[0].length
  }
  if (cursor < value.length)
    parts.push({ code: false, text: value.slice(cursor) })
  return parts
}
