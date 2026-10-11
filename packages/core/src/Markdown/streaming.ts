export interface TextSegment {
  /** Stable for the lifetime of this slice. Eviction merges text into `settled-*`. */
  key: string
  text: string
  fading: boolean
}

/**
 * Record the previous rendered length as a fade boundary.
 * The list stays capped at `maxSpans`; text before the oldest boundary is settled.
 * The same array is returned when nothing moved.
 */
export function computeBoundaries(previous: number[], renderedLength: number, maxSpans: number): number[] {
  const last = previous[previous.length - 1]
  if (previous.length > 0 && (last == null || renderedLength <= last))
    return previous

  const next = [...previous, renderedLength]
  while (next.length > maxSpans)
    next.shift()
  return next
}

/**
 * Split one text node into settled and fading slices.
 * Returns null when the node sits entirely in settled text.
 */
export function computeSegments(
  content: string,
  startOffset: number,
  boundaries: number[],
  nodeKey: string | number,
): TextSegment[] | null {
  if (boundaries.length === 0)
    return null

  const endOffset = startOffset + content.length
  const oldest = boundaries[0]
  if (oldest == null || endOffset <= oldest)
    return null

  const segments: TextSegment[] = []
  let position = startOffset

  if (position < oldest && oldest < endOffset) {
    segments.push({
      key: `settled-${nodeKey}`,
      text: content.slice(0, oldest - startOffset),
      fading: false,
    })
    position = oldest
  }

  for (let index = 0; index < boundaries.length; index++) {
    const boundary = boundaries[index]
    const nextBoundary = boundaries[index + 1] ?? endOffset
    if (boundary == null || boundary >= endOffset || nextBoundary <= position)
      continue

    const sliceStart = Math.max(boundary, position)
    const sliceEnd = Math.min(nextBoundary, endOffset)
    if (sliceStart >= sliceEnd)
      continue

    segments.push({
      key: `fade-${nodeKey}-b${boundary}`,
      text: content.slice(sliceStart - startOffset, sliceEnd - startOffset),
      fading: true,
    })
    position = sliceEnd
  }

  return segments.length > 0 ? segments : null
}

export function parseCssDuration(value: string): number | null {
  const milliseconds = /^([\d.]+)ms$/.exec(value.trim())
  if (milliseconds?.[1] != null)
    return Number(milliseconds[1])
  const seconds = /^([\d.]+)s$/.exec(value.trim())
  if (seconds?.[1] != null)
    return Number(seconds[1]) * 1000
  return null
}
