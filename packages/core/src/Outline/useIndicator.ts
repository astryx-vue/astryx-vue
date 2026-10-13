import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, watch } from 'vue'

/** Place the sliding bar on the active link, measured against the track. */
export function useOutlineIndicator(root: Ref<HTMLElement | null>, activeId: Ref<string | undefined>): void {
  let frame = 0
  let observer: ResizeObserver | null = null

  function place(): void {
    const nav = root.value
    const track = nav?.querySelector<HTMLElement>('.astryx-outline__track')
    const active = nav?.querySelector<HTMLElement>('[aria-current="location"]')
    if (nav == null || track == null || active == null)
      return
    const trackRect = track.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    nav.style.setProperty('--astryx-outline-indicator-top', `${activeRect.top - trackRect.top}px`)
    nav.style.setProperty('--astryx-outline-indicator-height', `${activeRect.height}px`)
  }

  function schedule(): void {
    if (typeof requestAnimationFrame !== 'function') {
      place()
      return
    }
    if (frame !== 0)
      cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      frame = 0
      place()
    })
  }

  onMounted(() => {
    schedule()
    observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    if (root.value != null)
      observer?.observe(root.value)
    window.addEventListener('resize', schedule)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('resize', schedule)
    if (frame !== 0 && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
  })

  watch(activeId, schedule)
}
