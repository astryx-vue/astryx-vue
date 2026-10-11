import { hasOpenFence } from './blocks.js'

function isInsideCodeSpan(line: string, index: number): boolean {
  let open = false
  for (let cursor = 0; cursor < index; cursor++) {
    if (line[cursor] === '`')
      open = !open
  }
  return open
}

function trimIncompleteLink(line: string): string {
  const image = line.lastIndexOf('![')
  const bracket = line.lastIndexOf('[')
  const start = Math.max(image, bracket)
  if (start < 0 || isInsideCodeSpan(line, start))
    return line

  const slice = line.slice(start)
  if (/^!?\[[^\]]*\]\([^)]*\)$/.test(slice) || /^!?\[[^\]]*\]$/.test(slice))
    return line
  if (/^!?\[[^\]]*\]\([^)]*$/.test(slice) || /^!?\[[^\]]*$/.test(slice))
    return line.slice(0, start)
  return line
}

interface MarkerRun {
  start: number
  length: number
}

function markerRuns(line: string, char: string, maxLength: number): MarkerRun[] {
  const runs: MarkerRun[] = []
  for (let index = 0; index < line.length; index++) {
    if (line[index] !== char)
      continue
    let length = 1
    while (line[index + length] === char)
      length += 1
    if (length <= maxLength)
      runs.push({ start: index, length })
    index += length - 1
  }
  return runs
}

/** Pair equal-length marker runs and close or drop the ones left open. */
function closeRuns(line: string, char: string, maxLength: number): string {
  const runs = markerRuns(line, char, maxLength)
  const openByLength = new Map<number, number[]>()
  const closed = new Set<number>()

  runs.forEach((run, index) => {
    const stack = openByLength.get(run.length) ?? []
    const opener = stack.pop()
    if (opener == null) {
      stack.push(index)
      openByLength.set(run.length, stack)
      return
    }
    closed.add(opener)
    closed.add(index)
    openByLength.set(run.length, stack)
  })

  const openIndexes = runs.map((_, index) => index).filter(index => !closed.has(index))
  if (openIndexes.length === 0)
    return line

  let result = line
  for (const index of [...openIndexes].reverse()) {
    const run = runs[index]
    if (run == null)
      continue
    const after = result.slice(run.start + run.length)
    if (after.trim() === '') {
      result = result.slice(0, run.start) + result.slice(run.start + run.length)
      continue
    }
    const trailing = after.length - after.trimEnd().length
    const closer = char.repeat(run.length)
    result = result.slice(0, result.length - trailing) + closer + result.slice(result.length - trailing)
  }
  return result
}

function closeStrike(line: string): string {
  const positions: number[] = []
  let search = 0
  while (search < line.length) {
    const found = line.indexOf('~~', search)
    if (found === -1)
      break
    positions.push(found)
    search = found + 2
  }
  if (positions.length % 2 === 0)
    return line
  const start = positions[positions.length - 1]
  if (start == null)
    return line
  const after = line.slice(start + 2)
  if (after.trim() === '')
    return line.slice(0, start)
  const trailing = after.length - after.trimEnd().length
  return `${line.slice(0, line.length - trailing)}~~${line.slice(line.length - trailing)}`
}

/**
 * Hide unfinished link and code markers on the last line, and close emphasis
 * that already has text so the words can render while the stream continues.
 * An open fence is left untouched.
 */
export function trimStreamingTail(tail: string): string {
  if (tail === '' || hasOpenFence(tail))
    return tail

  const lastNewline = tail.lastIndexOf('\n')
  const head = lastNewline === -1 ? '' : tail.slice(0, lastNewline + 1)
  let line = lastNewline === -1 ? tail : tail.slice(lastNewline + 1)
  line = trimIncompleteLink(line)
  line = closeRuns(line, '`', Number.POSITIVE_INFINITY)
  line = closeRuns(line, '*', 3)
  line = closeStrike(line)
  return head + line
}
