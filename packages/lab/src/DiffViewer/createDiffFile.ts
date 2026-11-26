/**
 * @file createDiffFile.ts
 * @input Two versions of a text (old and new) plus optional paths
 * @output Exports createDiffFile(options) → DiffViewerFile and
 *   CreateDiffFileOptions
 * @position Lab utility; computes a line diff (Myers) when the caller has two
 *   texts rather than a patch
 *
 * The line diff itself is in editScript.ts: changes up to 10,000 lines are
 * compared line by line in linear memory; a larger middle becomes one
 * replaced block, marked with `isReplacedBlock` on its hunk.
 *
 * SYNC: When modified, update:
 * - /packages/lab/src/DiffViewer/createDiffFile.test.ts
 */

import type {
  DiffViewerFile,
  DiffViewerFileStatus,
  DiffViewerHunk,
  DiffViewerLine,
} from './diffTypes.js'
import { diffLines } from './editScript.js'

export interface CreateDiffFileOptions {
  /** The original text. */
  oldValue: string
  /** The changed text. */
  newValue: string
  /**
   * Path of the file on both sides. `oldPath` / `newPath` take precedence
   * when they are given.
   */
  path?: string
  /** Path before the change; pass `null` to mark the file as added. */
  oldPath?: string | null
  /** Path after the change; pass `null` to mark the file as deleted. */
  newPath?: string | null
  /**
   * Unchanged lines kept around each change. Changes closer together than
   * twice this share one hunk. `NaN` falls back to the default.
   * @default 3
   */
  contextLines?: number
}

function splitLines(value: string): string[] {
  if (value === '') {
    return []
  }
  const lines = value.split('\n').map(line => line.replace(/\r$/, ''))
  if (lines[lines.length - 1] === '') {
    lines.pop()
  }
  return lines
}

function formatRange(start: number, count: number): string {
  return count === 1 ? `${start}` : `${start},${count}`
}

/**
 * Compute a {@link DiffViewerFile} from two versions of a text, for callers
 * that hold file contents rather than a patch.
 *
 * @example
 * ```
 * const file = createDiffFile({oldValue: before, newValue: after, path: 'src/app.ts'});
 * <DiffViewer file={file} />
 * ```
 */
export function createDiffFile({
  oldValue,
  newValue,
  path,
  oldPath: oldPathOption,
  newPath: newPathOption,
  contextLines = 3,
}: CreateDiffFileOptions): DiffViewerFile {
  const oldPath = oldPathOption === undefined ? (path ?? null) : oldPathOption
  const newPath = newPathOption === undefined ? (path ?? null) : newPathOption
  const context = Number.isNaN(contextLines)
    ? 3
    : Math.max(0, Math.floor(contextLines))

  let status: DiffViewerFileStatus = 'modified'
  if (oldPathOption === null) {
    status = 'added'
  }
  else if (newPathOption === null) {
    status = 'deleted'
  }
  else if (oldPath != null && newPath != null && oldPath !== newPath) {
    status = 'renamed'
  }

  const a = splitLines(oldValue)
  const b = splitLines(newValue)
  const { ops, isReplacedBlock } = diffLines(a, b)

  const changed: number[] = []
  ops.forEach((op, i) => {
    if (op.kind !== 'context') {
      changed.push(i)
    }
  })

  const hunks: DiffViewerHunk[] = []
  let g = 0
  while (g < changed.length) {
    let last = changed[g]
    let h = g + 1
    while (h < changed.length && changed[h] - last - 1 <= context * 2) {
      last = changed[h]
      h++
    }
    const start = Math.max(0, changed[g] - context)
    const end = Math.min(ops.length - 1, last + context)

    const lines: DiffViewerLine[] = []
    let oldCount = 0
    let newCount = 0
    for (let i = start; i <= end; i++) {
      const op = ops[i]
      if (op.kind === 'context') {
        lines.push({
          kind: 'context',
          content: a[op.a],
          oldLineNumber: op.a + 1,
          newLineNumber: op.b + 1,
        })
        oldCount++
        newCount++
      }
      else if (op.kind === 'removed') {
        lines.push({
          kind: 'removed',
          content: a[op.a],
          oldLineNumber: op.a + 1,
          newLineNumber: null,
        })
        oldCount++
      }
      else {
        lines.push({
          kind: 'added',
          content: b[op.b],
          oldLineNumber: null,
          newLineNumber: op.b + 1,
        })
        newCount++
      }
    }

    // Lines of each side that come before this hunk.
    let oldBefore = 0
    let newBefore = 0
    for (let i = 0; i < start; i++) {
      const op = ops[i]
      if (op.kind !== 'added') {
        oldBefore++
      }
      if (op.kind !== 'removed') {
        newBefore++
      }
    }
    // Unified convention: an empty side's start is the line before the hunk.
    const oldStart = oldCount === 0 ? oldBefore : oldBefore + 1
    const newStart = newCount === 0 ? newBefore : newBefore + 1

    hunks.push({
      header: `@@ -${formatRange(oldStart, oldCount)} +${formatRange(newStart, newCount)} @@`,
      oldStart,
      oldLines: oldCount,
      newStart,
      newLines: newCount,
      lines,
      // 整块替换是唯一的改动，所以它占满唯一的一个片段。
      ...(isReplacedBlock ? { isReplacedBlock: true } : {}),
    })
    g = h
  }

  return {
    oldPath: status === 'added' ? null : oldPath,
    newPath: status === 'deleted' ? null : newPath,
    status,
    isBinary: false,
    hunks,
  }
}
