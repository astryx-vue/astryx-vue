/**
 * @file diffTypes.ts
 * @input None (type-only module)
 * @output DiffViewerFile, DiffViewerHunk, DiffViewerLine, DiffViewerLineKind,
 *   DiffViewerFileStatus, DiffViewerSide, DiffViewerLineRef
 * @position Lab diff model; produced by parseUnifiedDiff / createDiffFile and
 *   consumed by DiffViewer
 *
 * 数据模型和上游 `@astryxdesign/lab` 的 DiffViewer 保持一致：一个 hunk 里的行
 * 去掉开头 `+`/`-`/空格标记后，各自记录旧文件和新文件里的行号。
 */

/** One line of a hunk: adds, removes, or keeps a line. */
export type DiffViewerLineKind = 'added' | 'removed' | 'context'

/** How the file changed as a whole. */
export type DiffViewerFileStatus = 'added' | 'deleted' | 'modified' | 'renamed'

/**
 * Which version of the file a line number belongs to: `old` is the original
 * (left in split view), `new` the changed version (right in split view).
 */
export type DiffViewerSide = 'old' | 'new'

/** One line of a hunk, without its leading `+`/`-`/space glyph. */
export interface DiffViewerLine {
  kind: DiffViewerLineKind
  /** The line's text with the diff glyph removed. */
  content: string
  /** 1-based line number in the old file; `null` for an added line. */
  oldLineNumber: number | null
  /** 1-based line number in the new file; `null` for a removed line. */
  newLineNumber: number | null
}

/** One `@@` hunk: a run of changed lines with their surrounding context. */
export interface DiffViewerHunk {
  /** The hunk header as written, e.g. `@@ -12,7 +12,9 @@ function save()`. */
  header: string
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: DiffViewerLine[]
}

/** One file's changes. */
export interface DiffViewerFile {
  /** Path before the change; `null` when the file was added. */
  oldPath: string | null
  /** Path after the change; `null` when the file was deleted. */
  newPath: string | null
  status: DiffViewerFileStatus
  /** True when the patch reports a binary change with no line hunks. */
  isBinary: boolean
  hunks: DiffViewerHunk[]
}

/**
 * Identifies one rendered line for annotations and line-number clicks. Every
 * line has exactly one ref, the same in unified and split view, so `side` +
 * `lineNumber` is a stable anchor: an added line is `new`, a removed line is
 * `old`, and a context line is `new`.
 */
export interface DiffViewerLineRef {
  side: DiffViewerSide
  lineNumber: number
  line: DiffViewerLine
  hunkIndex: number
}
