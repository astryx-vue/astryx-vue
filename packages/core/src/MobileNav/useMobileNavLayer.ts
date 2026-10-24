import type { Ref } from 'vue'
import { onScopeDispose, watch } from 'vue'
import { isTopLayer, pushLayer } from '../layer/dismissStack.js'
import { useLayerDepth } from '../layer/layerDepth.js'

/**
 * 抽屉打开时登记进全页关闭栈。
 * 点遮罩由对话框自己认，不在这里当「点外面」。
 * Escape 只关最上面一层。浏览器另外发出的 cancel，也要先确认自己还在最上面。
 */
export function useMobileNavLayer(options: {
  isOpen: Ref<boolean>
  getContainer: () => HTMLElement | null
  onDismiss: () => void
}): { shouldCloseOnCancel: () => boolean } {
  const depth = useLayerDepth()
  const token = {}
  let stop: (() => void) | null = null

  function sync(open: boolean): void {
    stop?.()
    stop = null
    if (!open)
      return
    stop = pushLayer({
      token,
      depth,
      getContainer: options.getContainer,
      dismissOnPointerOutside: false,
      dismissOnEscape: 'close',
      onDismiss: options.onDismiss,
    })
  }

  watch(options.isOpen, sync, { immediate: true })
  onScopeDispose(() => {
    stop?.()
    stop = null
  })

  return {
    shouldCloseOnCancel: () => options.isOpen.value && isTopLayer(token),
  }
}
