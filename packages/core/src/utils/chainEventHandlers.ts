/**
 * 把多个事件处理函数串成一个。每个函数都会按参数顺序执行。
 *
 * 和「前一个调用了 preventDefault 就跳过后面」不同：组件自己的处理函数
 * 不能把事件藏起来，调用方也不能用 preventDefault 取消组件的行为。
 */
export function chainEventHandlers<E>(
  ...handlers: (((event: E) => void) | undefined)[]
): (event: E) => void {
  return (event) => {
    for (const handler of handlers)
      handler?.(event)
  }
}
