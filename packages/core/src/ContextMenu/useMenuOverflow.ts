import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * Whether a menu panel's content is taller than the panel.
 *
 * A menu that scrolls has to hand vertical panning to the browser so a finger
 * can scroll its rows; a menu that does not scroll keeps the gesture, so the
 * press model can follow the finger across rows instead of the page.
 */
export function useMenuOverflow(panel: Ref<HTMLElement | null>, isOpen: Ref<boolean>): Ref<boolean> {
  const hasOverflow = ref(false)
  let observer: ResizeObserver | null = null

  function update(): void {
    const element = panel.value
    hasOverflow.value = element != null && isOpen.value && element.scrollHeight > element.clientHeight
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined')
      return
    observer = new ResizeObserver(update)
    if (panel.value != null)
      observer.observe(panel.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  watch(isOpen, (open) => {
    if (open) {
      void nextTick(update)
      return
    }
    hasOverflow.value = false
  })

  return hasOverflow
}
