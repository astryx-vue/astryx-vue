export { createDiffFile } from './createDiffFile.js'
export type { CreateDiffFileOptions } from './createDiffFile.js'
export type {
  DiffViewerFile,
  DiffViewerFileStatus,
  DiffViewerHunk,
  DiffViewerLine,
  DiffViewerLineKind,
  DiffViewerLineRef,
  DiffViewerSide,
} from './diffTypes.js'
export { default as DiffViewer } from './DiffViewer.vue'
export { diffInlineRanges } from './inlineDiff.js'
export type { InlineDiffGranularity, InlineDiffResult, InlineRange } from './inlineDiff.js'
export { parseUnifiedDiff } from './parseUnifiedDiff.js'
export type { DiffViewerEmits, DiffViewerInlineHighlight, DiffViewerProps, DiffViewerSlots, DiffViewerViewMode } from './types.js'
