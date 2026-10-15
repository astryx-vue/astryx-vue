/** How a unified-diff line reads: what it adds, removes, frames, or keeps. */
export type DiffLineKind = 'added' | 'removed' | 'header' | 'context'

export interface DiffLines {
  kinds: DiffLineKind[]
  glyphs: string[]
  content: string[]
}

/**
 * Read a fence info string the way a diff layer does.
 * `diff` is the layer over plaintext. `diff-<lang>` is the layer over that
 * language. Anything else, including `patch`, is just a language name.
 */
export function parseFenceLanguage(info: string | undefined): {
  language: string
  isDiff: boolean
} {
  const value = (info ?? '').trim()
  if (value === 'diff')
    return { language: 'plaintext', isDiff: true }

  const layered = /^diff-(.+)$/.exec(value)
  if (layered?.[1] != null)
    return { language: layered[1], isDiff: true }

  return { language: value || 'plaintext', isDiff: false }
}

/**
 * Split a diff into the glyph column and the code the base language sees.
 * Added, removed, and space-led context lines lose their first character.
 * A context line with no leading space keeps all of it. Header lines
 * contribute an empty line so token offsets stay per line; the renderer
 * paints those rows from the original text.
 */
export function splitDiffLines(lines: readonly string[]): DiffLines {
  const kinds: DiffLineKind[] = []
  const glyphs: string[] = []
  const content: string[] = []
  const fileHeaders = fileHeaderLines(lines)

  lines.forEach((line, index) => {
    const kind = diffLineKind(line, fileHeaders.has(index))
    kinds.push(kind)
    if (kind === 'header') {
      glyphs.push('')
      content.push('')
    }
    else if (kind === 'context' && !line.startsWith(' ')) {
      glyphs.push('')
      content.push(line)
    }
    else {
      glyphs.push(line.slice(0, 1))
      content.push(line.slice(1))
    }
  })

  return { kinds, glyphs, content }
}

/**
 * Classify one line by its first character.
 * `+` is added, `-` is removed, `@@` is a hunk header. A `--- ` line
 * directly followed by a `+++ ` line and then an `@@` line is a file header
 * wherever it occurs. Every other `---` or `+++` line is a change, so
 * `---i;` is never mistaken for a header.
 */
export function diffLineKind(line: string, isFileHeader = false): DiffLineKind {
  if (line.startsWith('@@') || isFileHeader)
    return 'header'
  if (line.startsWith('+'))
    return 'added'
  if (line.startsWith('-'))
    return 'removed'
  return 'context'
}

/** Indexes of the `--- ` / `+++ ` pair that sits directly before an `@@` line. */
export function fileHeaderLines(lines: readonly string[]): Set<number> {
  const headers = new Set<number>()
  for (let index = 0; index + 2 < lines.length; index++) {
    const current = lines[index] ?? ''
    const next = lines[index + 1] ?? ''
    const after = lines[index + 2] ?? ''
    if (current.startsWith('--- ') && next.startsWith('+++ ') && after.startsWith('@@')) {
      headers.add(index)
      headers.add(index + 1)
    }
  }
  return headers
}
