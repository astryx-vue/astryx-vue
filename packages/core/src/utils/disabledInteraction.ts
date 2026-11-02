/**
 * @file disabledInteraction.ts
 * @input 可选的调用方 keydown 处理函数
 * @output 让可聚焦但 `aria-disabled` 的控件保持惰性的事件 props
 * @position Link、Token、ClickableCard 用 `aria-disabled` 替代原生 `disabled`
 *   时共用（spec:AST-085 FR1、FR2）
 */

/**
 * 可聚焦的禁用控件用的事件 props。原生 `disabled` 根本不会派发 click；
 * 换掉之后 Enter 和 Space 仍会合成一次 click，元素上的原生监听（例如外层
 * Popover 的触发器）会收到。这里取消这两个按键，click 处理再取消指针点击
 * 并挡住冒泡。其他按键仍然交给调用方的处理函数。
 */
const ACTIVATION_KEYS = new Set(['Enter', ' ', 'Spacebar'])

/**
 * 可聚焦的禁用控件在派出任何行为之前调用。禁用时吞掉事件并返回 `true`：
 * 回车、空格、方向键这类会触发行为或移动焦点的按键连默认行为一起取消，
 * 其他按键只拦住冒泡，保证调用方和祖先的处理函数都收不到（spec:AST-085 FR2）。
 */
export function consumeWhileDisabled(event: Event, isDisabled: boolean): boolean {
  if (!isDisabled)
    return false
  const isActivationKey = event instanceof KeyboardEvent
    && (ACTIVATION_KEYS.has(event.key) || event.key.startsWith('Arrow'))
  if (!isActivationKey) {
    event.stopPropagation()
  }
  else {
    event.preventDefault()
    event.stopPropagation()
  }
  return true
}

export function disabledInteractionProps(
  onKeyDown?: (event: KeyboardEvent) => void,
): {
  onClick: (event: MouseEvent) => void
  onKeydown: (event: KeyboardEvent) => void
} {
  return {
    onClick: (event) => {
      event.preventDefault()
      event.stopPropagation()
    },
    onKeydown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
      }
      else {
        onKeyDown?.(event)
      }
    },
  }
}
