/**
 * @file useDiffFolds.ts
 * @input The DiffViewer file and its line-annotation callback
 * @output Which folds are open: the whole file when it has too many changed
 *   lines, and each replaced block; plus the toggles
 * @position DiffViewer 内部使用
 *
 * 文件改动行数超过 MAX_UNFOLDED_CHANGED_LINES，或者某个片段是整块替换，一开始就折起来；
 * 但折起来会藏住某条批注时一开始就展开，评审意见永远不会被藏住。读者的开合按文件记，换了文件重新算。
 */

import type { ComputedRef, Ref, VNodeChild } from 'vue'
import type { DiffViewerFile, DiffViewerLineRef } from './diffTypes.js'
import { computed, shallowRef } from 'vue'
import { lineRef, MAX_UNFOLDED_CHANGED_LINES } from './rows.js'

/** 批注回调画不画东西：null、undefined、布尔值和空字符串都算没有，`hasThread && h(Thread)` 不会多出空行。 */
export function renderedAnnotation(note: VNodeChild): VNodeChild | null {
  return note == null || typeof note === 'boolean' || note === '' ? null : note
}

/** 有批注的片段。整块替换的片段只看改动行，它的上下文行在折叠时也看得见。 */
function findAnnotatedHunks(
  file: DiffViewerFile,
  annotate: ((ref: DiffViewerLineRef) => VNodeChild) | undefined,
): Set<number> {
  const hunks = new Set<number>()
  if (annotate == null)
    return hunks
  file.hunks.forEach((hunk, hunkIndex) => {
    const isAnnotated = hunk.lines.some((line) => {
      if (hunk.isReplacedBlock === true && line.kind === 'context')
        return false
      const ref = lineRef(line, hunkIndex)
      return ref != null && renderedAnnotation(annotate(ref)) != null
    })
    if (isAnnotated)
      hunks.add(hunkIndex)
  })
  return hunks
}

export interface DiffFolds {
  /** 不算整块替换片段的改动行数。 */
  unfoldedChangedLines: ComputedRef<number>
  isLargeFile: ComputedRef<boolean>
  isFileFolded: ComputedRef<boolean>
  toggleFile: () => void
  expandedBlocks: ComputedRef<ReadonlySet<number>>
  toggleBlock: (hunkIndex: number) => void
}

export function useDiffFolds(
  file: Ref<DiffViewerFile>,
  annotate: () => ((ref: DiffViewerLineRef) => VNodeChild) | undefined,
): DiffFolds {
  const counts = computed(() => {
    let changed = 0
    let hasReplacedBlock = false
    for (const hunk of file.value.hunks) {
      if (hunk.isReplacedBlock === true) {
        hasReplacedBlock = true
        continue
      }
      for (const line of hunk.lines) {
        if (line.kind !== 'context')
          changed++
      }
    }
    return { changed, hasReplacedBlock }
  })
  const unfoldedChangedLines = computed(() => counts.value.changed)
  const isLargeFile = computed(() => counts.value.changed > MAX_UNFOLDED_CHANGED_LINES)
  const annotatedHunks = computed(() => isLargeFile.value || counts.value.hasReplacedBlock
    ? findAnnotatedHunks(file.value, annotate())
    : new Set<number>())

  const fileToggle = shallowRef<{ file: DiffViewerFile, isExpanded: boolean } | null>(null)
  const isFileFolded = computed(() => {
    if (!isLargeFile.value)
      return false
    const toggle = fileToggle.value
    const isExpanded = toggle?.file === file.value ? toggle.isExpanded : annotatedHunks.value.size > 0
    return !isExpanded
  })

  const blockToggles = shallowRef<{ file: DiffViewerFile, isExpanded: ReadonlyMap<number, boolean> } | null>(null)
  function isBlockExpanded(hunkIndex: number): boolean {
    const toggles = blockToggles.value?.file === file.value ? blockToggles.value.isExpanded : null
    return toggles?.get(hunkIndex) ?? annotatedHunks.value.has(hunkIndex)
  }
  // 用打开的片段拼成的键做比较，集合内容不变时引用也不变，行就不会重新切分着色。
  let lastKey = ''
  let lastSet: ReadonlySet<number> = new Set()
  const expandedBlocks = computed<ReadonlySet<number>>(() => {
    const open = file.value.hunks.flatMap((hunk, hunkIndex) =>
      hunk.isReplacedBlock === true && isBlockExpanded(hunkIndex) ? [hunkIndex] : [])
    const key = open.join(',')
    if (key !== lastKey) {
      lastKey = key
      lastSet = new Set(open)
    }
    return lastSet
  })

  return {
    unfoldedChangedLines,
    isLargeFile,
    isFileFolded,
    toggleFile: () => {
      fileToggle.value = { file: file.value, isExpanded: isFileFolded.value }
    },
    expandedBlocks,
    toggleBlock: (hunkIndex) => {
      const previous = blockToggles.value?.file === file.value ? blockToggles.value.isExpanded : null
      const next = new Map(previous)
      next.set(hunkIndex, !isBlockExpanded(hunkIndex))
      blockToggles.value = { file: file.value, isExpanded: next }
    },
  }
}
