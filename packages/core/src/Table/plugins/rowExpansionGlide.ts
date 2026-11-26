/**
 * @file rowExpansionGlide.ts
 * @position Table 行展开插件内部：带 `animatedLayout` 句柄时，展开或收起一行的面板，
 *   后面的行滑到新位置而不是跳过去，分隔线跟着行走（glidingDivider.ts），展开的面板播放入场，
 *   箭头按同样的节奏转动。
 *
 * DOM 变化前（`flush: 'pre'`）量好每个变化的行；DOM 变化后（`flush: 'post'`）播放滑动。
 * 收起的面板让表格的滚动容器立刻变矮，往上滑的行会在到位前被它的新底边裁掉：滑动期间，
 * 容器用底部内边距留住面板让出的高度，再用相同的负外边距抵消，表格后面的内容照常移动；
 * 行停下时两者一起撤掉。
 */
import type { AnimatedLayout, LayoutChange } from '../../motion/layout/index.js'
import type { BottomEdge } from '../glidingDivider.js'
import { watch } from 'vue'
import {
  applyLayoutChangeTransition,
  glideOf,
  playLayoutChange,
  reportLayoutChange,
} from '../../motion/layout/index.js'
import { dividerOffset, markGlidingRows, rowEdge } from '../glidingDivider.js'

const CHEVRON = '.astryx-table__chevron-icon'
export const EXPANSION_KEY_ATTRIBUTE = 'data-expansion-key'

interface PendingChange {
  change: LayoutChange
  key: string
  isExpanding: boolean
}

interface MovedRow {
  row: HTMLElement
  panel: HTMLElement | null
  entrance: Animation | null
  panelOffset: number | null
  edges: Map<Element, BottomEdge>
}

export interface RowExpansionGlideOptions {
  animatedLayout: () => AnimatedLayout | null | undefined
  expandedKeys: () => ReadonlySet<string>
}

export interface RowExpansionGlide {
  /** 插件的 `bindScrollRoot`：表格的滚动容器挂上或卸下时调用。 */
  bindScrollRoot: (element: HTMLElement | null) => void
}

export function useRowExpansionGlide(options: RowExpansionGlideOptions): RowExpansionGlide {
  let wrapper: HTMLElement | null = null
  let pending: PendingChange[] = []
  /** 这次收起的面板让出的高度（和位置一起量）。 */
  let closedHeight = 0
  /** 滑动期间滚动容器留住的高度。 */
  let heldHeight = 0
  /** 容器自己的底部内边距和外边距（容器的出血），留高度时在它们上面加。 */
  let holdBase: { padding: number, margin: number } | null = null

  /** 只找这张表自己 tbody 里的行：面板里嵌套的表格可能用同样的行 key。 */
  function rowFor(key: string): HTMLElement | null {
    const table = wrapper?.querySelector('table')
    const body = [...(table?.children ?? [])].find(child => child.tagName === 'TBODY')
    const row = [...(body?.children ?? [])].find(child => child.getAttribute(EXPANSION_KEY_ATTRIBUTE) === key)
    return row instanceof HTMLElement ? row : null
  }

  /** 箭头回到主题自己的转动：句柄设的过渡只在传着句柄时保留。只管这张表自己的箭头。 */
  function resetChevrons(): void {
    const table = wrapper?.querySelector('table')
    for (const glyph of table?.querySelectorAll<HTMLElement>(CHEVRON) ?? []) {
      if (glyph.closest('table') === table)
        applyLayoutChangeTransition(null, glyph)
    }
  }

  function measure(handle: AnimatedLayout, key: string, isExpanding: boolean): void {
    const row = rowFor(key)
    if (row == null)
      return
    const change = reportLayoutChange(handle, () => row)
    change.measureBefore()
    const panel = row.nextElementSibling
    if (!isExpanding && panel?.hasAttribute('data-expansion-panel') === true) {
      closedHeight += panel.getBoundingClientRect().height
      if (wrapper != null && holdBase == null) {
        const style = getComputedStyle(wrapper)
        holdBase = {
          padding: Number.parseFloat(style.getPropertyValue('padding-block-end')) || 0,
          margin: Number.parseFloat(style.getPropertyValue('margin-block-end')) || 0,
        }
      }
    }
    // 量完再写，读的时候布局是干净的。
    applyLayoutChangeTransition(handle, row.querySelector<HTMLElement>(CHEVRON))
    pending.push({ change, key, isExpanding })
  }

  watch(() => [...options.expandedKeys()], (current, previous) => {
    const handle = options.animatedLayout()
    if (handle == null)
      return
    const now = new Set(current)
    const before = new Set(previous)
    for (const key of before) {
      if (!now.has(key))
        measure(handle, key, false)
    }
    for (const key of now) {
      if (!before.has(key))
        measure(handle, key, true)
    }
  }, { flush: 'pre' })

  function play(item: PendingChange, handle: AnimatedLayout | null | undefined): MovedRow | null {
    const row = rowFor(item.key)
    if (row == null) {
      item.change.animate()
      return null
    }
    const next = row.nextElementSibling
    const record: MovedRow = {
      row,
      panel: item.isExpanding && next instanceof HTMLElement && next.hasAttribute('data-expansion-panel') ? next : null,
      entrance: null,
      panelOffset: null,
      edges: new Map(),
    }
    // 在滑动读布局的地方读，赶在任何东西移动之前：先读各行的边框，再播面板入场（它也要读）。
    const isMeasured = item.change.animate((candidates) => {
      for (const candidate of candidates) {
        if (candidate instanceof HTMLTableRowElement && candidate.parentElement === row.parentElement) {
          const edge = rowEdge(candidate)
          if (edge != null)
            record.edges.set(candidate, edge)
        }
      }
      if (record.panel != null) {
        const edge = rowEdge(record.panel)
        if (edge != null) {
          record.edges.set(record.panel, edge)
          record.panelOffset = dividerOffset(record.panel, edge)
        }
        record.entrance = playLayoutChange(handle, record.panel)
      }
    })
    return isMeasured ? record : null
  }

  function hold(height: number): void {
    if (wrapper == null)
      return
    const base = holdBase ?? { padding: 0, margin: 0 }
    if (height > 0) {
      wrapper.style.setProperty('padding-block-end', `${base.padding + height}px`)
      wrapper.style.setProperty('margin-block-end', `${base.margin - height}px`)
      return
    }
    wrapper.style.removeProperty('padding-block-end')
    wrapper.style.removeProperty('margin-block-end')
    holdBase = null
  }

  watch(() => [...options.expandedKeys()], () => {
    const changes = pending
    pending = []
    const handle = options.animatedLayout()
    const moved = changes.map(item => play(item, handle)).filter((record): record is MovedRow => record != null)
    const held = moved.length > 0 ? closedHeight : 0
    closedHeight = 0
    if (heldHeight === 0 && held <= 0.5)
      holdBase = null
    if (moved.length === 0)
      return
    // 滑动在 animate() 排下的微任务里开始；这个微任务排在它后面、画帧之前，只写不读。
    queueMicrotask(() => {
      const stopped = Promise.all(moved.map(async ({ row, panel, entrance, panelOffset, edges }) =>
        markGlidingRows(
          row,
          edges,
          panel != null && entrance != null ? { row: panel, animation: entrance, offset: panelOffset } : null,
          glideOf,
        ),
      ))
      if (held <= 0.5 || wrapper == null)
        return
      heldHeight += held
      hold(heldHeight)
      void stopped.then(() => {
        heldHeight = Math.max(0, heldHeight - held)
        hold(heldHeight)
      })
    })
  }, { flush: 'post' })

  watch(options.animatedLayout, (handle) => {
    if (handle == null)
      resetChevrons()
  }, { flush: 'post' })

  return {
    bindScrollRoot(element) {
      wrapper = element
      if (element != null && options.animatedLayout() == null)
        resetChevrons()
    },
  }
}
