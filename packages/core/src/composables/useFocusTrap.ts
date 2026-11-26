import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'
import { getFocusables } from '../layer/focus.js'
import { isImeKeyEvent } from '../utils/ime.js'
import { focusForLastInput } from './internal/focusReturn.js'
import { trackInteractionModality } from './internal/interactionModality.js'

export interface UseFocusTrapOptions {
  /** 要陷阱焦点的容器元素。不传时由 hook 自己建一个，从返回值的 `containerRef` 取。 */
  container?: Ref<HTMLElement | null>
  /** 是否启用焦点陷阱 */
  isEnabled?: MaybeRefOrGetter<boolean>
  /** 同一个开关，原版的名字。两者任一为真即启用。 */
  isActive?: MaybeRefOrGetter<boolean>
  /** 容器里按下 Escape 时调用。不传就不管这个键。输入法拼字时的 Escape 不算。 */
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
 * 焦点从没进过容器、或者已经被别处拿走时不还。还焦点时焦点环跟着上一次的输入走：
 * 用鼠标或手指关掉的，回到触发器上不画环。
 *
 * Tab 只在焦点真的在陷阱里面时才被拦下。浮层开着、焦点却合理地留在外面
 * （例如挂在输入框上的列表框）时，拦下 Tab 会让整个页面都没法用 Tab。
 */
export function useFocusTrap(options: UseFocusTrapOptions = {}): FocusTrap {
  const containerRef = options.container ?? ref<HTMLElement | null>(null)

  /** 打开陷阱前聚焦的元素，关闭时还给它。 */
  let previouslyFocused: HTMLElement | null = null
  /** 焦点是否进过陷阱。没进过就不还焦点，免得抢走浮层触发器的焦点。 */
  let hasFocusEntered = false

  /**
   * 陷阱所在的 document：容器的。经 Teleport 渲染进同源 iframe 或画中画窗口的陷阱，
   * 按键和焦点变化只到那个窗口的 document，全局 `document` 收不到。
   */
  function trapDocument(): Document {
    return containerRef.value?.ownerDocument ?? document
  }

  /** 正在监听的 document，摘监听时用同一个。 */
  let listeningDoc: Document | null = null

  function isActive(): boolean {
    return toValue(options.isActive) ?? toValue(options.isEnabled) ?? false
  }

  function isFocusInside(): boolean {
    const el = containerRef.value
    if (el == null || typeof document === 'undefined')
      return false
    const active = trapDocument().activeElement
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
      if (event.defaultPrevented || isImeKeyEvent(event))
        return
      if (options.onEscape != null && (isTargetInside(event) || isFocusInside()))
        options.onEscape()
      return
    }

    if (event.key !== 'Tab')
      return

    const el = containerRef.value
    if (!el || !isFocusInside())
      return

    const focusables = getFocusables(el)
    if (focusables.length === 0) {
      // 没有地方可去。焦点留在当前的程序聚焦目标上（例如 tabindex=-1 的对话框面板），不放到背景内容里。
      event.preventDefault()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = trapDocument().activeElement

    if (active === el) {
      // 程序把初始焦点放在了容器自己身上，Tab 要进入可聚焦元素的循环，而不是逃出去。
      event.preventDefault()
      if (event.shiftKey)
        last.focus()
      else
        first.focus()
      return
    }

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
    trackInteractionModality()
    if (typeof document !== 'undefined') {
      const doc = trapDocument()
      const active = doc.activeElement
      // 第二个窗口里的元素不是这个窗口的 HTMLElement 实例，按能不能聚焦来认。
      previouslyFocused = active != null && active !== doc.body && typeof (active as HTMLElement).focus === 'function'
        ? active as HTMLElement
        : null
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
    const doc = typeof document === 'undefined' ? null : trapDocument()
    const active = doc?.activeElement ?? null
    if (active != null && active !== doc?.body && !isFocusInside())
      return
    focusForLastInput(target)
  }

  function deactivate(): void {
    teardown()
    restoreFocus()
  }

  function setup(): void {
    if (typeof document === 'undefined')
      return
    teardown()
    listeningDoc = trapDocument()
    listeningDoc.addEventListener('keydown', onKeyDown, true)
    listeningDoc.addEventListener('focusin', onFocusIn, true)
  }

  function teardown(): void {
    if (listeningDoc == null)
      return
    listeningDoc.removeEventListener('keydown', onKeyDown, true)
    listeningDoc.removeEventListener('focusin', onFocusIn, true)
    listeningDoc = null
  }

  watch(isActive, (enabled) => {
    if (enabled)
      activate()
    else
      deactivate()
  }, { immediate: true })

  // 容器晚于开启才挂上、或换到了别的窗口时，监听跟着换到它的 document。
  watch(containerRef, () => {
    if (isActive() && listeningDoc !== trapDocument())
      setup()
  })

  onScopeDispose(deactivate)

  return { containerRef, focusFirst, focusLast, update }
}
