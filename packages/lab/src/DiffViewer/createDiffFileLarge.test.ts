import type { DiffViewerFile } from './diffTypes.js'
import { describe, expect, it } from 'vitest'
import { createDiffFile } from './createDiffFile.js'

/** Rebuild both sides from the hunks of a full-context diff. */
function sides(file: DiffViewerFile) {
  const oldSide: string[] = []
  const newSide: string[] = []
  for (const hunk of file.hunks) {
    for (const line of hunk.lines) {
      if (line.kind !== 'added') {
        oldSide.push(line.content)
      }
      if (line.kind !== 'removed') {
        newSide.push(line.content)
      }
    }
  }
  return { oldSide, newSide }
}

/** Fewest added plus removed lines between two texts, by dynamic programming. */
function minimalEditCount(a: string[], b: string[]): number {
  let previous = Array.from<number>({ length: b.length + 1 }).fill(0)
  for (let i = 1; i <= a.length; i++) {
    const row = [0]
    for (let j = 1; j <= b.length; j++) {
      row[j]
        = a[i - 1] === b[j - 1]
          ? previous[j - 1] + 1
          : Math.max(previous[j], row[j - 1])
    }
    previous = row
  }
  return a.length + b.length - 2 * previous[b.length]
}

/** Seeded generator, so a failing case can be replayed. */
function createRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

describe('createDiffFile large changes', () => {
  it('does not mark a minimal diff as a replaced block', () => {
    const file = createDiffFile({ oldValue: 'a\nb\n', newValue: 'a\nB\n' })
    expect(file.hunks[0].isReplacedBlock).toBeUndefined()
  })

  it('keeps a long one-sided change minimal, not a replaced block', () => {
    // Only additions: adding every new line is already the minimal diff.
    const lineCount = 6000
    const added = Array.from({ length: lineCount }, (_, i) => `new ${i}`)
    const file = createDiffFile({
      oldValue: ['head', 'tail'].join('\n'),
      newValue: ['head', ...added, 'tail'].join('\n'),
    })
    expect(file.hunks).toHaveLength(1)
    expect(file.hunks[0].isReplacedBlock).toBeUndefined()
    expect(file.hunks[0].newLines).toBe(lineCount + 2)
  })

  it('finds a minimal diff for many small texts', () => {
    // Few distinct lines make many ties and repeated lines.
    const random = createRandom(7)
    for (let run = 0; run < 2000; run++) {
      const alphabet = 1 + Math.floor(random() * 4)
      const text = () =>
        Array.from(
          { length: Math.floor(random() * 10) },
          () => `line ${Math.floor(random() * alphabet)}`,
        )
      const a = text()
      const b = text()
      const file = createDiffFile({
        oldValue: a.join('\n'),
        newValue: b.join('\n'),
        contextLines: 100,
      })
      const lines = file.hunks.flatMap(hunk => hunk.lines)
      const { oldSide, newSide } = sides(file)
      if (lines.length > 0) {
        expect(oldSide).toEqual(a)
        expect(newSide).toEqual(b)
      }
      expect(lines.filter(line => line.kind !== 'context')).toHaveLength(
        minimalEditCount(a, b),
      )
      // Each run of changes lists its removals before its additions.
      lines.forEach((line, i) => {
        if (line.kind === 'removed' && i > 0) {
          expect(lines[i - 1].kind).not.toBe('added')
        }
      })
    }
  })

  it('finds a minimal diff for texts with more than a thousand changes', () => {
    // Past a thousand changed lines a second, linear-space search takes over.
    const random = createRandom(11)
    for (let run = 0; run < 3; run++) {
      const text = () =>
        Array.from({ length: 1200 }, () => `line ${Math.floor(random() * 40)}`)
      const a = text()
      const b = text()
      const file = createDiffFile({
        oldValue: a.join('\n'),
        newValue: b.join('\n'),
        contextLines: 10_000,
      })
      const expected = minimalEditCount(a, b)
      expect(expected).toBeGreaterThan(1000)
      const { oldSide, newSide } = sides(file)
      expect(oldSide).toEqual(a)
      expect(newSide).toEqual(b)
      expect(
        file.hunks
          .flatMap(hunk => hunk.lines)
          .filter(line => line.kind !== 'context'),
      ).toHaveLength(expected)
    }
  })

  it('keeps a line diff for thousands of changes spread through a long file', () => {
    // 1,500 lines changed in place: 3,000 changed lines in a 20,000-line file.
    const base = Array.from({ length: 20_000 }, (_, i) => `line ${i}`)
    const next = base.map((line, i) =>
      i % 13 === 5 ? `${line} changed` : line,
    )
    const changedPairs = base.filter((_, i) => i % 13 === 5).length
    const file = createDiffFile({
      oldValue: base.join('\n'),
      newValue: next.join('\n'),
      contextLines: 0,
    })
    expect(file.hunks.some(hunk => hunk.isReplacedBlock)).toBe(false)
    expect(file.hunks).toHaveLength(changedPairs)
    expect(file.hunks[0].header).toBe('@@ -6 +6 @@')
  })

  it('lowers the edit limit for a very long file', () => {
    // 4,000 changed lines through 150,000 lines: a line diff in a shorter
    // file, but past the work the search may spend on this one.
    const changes = (lineCount: number) => {
      const base = Array.from({ length: lineCount }, (_, i) => `line ${i}`)
      const step = Math.floor(lineCount / 2000)
      const next = base.map((line, i) =>
        i % step === 1 ? `${line} changed` : line,
      )
      return createDiffFile({
        oldValue: base.join('\n'),
        newValue: next.join('\n'),
      })
    }
    expect(changes(20_000).hunks.some(hunk => hunk.isReplacedBlock)).toBe(
      false,
    )
    expect(changes(150_000).hunks[0].isReplacedBlock).toBe(true)
  })

  it('diffs up to 10,000 changed lines and replaces the block past that', () => {
    const rewrite = (lineCount: number) => {
      const oldLines = Array.from({ length: lineCount }, (_, i) => `old ${i}`)
      const newLines = Array.from({ length: lineCount }, (_, i) => `new ${i}`)
      return createDiffFile({
        oldValue: ['head', ...oldLines, 'tail'].join('\n'),
        newValue: ['head', ...newLines, 'tail'].join('\n'),
      })
    }
    expect(rewrite(5000).hunks[0].isReplacedBlock).toBeUndefined()
    expect(rewrite(5001).hunks[0].isReplacedBlock).toBe(true)
  })

  it('marks a rewrite past the limit as a replaced block', () => {
    const lineCount = 6000
    const oldLines = Array.from({ length: lineCount }, (_, i) => `old ${i}`)
    const newLines = Array.from({ length: lineCount }, (_, i) => `new ${i}`)
    const file = createDiffFile({
      oldValue: ['head', ...oldLines, 'tail'].join('\n'),
      newValue: ['head', ...newLines, 'tail'].join('\n'),
      contextLines: 1,
    })
    expect(file.hunks[0].isReplacedBlock).toBe(true)
  })
})
