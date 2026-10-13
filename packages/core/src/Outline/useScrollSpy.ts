import type { ComputedRef, Ref } from 'vue'
import type { OutlineItem } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getScrollableAncestor, resolveActiveId, scrollToTarget } from './scrollGeometry.js'

const SCROLL_SETTLE_TIMEOUT_MS = 1200
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'])

export interface UseScrollSpyOptions {
  activeId: Ref<string | undefined>
  items: Ref<readonly OutlineItem[]>
  root: Ref<HTMLElement | null>
  offset: Ref<number>
  scrollContainer: Ref<HTMLElement | null | undefined>
  hasScrollOnClick: Ref<boolean>
  onActive: (id: string) => void
  onNavigateStart?: (id: string) => void
  onNavigateEnd?: (id: string) => void
}

export function useScrollSpy(options: UseScrollSpyOptions): {
  resolvedId: ComputedRef<string | undefined>
  scrollTo: (id: string) => boolean
} {
  const isControlled = computed(() => options.activeId.value !== undefined)
  const uncontrolledId = ref(options.items.value[0]?.id)
  const resolvedId = computed(() => isControlled.value ? options.activeId.value : uncontrolledId.value)
  const suppressed = ref(false)
  let navigation: { supersede: () => void } | null = null

  function scrollRoot(): HTMLElement | null {
    const explicit = options.scrollContainer.value
    if (explicit)
      return explicit
    return getScrollableAncestor(options.root.value)
  }

  function sync(): void {
    if (isControlled.value || suppressed.value)
      return
    const next = resolveActiveId(options.items.value, scrollRoot(), options.offset.value)
    if (next != null && next !== uncontrolledId.value) {
      uncontrolledId.value = next
      options.onActive(next)
    }
  }

  function scrollTo(id: string): boolean {
    const target = typeof document === 'undefined' ? null : document.getElementById(id)
    if (target == null)
      return false

    navigation?.supersede()
    options.onNavigateStart?.(id)

    if (isControlled.value)
      options.onActive(id)
    else
      suppressed.value = true

    const root = scrollRoot()
    const targetScroller: HTMLElement | Window = root ?? window
    let settled = false
    let timer = 0

    function cleanup(): void {
      targetScroller.removeEventListener('scrollend', onSettle)
      targetScroller.removeEventListener('wheel', onManual)
      targetScroller.removeEventListener('touchmove', onManual)
      window.removeEventListener('keydown', onKeyDown)
      if (timer !== 0)
        clearTimeout(timer)
      navigation = null
    }

    function finish(didArrive: boolean, shouldResume = true): void {
      if (settled)
        return
      settled = true
      cleanup()
      if (!isControlled.value) {
        suppressed.value = false
        if (didArrive) {
          uncontrolledId.value = id
          options.onActive(id)
        }
        else if (shouldResume) {
          sync()
        }
      }
      options.onNavigateEnd?.(id)
    }

    function onSettle(): void {
      finish(true)
    }

    function onManual(): void {
      finish(false)
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (!event.defaultPrevented && SCROLL_KEYS.has(event.key))
        finish(false)
    }

    if (options.hasScrollOnClick.value) {
      targetScroller.addEventListener('scrollend', onSettle)
      targetScroller.addEventListener('wheel', onManual, { passive: true })
      targetScroller.addEventListener('touchmove', onManual, { passive: true })
      window.addEventListener('keydown', onKeyDown)
      timer = window.setTimeout(onSettle, SCROLL_SETTLE_TIMEOUT_MS)
      navigation = { supersede: () => finish(false, false) }
      scrollToTarget(target, root, targetScroller, options.offset.value)
    }
    else {
      finish(true)
    }
    return true
  }

  let listened: HTMLElement | Window | null = null

  onMounted(() => {
    sync()
    listened = scrollRoot() ?? window
    listened.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
  })

  onBeforeUnmount(() => {
    listened?.removeEventListener('scroll', sync)
    window.removeEventListener('resize', sync)
    navigation?.supersede()
  })

  watch(() => options.items.value.map(item => item.id).join('\n'), () => {
    if (!isControlled.value && (uncontrolledId.value == null || !options.items.value.some(item => item.id === uncontrolledId.value)))
      uncontrolledId.value = options.items.value[0]?.id
    sync()
  })

  return { resolvedId, scrollTo }
}
