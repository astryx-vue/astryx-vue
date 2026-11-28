import type { Ref } from 'vue'
import { shallowRef } from 'vue'
import { isKeyboardModality } from '../composables/internal/interactionModality.js'
import { matchesFocusVisible } from '../Tooltip/tooltipTriggerRules.js'
import { isTextCut, visibleText } from './cutText.js'

export interface CutTextOnKeyboardFocusOptions {
  /** 焦点到达、提示挂靠的元素。 */
  anchor: () => HTMLElement | null
  /** 文字被截短的那个元素；不传就是 anchor 本身。 */
  measure?: () => HTMLElement | null
  isEnabled: () => boolean
  /** 返回 true 表示已经有别的提示在描述 anchor。 */
  isSuppressed?: (anchor: HTMLElement) => boolean
}

export interface CutTextOnKeyboardFocus {
  /** 键盘焦点在里面、且文字确实被截短时是完整文字，否则为 null。 */
  cutText: Readonly<Ref<string | null>>
  /** 关掉提示（Escape）。 */
  hide: () => void
  onFocusin: (event: FocusEvent) => void
  onFocusout: (event: FocusEvent) => void
  /** 按下就关，和别的提示一样。 */
  onPointerdown: () => void
}

/**
 * 组件自己的文字（按钮标签、表头标题）被截短时，键盘焦点到达就在提示里显示完整文字。
 * 只在聚焦那一刻测量，平时什么都不量；悬停、指针点进的输入框和手指轻点都不显示。
 * 提示的内容就是元素自己的名称，所以它不挂 aria-describedby，读屏只读一遍名称。
 */
export function useCutTextOnKeyboardFocus(options: CutTextOnKeyboardFocusOptions): CutTextOnKeyboardFocus {
  const cutText = shallowRef<string | null>(null)

  function hide(): void {
    cutText.value = null
  }

  function onFocusin(event: FocusEvent): void {
    const anchor = options.anchor()
    const measured = options.measure?.() ?? anchor
    const target = event.target
    // `:focus-visible` 也会命中指针点进的输入框，所以还要看上一次是不是键盘操作。
    if (
      !options.isEnabled()
      || anchor == null
      || measured == null
      || !(target instanceof Element)
      || !anchor.contains(target)
      || !matchesFocusVisible(target)
      || !isKeyboardModality()
    ) {
      return
    }
    const text = visibleText(measured)
    const isCut = text !== '' && !(options.isSuppressed?.(anchor) ?? false) && isTextCut(measured)
    cutText.value = isCut ? text : null
  }

  function onFocusout(event: FocusEvent): void {
    const next = event.relatedTarget
    if (next instanceof Node && options.anchor()?.contains(next))
      return
    hide()
  }

  return { cutText, hide, onFocusin, onFocusout, onPointerdown: hide }
}
