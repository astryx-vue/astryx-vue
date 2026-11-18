/**
 * 保持中的气泡在 document 上挂的两组监听，抽出来让 `useTooltip` 只管状态。
 * 都返回「摘掉监听」的函数。
 */

/** 点击或滚动发生在 `isInside` 之外时调用 `onOutside`。 */
export function listenOutside(onOutside: (target: Node | null) => void): () => void {
  const handler = (event: Event): void => {
    onOutside(event.target instanceof Node ? event.target : null)
  }
  document.addEventListener('pointerdown', handler, true)
  document.addEventListener('scroll', handler, true)
  return () => {
    document.removeEventListener('pointerdown', handler, true)
    document.removeEventListener('scroll', handler, true)
  }
}

/** 一次按压的结束（抬起或取消）。`onEnd` 收到结束的事件。 */
export function listenPressEnd(onEnd: (event: Event) => void): () => void {
  function stop(): void {
    document.removeEventListener('pointerup', handler, true)
    document.removeEventListener('pointercancel', handler, true)
  }
  function handler(event: Event): void {
    stop()
    onEnd(event)
  }
  document.addEventListener('pointerup', handler, true)
  document.addEventListener('pointercancel', handler, true)
  return stop
}
