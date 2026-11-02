/**
 * @file rows.ts
 * @input A DiffViewerFile, a language, and an inline-highlight granularity
 * @output The tokenized line cells plus the unified and split row models
 * @position Lab helper used by DiffViewer; keeps layout-independent diff logic
 *   out of the component file
 */

import type { VNodeChild } from 'vue'
import type { DiffViewerFile, DiffViewerLine, DiffViewerLineRef } from './diffTypes.js'
import type { InlineDiffGranularity, InlineRange } from './inlineDiff.js'
import type { CodeGroup } from './lineParts.js'
import { tokenize } from '@astryx-vue/core'
import { diffInlineRanges } from './inlineDiff.js'
import { buildLineGroups } from './lineParts.js'

export interface LineCell {
  line: DiffViewerLine
  ref: DiffViewerLineRef
  tokens: ReturnType<typeof tokenize>[number]
  /** Changed character ranges to highlight inside the line. */
  emphasis: InlineRange[]
  groups: CodeGroup[]
  /** Rendered annotation content, filled by DiffViewer from its prop. */
  note?: VNodeChild | null
}

export type UnifiedRow
  = | { type: 'hunk', key: string, header: string }
    | { type: 'line', key: string, cell: LineCell }

export type SplitRow
  = | { type: 'hunk', key: string, header: string }
    | { type: 'pair', key: string, old: LineCell | null, new: LineCell | null }

function lineRef(line: DiffViewerLine, hunkIndex: number): DiffViewerLineRef | null {
  if (line.kind === 'removed') {
    return line.oldLineNumber == null
      ? null
      : { side: 'old', lineNumber: line.oldLineNumber, line, hunkIndex }
  }

  return line.newLineNumber == null
    ? null
    : { side: 'new', lineNumber: line.newLineNumber, line, hunkIndex }
}

/**
 * Pair each run of removed lines with the run of added lines after it, line by
 * line (the same pairing split view shows), and mark what changed inside each
 * pair.
 */
function addInlineEmphasis(cells: LineCell[], granularity: InlineDiffGranularity): void {
  let i = 0

  while (i < cells.length) {
    if (cells[i].line.kind !== 'removed') {
      i++
      continue
    }

    const removed: LineCell[] = []
    const added: LineCell[] = []

    while (i < cells.length && cells[i].line.kind === 'removed')
      removed.push(cells[i++])

    while (i < cells.length && cells[i].line.kind === 'added')
      added.push(cells[i++])

    const pairs = Math.min(removed.length, added.length)

    for (let r = 0; r < pairs; r++) {
      const ranges = diffInlineRanges(
        removed[r].line.content,
        added[r].line.content,
        granularity,
      )
      removed[r].emphasis = ranges.old
      added[r].emphasis = ranges.new
    }
  }
}

/**
 * Tokenize each hunk's old and new side as continuous text, so constructs that
 * span lines (block comments, template strings) keep their paint within the
 * hunk, then hand each line the tokens of the side it renders from.
 */
export function buildCells(
  file: DiffViewerFile,
  language: string,
  inlineHighlight: 'word' | 'char' | 'none',
): LineCell[][] {
  return file.hunks.map((hunk, hunkIndex) => {
    const oldLines = hunk.lines.filter(line => line.kind !== 'added')
    const newLines = hunk.lines.filter(line => line.kind !== 'removed')
    const highlight = language !== 'plaintext'
    const oldTokens = highlight ? tokenize(oldLines.map(line => line.content).join('\n'), language) : []
    const newTokens = highlight ? tokenize(newLines.map(line => line.content).join('\n'), language) : []
    let oldIndex = 0
    let newIndex = 0
    const cells: LineCell[] = []

    for (const line of hunk.lines) {
      let tokens: LineCell['tokens']

      if (line.kind === 'removed') {
        tokens = oldTokens[oldIndex++] ?? []
      }
      else if (line.kind === 'added') {
        tokens = newTokens[newIndex++] ?? []
      }
      else {
        oldIndex++
        tokens = newTokens[newIndex++] ?? []
      }

      const ref = lineRef(line, hunkIndex)
      if (ref != null)
        cells.push({ line, ref, tokens, emphasis: [], groups: [] })
    }

    if (inlineHighlight !== 'none')
      addInlineEmphasis(cells, inlineHighlight)

    for (const cell of cells)
      cell.groups = buildLineGroups(cell.line.content, cell.tokens, cell.emphasis)

    return cells
  })
}

export function buildUnifiedRows(file: DiffViewerFile, cells: LineCell[][]): UnifiedRow[] {
  const rows: UnifiedRow[] = []

  file.hunks.forEach((hunk, h) => {
    rows.push({ type: 'hunk', key: `h${h}`, header: hunk.header })

    cells[h].forEach((cell, i) => {
      rows.push({ type: 'line', key: `h${h}l${i}`, cell })
    })
  })

  return rows
}

/**
 * Pair each run of removed lines with the run of added lines that follows it,
 * row by row; context lines appear on both sides of one row.
 */
export function buildSplitRows(file: DiffViewerFile, cells: LineCell[][]): SplitRow[] {
  const rows: SplitRow[] = []

  file.hunks.forEach((hunk, h) => {
    rows.push({ type: 'hunk', key: `h${h}`, header: hunk.header })
    const hunkCells = cells[h]
    let i = 0

    while (i < hunkCells.length) {
      const cell = hunkCells[i]

      if (cell.line.kind === 'context') {
        rows.push({ type: 'pair', key: `h${h}l${i}`, old: cell, new: cell })
        i++
        continue
      }

      const removed: LineCell[] = []
      const added: LineCell[] = []

      while (i < hunkCells.length && hunkCells[i].line.kind === 'removed')
        removed.push(hunkCells[i++])

      while (i < hunkCells.length && hunkCells[i].line.kind === 'added')
        added.push(hunkCells[i++])

      const count = Math.max(removed.length, added.length)

      for (let r = 0; r < count; r++) {
        rows.push({
          type: 'pair',
          key: `h${h}l${i}r${r}`,
          old: removed[r] ?? null,
          new: added[r] ?? null,
        })
      }
    }
  })

  return rows
}
