import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'
import { getFocusables } from '../layer/focus.js'

export interface UseFocusTrapOptions {
  /** 要陷阱焦点的容器元素。不传时由 hook 自己建一个，从返回值的 `containerRef` 取。 */
  container?: Ref<HTMLElement | null>
  /** 是否启用焦点陷阱 */
  isEnabled?: MaybeRefOrGetter<boolean>
  /** 同一个开关，原版的名字。两者任一为真即启用。 */
  isActive?: MaybeRefOrGetter<boolean>
  /** 容器里按下 Escape 时调用。不传就不管这个键。 */
  onEscape?: () => void
  /** 初始焦点目标（可选） */
  initialFocus?: () => HTMLElement | null
}

export interface FocusTrap {
  /** 陷阱容器。传了 `container` 时就是它，没传时是这里新建的。 */
  containerRef: Ref<HTMLElement | null>
  /** 手动更新可聚焦元素列表 */
  update: () => void
  /** 聚焦到陷阱内的第一个元素 */
  focusFirst: () => void
  /** 聚焦到陷阱内的最后一个元素 */
  focusLast: () => void
}

/**
 * 在容器内陷阱键盘焦点，按 Tab 时循环聚焦容器内的可聚焦元素。
 * 用于模态对话框、抽屉等需要限制焦点范围的浮层组件。
 *
 * 打开时把焦点送进容器，关闭或卸载时把焦点还给打开前聚焦的元素；
 * 焦点从没进过容器、或者已经被别处拿走时不还。
 */
export function useFocusTrap(options: UseFocusTrapOptions = {}): FocusTrap {
  const containerRef = options.container ?? ref<HTMLElement | null>(null)

  /** 打开陷阱前聚焦的元素，关闭时还给它。 */
  let previouslyFocused: HTMLElement | null = null
  /** 焦点是否进过陷阱。没进过就不还焦点，免得抢走浮层触发器的焦点。 */
  let hasFocusEntered = false

  function isActive(): boolean {
    return toValue(options.isActive) ?? toValue(options.isEnabled) ?? false
  }

  function isFocusInside(): boolean {
    const el = containerRef.value
    if (el == null || typeof document === 'undefined')
      return false
    const active = document.activeElement
    return active != null && el.contains(active)
  }

  function isTargetInside(event: Event): boolean {
    const el = containerRef.value
    return el != null && event.target instanceof Node && el.contains(event.target)
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!isActive())
      return

    if (event.key === 'Escape') {
      if (options.onEscape != null && (isTargetInside(event) || isFocusInside()))
        options.onEscape()
      return
    }

    if (event.key !== 'Tab')
      return

    const el = containerRef.value
    if (!el || !el.contains(event.target as Node))
      return

    const focusables = getFocusables(el)
    if (focusables.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = typeof document !== 'undefined' ? document.activeElement : null

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function onFocusIn(): void {
    if (isFocusInside())
      hasFocusEntered = true
  }

  function update(): void {
    // 预留方法，未来可以在此更新可聚焦元素缓存
  }

  function focusFirst(): void {
    const el = containerRef.value
    if (!el)
      return
    const focusables = getFocusables(el)
    if (focusables.length > 0)
      focusables[0].focus()
  }

  function focusLast(): void {
    const el = containerRef.value
    if (!el)
      return
    const focusables = getFocusables(el)
    if (focusables.length > 0)
      focusables[focusables.length - 1].focus()
  }

  function activate(): void {
    if (typeof document !== 'undefined') {
      const active = document.activeElement
      previouslyFocused = active instanceof HTMLElement && active !== document.body ? active : null
    }
    hasFocusEntered = false
    setup()
    // 如果提供了初始焦点目标，立即聚焦
    const target = options.initialFocus?.()
    if (target) {
      target.focus()
    }
    else {
      focusFirst()
    }
    if (isFocusInside())
      hasFocusEntered = true
  }

  function restoreFocus(): void {
    const target = previouslyFocused
    const hasEntered = hasFocusEntered
    previouslyFocused = null
    hasFocusEntered = false
    if (target == null || !hasEntered || !target.isConnected)
      return
    // 焦点已经被应用挪到别处了，就不要抢回来。
    const active = typeof document === 'undefined' ? null : document.activeElement
    if (active != null && active !== document.body && !isFocusInside())
      return
    target.focus()
  }

  function deactivate(): void {
    teardown()
    restoreFocus()
  }

  function setup(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeyDown, true)
      document.addEventListener('focusin', onFocusIn, true)
    }
  }

  function teardown(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('focusin', onFocusIn, true)
    }
  }

  watch(isActive, (enabled) => {
    if (enabled)
      activate()
    else
      deactivate()
  }, { immediate: true })

  onScopeDispose(deactivate)

  return { containerRef, focusFirst, focusLast, update }
}
