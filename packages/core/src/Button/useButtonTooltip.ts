import type { ComputedRef, ShallowRef } from 'vue'
import { onScopeDispose, shallowRef, watch } from 'vue'

const HIDE_DELAY = 100
const SHOW_DELAY = 200

interface UseButtonTooltipReturn {
  hideImmediately: () => void
  isOpen: Readonly<ShallowRef<boolean>>
  onBlur: () => void
  onFocus: (event: FocusEvent) => void
  onPointerDown: () => void
  onPointerEnter: () => void
  onPointerLeave: () => void
  onTooltipPointerEnter: () => void
  onTooltipPointerLeave: () => void
}

export function useButtonTooltip(isEnabled: ComputedRef<boolean>): UseButtonTooltipReturn {
  const isOpen = shallowRef(false)
  let showTimer: ReturnType<typeof setTimeout> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  function clearShowTimer(): void {
    if (showTimer != null)
      clearTimeout(showTimer)

    showTimer = undefined
  }

  function clearHideTimer(): void {
    if (hideTimer != null)
      clearTimeout(hideTimer)

    hideTimer = undefined
  }

  function hideImmediately(): void {
    clearShowTimer()
    clearHideTimer()
    isOpen.value = false
  }

  function showImmediately(): void {
    if (!isEnabled.value)
      return

    clearShowTimer()
    clearHideTimer()
    isOpen.value = true
  }

  function onPointerEnter(): void {
    if (!isEnabled.value)
      return

    clearShowTimer()
    clearHideTimer()
    showTimer = setTimeout(showImmediately, SHOW_DELAY)
  }

  function onPointerLeave(): void {
    clearShowTimer()
    clearHideTimer()
    hideTimer = setTimeout(hideImmediately, HIDE_DELAY)
  }

  function onFocus(event: FocusEvent): void {
    const target = event.currentTarget

    if (!(target instanceof HTMLElement))
      return

    let isFocusVisible = true

    try {
      isFocusVisible = target.matches(':focus-visible')
    }
    catch {
      // Older DOM implementations may not understand :focus-visible.
    }

    if (isFocusVisible)
      showImmediately()
  }

  function onTooltipPointerEnter(): void {
    if (!isEnabled.value)
      return

    clearHideTimer()
    isOpen.value = true
  }

  watch(isEnabled, (enabled) => {
    if (!enabled)
      hideImmediately()
  })

  onScopeDispose(() => {
    clearShowTimer()
    clearHideTimer()
  })

  return {
    hideImmediately,
    isOpen,
    onBlur: onPointerLeave,
    onFocus,
    onPointerDown: hideImmediately,
    onPointerEnter,
    onPointerLeave,
    onTooltipPointerEnter,
    onTooltipPointerLeave: onPointerLeave,
  }
}
