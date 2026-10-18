import type { MaybeRefOrGetter, Ref } from 'vue'
import type { ClickableContainerHandlers } from './useClickableContainer.js'
import { toValue } from 'vue'
import { useClickableContainer } from './useClickableContainer.js'

/** 点了以后接焦点的输入框类型：这些类型自己不会因为点击容器而聚焦。 */
const TEXT_LIKE_INPUT_TYPES = new Set([
  'text',
  'search',
  'email',
  'url',
  'tel',
  'password',
  'number',
  'date',
  'datetime-local',
  'month',
  'week',
  'time',
])

export interface UseInputContainerOptions {
  /** 外层容器，也就是要变成可点的那一圈。 */
  containerRef: Ref<HTMLElement | null>
  /** 容器里真正的输入框或文本域。 */
  inputRef: Ref<HTMLElement | null>
  /**
   * 输入框停用时不接管点击。
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
}

export type InputContainerHandlers = ClickableContainerHandlers

/** 文本类控件拿 `.focus()`，复选框、单选框、文件这类拿 `.click()`。 */
function isTextLike(element: HTMLElement): boolean {
  if (element instanceof HTMLTextAreaElement)
    return true
  if (element instanceof HTMLInputElement)
    return TEXT_LIKE_INPUT_TYPES.has(element.type)
  return element.isContentEditable
}

/**
 * 对应原版 Astryx 的 `hooks/useInputContainer`。
 *
 * 让输入框外面那一圈也能点：点在图标、内边距、状态图标这些没交互的地方时，
 * 交给里面的输入框接焦点。底座是 `useClickableContainer`，所以清空按钮、
 * 日历开关、链接这些嵌套的控件点上去还是它们自己的事，不会把焦点抢走。
 *
 * 文本类的输入框收 `.focus()`，复选框、单选框、文件这种收 `.click()`。
 * TextInput、TextArea 这类把输入框包起来、外面还有一圈装饰的组件用它。
 */
export function useInputContainer(options: UseInputContainerOptions): InputContainerHandlers {
  function focusInput(): void {
    const input = options.inputRef.value
    if (input == null)
      return
    if (isTextLike(input))
      input.focus({ preventScroll: true })
    else
      input.click()
  }

  return useClickableContainer({
    containerRef: options.containerRef,
    get disabled() {
      return toValue(options.disabled ?? false)
    },
    onClick: () => focusInput(),
  })
}
