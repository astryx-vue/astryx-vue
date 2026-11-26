import type { Ref } from 'vue'
import type { TableColumnResizeContribution } from './types.js'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { observeResize } from '../utils/sharedResizeObserver.js'

/**
 * 窗口的宽度，由根元素上共用的尺寸观察器在布局之后报告，渲染时不读布局。
 * 没有订阅者时为 `null`；服务端渲染也是 `null`，所以首屏不带替代上限。
 */
const windowWidth = ref<number | null>(null)
let subscribers = 0
let stopObserving: (() => void) | null = null

function subscribeWindowWidth(): () => void {
  subscribers += 1
  stopObserving ??= observeResize(document.documentElement, () => {
    windowWidth.value = window.innerWidth
  })
  return () => {
    subscribers -= 1
    if (subscribers === 0) {
      stopObserving?.()
      stopObserving = null
      windowWidth.value = null
    }
  }
}

/** 拖动把手念给读屏的数值范围。 */
export interface ColumnResizeAriaValue {
  now: number
  min: number
  max: number | undefined
  text: string | undefined
}

/**
 * 列宽把手的 `aria-value*`。
 *
 * 当前值是这一列实际渲染出的宽度（观察表头格得到），没量到之前退到插件给的宽度，再退到最窄宽度。
 * 没有最大宽度的列，ARIA 会默认上限 100，比多数列宽还小，所以用窗口宽度当替代上限，
 * 并且不低于当前值和最窄宽度；这个上限不是真实限制，所以再用 `aria-valuetext` 念出像素数。
 * 布局可能把列撑到上下限以外，这时宣布的范围放宽到能装下当前值。
 */
export function useColumnResizeAria(widthText: (width: number) => string): {
  observeHandle: (key: string, element: unknown) => void
  ariaValue: (key: string, contribution: TableColumnResizeContribution | null | undefined) => ColumnResizeAriaValue
  measured: Readonly<Map<string, number>>
  windowWidth: Readonly<Ref<number | null>>
} {
  const measured = reactive(new Map<string, number>())
  const observed = new Map<string, { cell: Element, stop: () => void }>()

  function observeHandle(key: string, element: unknown): void {
    const cell = element instanceof HTMLElement ? element.closest('th') : null
    const current = observed.get(key)
    if (current?.cell === cell)
      return
    current?.stop()
    observed.delete(key)
    if (cell == null) {
      measured.delete(key)
      return
    }
    const stop = observeResize(cell, (entry) => {
      const width = entry.borderBoxSize?.[0]?.inlineSize ?? cell.getBoundingClientRect().width
      if (width > 0)
        measured.set(key, Math.round(width))
    })
    observed.set(key, { cell, stop })
  }

  let unsubscribe: (() => void) | null = null
  onMounted(() => {
    unsubscribe = subscribeWindowWidth()
  })
  onBeforeUnmount(() => {
    unsubscribe?.()
    for (const { stop } of observed.values())
      stop()
    observed.clear()
  })

  function ariaValue(key: string, contribution: TableColumnResizeContribution | null | undefined): ColumnResizeAriaValue {
    const minWidth = contribution?.minWidth ?? 0
    const maxWidth = contribution?.maxWidth ?? Number.POSITIVE_INFINITY
    const now = measured.get(key) ?? contribution?.currentWidth ?? minWidth
    const isUnbounded = !Number.isFinite(maxWidth)
    const extent = windowWidth.value
    return {
      now,
      min: Math.min(minWidth, now),
      max: isUnbounded
        ? extent == null ? undefined : Math.max(extent, now, minWidth)
        : Math.max(maxWidth, now),
      text: isUnbounded ? widthText(Math.round(now)) : undefined,
    }
  }

  return { observeHandle, ariaValue, measured, windowWidth }
}
