/**
 * @file lineParts.ts
 * @input One line's text, its syntax tokens, and the changed character ranges
 * @output CodeGroup[]: the line cut into syntax spans, with adjacent changed
 *   spans grouped under one inline-highlight wrapper
 * @position Lab helper used by DiffViewer's code cells
 */

import type { SyntaxToken } from '@astryx-vue/core'
import type { InlineRange } from './inlineDiff.js'

/** One contiguous slice of a line, carrying at most one syntax token type. */
export interface CodePart {
  text: string
  type: string | null
  changed: boolean
}

/** Adjacent parts with the same changed state, rendered as one run. */
export interface CodeGroup {
  changed: boolean
  parts: CodePart[]
}

interface Piece {
  start: number
  end: number
  type: string | null
  changed: boolean
}

/**
 * Cut a line at every syntax-token and inline-highlight boundary, so each
 * piece carries one token type and one changed/unchanged state.
 */
function buildPieces(text: string, tokens: SyntaxToken[], emphasis: readonly InlineRange[]): Piece[] {
  const segments: Array<{ start: number, end: number, type: string | null }> = []
  let cursor = 0

  for (const token of tokens) {
    const start = Math.max(token.start, cursor)
    const end = Math.min(token.end, text.length)

    if (start > cursor)
      segments.push({ start: cursor, end: start, type: null })

    if (end > start)
      segments.push({ start, end, type: token.type })

    cursor = Math.max(cursor, end)
  }

  if (cursor < text.length)
    segments.push({ start: cursor, end: text.length, type: null })

  const cuts = new Set<number>()
  for (const [start, end] of emphasis) {
    cuts.add(start)
    cuts.add(end)
  }

  const isChanged = (offset: number): boolean => emphasis.some(([start, end]) => offset >= start && offset < end)
  const pieces: Piece[] = []

  for (const segment of segments) {
    let start = segment.start

    for (let offset = segment.start + 1; offset < segment.end; offset++) {
      if (cuts.has(offset)) {
        pieces.push({ start, end: offset, type: segment.type, changed: isChanged(start) })
        start = offset
      }
    }

    pieces.push({ start, end: segment.end, type: segment.type, changed: isChanged(start) })
  }

  return pieces
}

/**
 * Group a line into runs that DiffViewer can render without extra wrappers:
 * unchanged runs keep their token spans, and adjacent changed pieces share one
 * `data-diff-change` element.
 */
export function buildLineGroups(text: string, tokens: SyntaxToken[], emphasis: readonly InlineRange[]): CodeGroup[] {
  if (text === '') {
    return [{ changed: false, parts: [{ text: '\u200B', type: null, changed: false }] }]
  }

  const pieces = buildPieces(text, tokens, emphasis)
  const groups: CodeGroup[] = []

  for (const piece of pieces) {
    const part: CodePart = {
      text: text.slice(piece.start, piece.end),
      type: piece.type,
      changed: piece.changed,
    }
    const last = groups[groups.length - 1]

    if (last != null && last.changed === piece.changed) {
      last.parts.push(part)
      continue
    }

    groups.push({ changed: piece.changed, parts: [part] })
  }

  return groups
}
