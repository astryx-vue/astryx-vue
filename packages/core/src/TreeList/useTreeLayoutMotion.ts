/**
 * @file useTreeLayoutMotion.ts
 * @position TreeList 内部：把行的展开、收起接到 `animatedLayout` 句柄的布局动效上。
 *
 * 展开状态一变（点击、键盘、`items` 里的 `isExpanded`），DOM 变化之前先量好每个变化的行，
 * 箭头换上和滑动一样的过渡；DOM 变化之后，后面的行和内容从旧位置滑过来，展开的子组播放
 * 入场；收起的子组留在页面上播完退场（变成 inert、让出空间）才真正移除。没有句柄时什么
 * 都不做，箭头用主题自己的过渡。
 */
import type { Ref } from 'vue'
import type { AnimatedLayout, LayoutChange } from '../motion/layout/index.js'
import { onMounted, shallowRef, watch } from 'vue'
import {
  applyLayoutChangeTransition,
  holdLayoutExit,
  playLayoutChange,
  releaseLayoutExit,
  reportLayoutChange,
} from '../motion/layout/index.js'

const CHEVRON = '[data-tree-toggle] > .astryx-icon'

interface PendingChange {
  change: LayoutChange
  id: string
  isExpanding: boolean
  /** 嵌在这一行里、也变了的行：跟着它一起动、一起退场。 */
  nested: string[]
}

export interface TreeLayoutMotionOptions {
  animatedLayout: () => AnimatedLayout | null | undefined
  /** 当前展开着的行（只算祖先也展开着的）。 */
  expandedIds: () => ReadonlySet<string>
  tree: () => HTMLElement | null
}

export interface TreeLayoutMotion {
  /** 收起后子组还在播放退场的行：这段时间子组要继续渲染。 */
  exitingIds: Ref<ReadonlySet<string>>
}

function sameIds(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  return a.size === b.size && [...a].every(id => b.has(id))
}

function rowOf(tree: HTMLElement | null, id: string): HTMLElement | null {
  if (tree == null)
    return null
  return [...tree.querySelectorAll<HTMLElement>('[data-tree-id]')].find(row => row.dataset.treeId === id) ?? null
}

export function useTreeLayoutMotion(options: TreeLayoutMotionOptions): TreeLayoutMotion {
  const exitingIds = shallowRef<ReadonlySet<string>>(new Set())
  let pending: PendingChange[] = []

  function endExit(id: string): void {
    if (!exitingIds.value.has(id))
      return
    const next = new Set(exitingIds.value)
    next.delete(id)
    exitingIds.value = next
  }

  function measureChanges(handle: AnimatedLayout, previous: ReadonlySet<string>, current: ReadonlySet<string>): void {
    const changed = [
      ...[...previous].filter(id => !current.has(id)),
      ...[...current].filter(id => !previous.has(id)),
    ]
    const rows = new Map<string, HTMLElement>()
    for (const id of changed) {
      const row = rowOf(options.tree(), id)
      if (row != null)
        rows.set(id, row)
    }
    // 变了的行套在另一个变了的行里（父行收起时子行还展开着），不算单独的变化：
    // 它的子组跟着外层一起走，后面的内容只动一次。
    const outerOf = (row: HTMLElement): string | undefined =>
      [...rows].find(([, other]) => other !== row && other.contains(row))?.[0]
    const nested = new Map<string, string[]>()
    for (const [id, row] of rows) {
      const outer = outerOf(row)
      if (outer != null)
        nested.set(outer, [...(nested.get(outer) ?? []), id])
    }
    for (const [id, row] of rows) {
      if (outerOf(row) != null)
        continue
      applyLayoutChangeTransition(handle, row.querySelector<HTMLElement>(CHEVRON))
      const change = reportLayoutChange(handle, () => row)
      change.measureBefore()
      pending.push({ change, id, isExpanding: current.has(id), nested: nested.get(id) ?? [] })
    }
  }

  watch(options.expandedIds, (current, previous) => {
    const handle = options.animatedLayout()
    if (handle == null || sameIds(current, previous))
      return
    const next = new Set(exitingIds.value)
    for (const id of previous) {
      if (!current.has(id))
        next.add(id)
    }
    for (const id of current)
      next.delete(id)
    exitingIds.value = next
    measureChanges(handle, previous, current)
  }, { flush: 'pre' })

  watch(options.expandedIds, () => {
    const changes = pending
    pending = []
    const handle = options.animatedLayout()
    for (const item of changes) {
      const isMeasured = item.change.animate()
      const group = rowOf(options.tree(), item.id)?.querySelector<HTMLElement>(':scope > [role="group"]') ?? null
      if (item.isExpanding) {
        if (group != null) {
          // 退场途中又展开：子组回到正常排版的位置。
          releaseLayoutExit(group)
          if (isMeasured)
            playLayoutChange(handle, group)
        }
        continue
      }
      const endAll = (): void => {
        endExit(item.id)
        item.nested.forEach(endExit)
      }
      const isHeld = isMeasured && group != null && holdLayoutExit(handle, group, endAll)
      // 没被接住的退场（不在可见区域、减少动态效果配精确指针、没有空间可让）当帧移除。
      if (!isHeld)
        endAll()
    }
  }, { flush: 'post' })

  // 没有句柄时箭头用主题自己的过渡：句柄设过的行内值只在传着句柄时保留。
  function clearChevronsWithoutHandle(): void {
    if (options.animatedLayout() != null)
      return
    for (const chevron of options.tree()?.querySelectorAll<HTMLElement>(CHEVRON) ?? [])
      applyLayoutChangeTransition(null, chevron)
  }
  onMounted(clearChevronsWithoutHandle)
  watch(options.animatedLayout, clearChevronsWithoutHandle, { flush: 'post' })

  return { exitingIds }
}
