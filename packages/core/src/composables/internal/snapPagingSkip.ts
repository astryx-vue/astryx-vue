import type { SnapTrack } from './snapPagingTrack.js'

/**
 * 原生吸附要跳过末端那一页吞掉的项（见 `snapPages`），这样滚轮、方向键和
 * 普通滚动也停在和轻扫同样的页上。被跳过的项交还时恢复自己原来的行内值。
 * 停点随尺寸和子项变化，最多一帧算一次；分页按住这一行时，等交还时再写。
 */
export function followSkippedStops(element: HTMLElement, track: SnapTrack): {
  /** 交还前要做的写入；没有待写的就返回 undefined。 */
  readonly takeDue: () => (() => void) | undefined
  readonly stop: () => void
} {
  const skipped = new Map<HTMLElement, { value: string, priority: string }>()
  let frame: number | null = null
  let isDue = false

  function restore(item: HTMLElement, own: { value: string, priority: string }): void {
    if (own.value === '')
      item.style.removeProperty('scroll-snap-align')
    else
      item.style.setProperty('scroll-snap-align', own.value, own.priority)
  }

  function skip(items: readonly Element[]): void {
    for (const [item, own] of skipped) {
      if (!items.includes(item)) {
        skipped.delete(item)
        restore(item, own)
      }
    }
    for (const item of items) {
      if (item instanceof HTMLElement && !skipped.has(item)) {
        skipped.set(item, {
          value: item.style.getPropertyValue('scroll-snap-align'),
          priority: item.style.getPropertyPriority('scroll-snap-align'),
        })
        item.style.setProperty('scroll-snap-align', 'none')
      }
    }
  }

  function apply(): void {
    isDue = false
    skip(track.pages().skipped)
  }

  function schedule(): void {
    if (track.isHeld()) {
      isDue = true
      return
    }
    if (frame != null || typeof requestAnimationFrame !== 'function')
      return
    frame = requestAnimationFrame(() => {
      frame = null
      if (track.isHeld())
        isDue = true
      else
        apply()
    })
  }

  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
  function observeItems(): void {
    if (resize == null)
      return
    resize.disconnect()
    resize.observe(element)
    for (const item of Array.from(element.children))
      resize.observe(item)
  }
  const mutations = typeof MutationObserver === 'undefined'
    ? null
    : new MutationObserver(() => {
        observeItems()
        schedule()
      })
  mutations?.observe(element, { childList: true })
  observeItems()
  schedule()

  return {
    takeDue: () => isDue ? apply : undefined,
    stop() {
      mutations?.disconnect()
      resize?.disconnect()
      if (frame != null)
        cancelAnimationFrame(frame)
      frame = null
      skip([])
    },
  }
}
