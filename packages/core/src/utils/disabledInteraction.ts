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
