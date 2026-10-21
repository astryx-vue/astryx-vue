import { onScopeDispose } from 'vue'
import { pushLayer } from '../layer/dismissStack.js'

/**
 * 把 HoverCard 登记进全页关闭栈。
 * 指针点在外面仍由卡片自己的触摸监听处理，所以这里不响应点外面。
 */
export function registerHoverCardDismiss(options: {
  isPresent: () => boolean
  getContainer: () => HTMLElement | null
  onDismiss: () => void
}): void {
  const stop = pushLayer({
    token: {},
    getContainer: options.getContainer,
    dismissOnPointerOutside: false,
    dismissOnEscape: 'close',
    isPresent: options.isPresent,
    onDismiss: options.onDismiss,
  })
  onScopeDispose(stop)
}
