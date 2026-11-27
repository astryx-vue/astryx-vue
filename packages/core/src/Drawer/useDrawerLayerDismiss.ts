import type { Ref } from 'vue'
import type { DismissEscape } from '../layer/dismissStack.js'
import { onScopeDispose, watch } from 'vue'
import { pushLayer } from '../layer/dismissStack.js'
import { useLayerDepth } from '../layer/layerDepth.js'
import { isBehindModal } from './drawerHost.js'

/**
 * 把非模态抽屉登记进全页关闭栈，Escape 才关得掉它（popover 宿主自己不认 Escape）。
 *
 * 模态抽屉不登记：它和对话框一样走原生 `cancel`，在它上面再开的对话框照样先收到 Escape。
 * 点在外面不关：非模态抽屉旁边的页面本来就要能用。
 * 退场还在屏幕上时继续占着栈，Escape 不会漏到下面那一层。
 */
export function useDrawerLayerDismiss(options: {
  isActive: Ref<boolean>
  escape: Ref<DismissEscape>
  getContainer: () => HTMLDialogElement | null
  onDismiss: () => void
}): void {
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
      isPresent: () => {
        const dialog = options.getContainer()
        return dialog != null && !isBehindModal(dialog)
      },
      dismissOnPointerOutside: false,
      dismissOnEscape: options.escape.value,
      onDismiss: options.onDismiss,
    })
  }

  watch([options.isActive, options.escape], sync, { immediate: true })
  onScopeDispose(() => {
    stop?.()
    stop = null
  })
}
