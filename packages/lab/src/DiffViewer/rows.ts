/**
 * @file rows.ts
 * @input A DiffViewerFile, a language, and an inline-highlight granularity
 * @output The tokenized line cells plus the unified and split row models, with
 *   the fold row a replaced block shows in place of its changed lines
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

/** The control that folds a replaced block's changed lines. */
export interface ReplacedBlockFold {
  hunkIndex: number
  /** Index of the hunk cell the fold row goes before. */
  at: number
  /** Removed plus added lines in the block. */
  changedLines: number
  isExpanded: boolean
}

export interface HunkCells {
  cells: LineCell[]
  fold: ReplacedBlockFold | null
}

export interface FoldRow { type: 'fold', key: string, fold: ReplacedBlockFold }

export type UnifiedRow
  = | { type: 'hunk', key: string, header: string }
    | { type: 'line', key: string, cell: LineCell }
    | FoldRow

export type SplitRow
  = | { type: 'hunk', key: string, header: string }
    | { type: 'pair', key: string, old: LineCell | null, new: LineCell | null }
    | FoldRow

/**
 * Most changed lines a file shows before the reader asks for them. Rows are
 * not virtualized, and each row costs render time, so a file with more changed
 * lines starts folded. Lines in replaced blocks do not count: those blocks
 * fold on their own.
 */
export const MAX_UNFOLDED_CHANGED_LINES = 2000

export function lineRef(line: DiffViewerLine, hunkIndex: number): DiffViewerLineRef | null {
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
 * Tokenize a run of hunk lines with its old and new side each as continuous
 * text, so constructs that span lines (block comments, template strings) keep
 * their paint within the run, and give each line the tokens of the side it
 * renders from.
 */
function tokenizeRun(lines: readonly DiffViewerLine[], language: string): Array<LineCell['tokens']> {
  if (language === 'plaintext')
    return lines.map(() => [])
  const sideText = (kind: 'added' | 'removed'): string =>
    lines.filter(line => line.kind !== kind).map(line => line.content).join('\n')
  const oldTokens = tokenize(sideText('added'), language)
  const newTokens = tokenize(sideText('removed'), language)
  let oldIndex = 0
  let newIndex = 0
  return lines.map((line) => {
    if (line.kind === 'removed')
      return oldTokens[oldIndex++] ?? []
    if (line.kind === 'added')
      return newTokens[newIndex++] ?? []
    oldIndex++
    return newTokens[newIndex++] ?? []
  })
}

/**
 * Build each hunk's line cells. A folded replaced block keeps only the context
 * around it, and its changed lines are not tokenized.
 */
export function buildCells(
  file: DiffViewerFile,
  language: string,
  inlineHighlight: 'word' | 'char' | 'none',
  expandedBlocks: ReadonlySet<number> = new Set(),
): HunkCells[] {
  return file.hunks.map((hunk, hunkIndex) => {
    const cells: LineCell[] = []
    const addRun = (lines: readonly DiffViewerLine[]): void => {
      const tokens = tokenizeRun(lines, language)
      lines.forEach((line, i) => {
        const ref = lineRef(line, hunkIndex)
        if (ref != null)
          cells.push({ line, ref, tokens: tokens[i] ?? [], emphasis: [], groups: [] })
      })
    }
    const finish = (fold: ReplacedBlockFold | null): HunkCells => {
      for (const cell of cells)
        cell.groups = buildLineGroups(cell.line.content, cell.tokens, cell.emphasis)
      return { cells, fold }
    }

    const changeStart = hunk.isReplacedBlock === true
      ? hunk.lines.findIndex(line => line.kind !== 'context')
      : -1
    if (changeStart === -1) {
      addRun(hunk.lines)
      if (inlineHighlight !== 'none')
        addInlineEmphasis(cells, inlineHighlight)
      return finish(null)
    }

    // A replaced block's removed and added lines are not edits of each other,
    // so they get no inline highlight.
    const isExpanded = expandedBlocks.has(hunkIndex)
    const changedLines = hunk.lines.filter(line => line.kind !== 'context').length
    if (isExpanded) {
      addRun(hunk.lines)
      const at = cells.findIndex(cell => cell.line.kind !== 'context')
      return finish({ hunkIndex, at, changedLines, isExpanded })
    }
    // Leading and trailing context are tokenized apart: the hidden lines
    // between them can open or close a comment or a string.
    addRun(hunk.lines.slice(0, changeStart))
    const at = cells.length
    addRun(hunk.lines.slice(changeStart + changedLines))
    return finish({ hunkIndex, at, changedLines, isExpanded })
  })
}

export function buildUnifiedRows(file: DiffViewerFile, cells: HunkCells[]): UnifiedRow[] {
  const rows: UnifiedRow[] = []

  file.hunks.forEach((hunk, h) => {
    rows.push({ type: 'hunk', key: `h${h}`, header: hunk.header })
    const { cells: hunkCells, fold } = cells[h]!

    hunkCells.forEach((cell, i) => {
      if (fold != null && fold.at === i)
        rows.push({ type: 'fold', key: `h${h}f`, fold })
      rows.push({ type: 'line', key: `h${h}l${i}`, cell })
    })
    if (fold != null && fold.at === hunkCells.length)
      rows.push({ type: 'fold', key: `h${h}f`, fold })
  })

  return rows
}

/**
 * Pair each run of removed lines with the run of added lines that follows it,
 * row by row; context lines appear on both sides of one row.
 */
export function buildSplitRows(file: DiffViewerFile, cells: HunkCells[]): SplitRow[] {
  const rows: SplitRow[] = []

  file.hunks.forEach((hunk, h) => {
    rows.push({ type: 'hunk', key: `h${h}`, header: hunk.header })
    const { cells: hunkCells, fold } = cells[h]!
    let i = 0

    while (i < hunkCells.length) {
      // The fold sits where a run of changes starts or ends, never inside one.
      if (fold != null && fold.at === i)
        rows.push({ type: 'fold', key: `h${h}f`, fold })
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
    if (fold != null && fold.at === hunkCells.length)
      rows.push({ type: 'fold', key: `h${h}f`, fold })
  })

  return rows
}
