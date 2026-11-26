import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'
import { isImeKeyEvent } from '../utils/ime.js'
import { attemptFocus, collapseRadioGroups, focusablesIn, hasInnerRegionHolding, precedes, registerRegion } from './internal/focusRegion.js'
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

  function isActive(): boolean {
    return toValue(options.isActive) ?? toValue(options.isEnabled) ?? false
  }

  /** 陷阱所在的文档：容器自己的。传送进同源 iframe 或画中画窗口的浮层，按键和焦点事件只发生在那个文档里。 */
  function trapDocument(): Document | null {
    return containerRef.value?.ownerDocument ?? (typeof document === 'undefined' ? null : document)
  }

  function isFocusInside(): boolean {
    const el = containerRef.value
    const active = trapDocument()?.activeElement
    return el != null && active != null && el.contains(active)
  }

  function isTargetInside(event: Event): boolean {
    const el = containerRef.value
    return el != null && event.target instanceof Node && el.contains(event.target)
  }

  /** 把焦点绕到 `target`，只有焦点真的过去了才拦下这次 Tab；被拒绝时（被上层模态盖住）交给浏览器。 */
  function wrapFocus(event: KeyboardEvent, target: HTMLElement | undefined): void {
    if (target != null && attemptFocus(target))
      event.preventDefault()
  }

  function onEscapeKeyDown(event: KeyboardEvent): void {
    if (!isActive() || event.key !== 'Escape')
      return
    if (event.defaultPrevented || isImeKeyEvent(event))
      return
    if (options.onEscape != null && (isTargetInside(event) || isFocusInside()))
      options.onEscape()
  }

  /** Tab 在冒泡阶段处理，内容里自己接住 Tab 的控件先有机会取消它。 */
  function onTabKeyDown(event: KeyboardEvent): void {
    if (!isActive())
      return
    // Ctrl+Tab 和 Meta+Tab 是切标签页或切应用，不移动焦点，留给浏览器。Alt+Tab 照常处理：Safari 用 Option+Tab 逐项移动焦点。
    if (event.key !== 'Tab' || event.ctrlKey || event.metaKey)
      return
    // 自己处理了 Tab 的控件（比如按 Tab 缩进的编辑器）让焦点留在原地。
    if (event.defaultPrevented)
      return

    const el = containerRef.value
    const active = trapDocument()?.activeElement ?? null
    if (el == null || active == null || !el.contains(active))
      return
    // 嵌套在里面的区域（对话框里开的对话框、抽屉里的 Popover）握着焦点时，由它来接这次 Tab。
    if (hasInnerRegionHolding(el, active))
      return

    const focusables = focusablesIn(el)
    if (focusables.length === 0) {
      // 没有地方可去。焦点留在当前的程序聚焦目标上（例如 tabindex=-1 的对话框面板），不放到背景内容里。
      event.preventDefault()
      return
    }

    const stops = collapseRadioGroups(focusables, active)
    const first = stops[0]
    const last = stops[stops.length - 1]

    if (active === el) {
      // 程序把初始焦点放在了容器自己身上，Tab 要进入可聚焦元素的循环，而不是逃出去。
      wrapFocus(event, event.shiftKey ? last : first)
      return
    }

    // 程序聚焦的元素也可能不是 Tab 落脚点（例如 tabindex=-1 的标题）。按它在文档里的位置判断是不是已经到头。
    const isProgrammaticStop = !focusables.includes(active as HTMLElement)
    if (event.shiftKey) {
      if (active === first || (isProgrammaticStop && first != null && precedes(active, first)))
        wrapFocus(event, last)
    }
    else if (active === last || (isProgrammaticStop && last != null && precedes(last, active))) {
      wrapFocus(event, first)
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
    for (const element of focusablesIn(el)) {
      if (attemptFocus(element))
        return
    }
  }

  function focusLast(): void {
    const el = containerRef.value
    if (!el)
      return
    for (const element of focusablesIn(el).reverse()) {
      if (attemptFocus(element))
        return
    }
  }

  function activate(): void {
    trackInteractionModality()
    const doc = trapDocument()
    if (doc != null) {
      const active = doc.activeElement
      previouslyFocused = active instanceof HTMLElement && active !== doc.body ? active : null
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
    const doc = trapDocument()
    const active = doc?.activeElement ?? null
    if (active != null && active !== doc?.body && !isFocusInside())
      return
    focusForLastInput(target)
  }

  function deactivate(): void {
    teardown()
    restoreFocus()
  }

  let listeningDoc: Document | null = null

  function setup(): void {
    teardown()
    const doc = trapDocument()
    if (doc == null)
      return
    listeningDoc = doc
    doc.addEventListener('keydown', onEscapeKeyDown, true)
    doc.addEventListener('keydown', onTabKeyDown)
    doc.addEventListener('focusin', onFocusIn, true)
  }

  function teardown(): void {
    const doc = listeningDoc
    listeningDoc = null
    if (doc == null)
      return
    doc.removeEventListener('keydown', onEscapeKeyDown, true)
    doc.removeEventListener('keydown', onTabKeyDown)
    doc.removeEventListener('focusin', onFocusIn, true)
  }

  // 容器晚于开关出现（或换了文档）时，监听跟着挪过去；同时登记为启用中的区域，好让外层区域把 Tab 让给它。
  let unregister: (() => void) | null = null
  watch([isActive, containerRef], ([enabled, container]) => {
    unregister?.()
    unregister = enabled && container != null ? registerRegion(container) : null
    if (enabled && listeningDoc != null && container != null && container.ownerDocument !== listeningDoc)
      setup()
  }, { immediate: true })

  watch(isActive, (enabled) => {
    if (enabled)
      activate()
    else
      deactivate()
  }, { immediate: true })

  onScopeDispose(() => {
    unregister?.()
    unregister = null
    deactivate()
  })

  return { containerRef, focusFirst, focusLast, update }
}
