import type { Ref } from 'vue'
import type { DismissEscape } from '../layer/dismissStack.js'
import { onScopeDispose, watch } from 'vue'
import { isTopLayer, pushLayer } from '../layer/dismissStack.js'
import { useLayerDepth } from '../layer/layerDepth.js'

/**
 * 把底部面板登记进全页关闭栈。
 *
 * 点在外面不关：遮罩点击由对话框自己认，非模态时页面还要能点。
 * Escape 只打最上面一层。退出动画还在屏幕上时继续占着栈，按键不会漏到后面。
 */
export function useSheetLayerDismiss(options: {
  isActive: Ref<boolean>
  escape: Ref<DismissEscape>
  getContainer: () => HTMLElement | null
  isPresent: () => boolean
  onDismiss: () => void
}): { isTop: () => boolean } {
  const depth = useLayerDepth()
  const token = {}
  let stop: (() => void) | null = null

  function sync(): void {
    stop?.()
    stop = null
    if (!options.isActive.value)
      return
    stop = pushLayer({
      token,
      depth,
      getContainer: options.getContainer,
      dismissOnPointerOutside: false,
      dismissOnEscape: options.escape.value,
      isPresent: options.isPresent,
      onDismiss: options.onDismiss,
    })
  }

  watch([options.isActive, options.escape], sync, { immediate: true })
  onScopeDispose(() => {
    stop?.()
    stop = null
  })

  return {
    isTop: () => options.isActive.value && isTopLayer(token),
  }
}
