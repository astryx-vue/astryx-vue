import { onScopeDispose } from 'vue'
import { isTopLayer, pushLayer } from './dismissStack.js'
import { useLayerDepth } from './layerDepth.js'

/**
 * Tooltip 和 HoverCard 共用的关闭登记。
 *
 * 整段生命周期都留在栈里。没打开时 `isPresent` 为假，不会吃掉别人的 Escape。
 * 嵌套深度在 setup 时从外层读一次。同一提示再打开仍用原来的排位号，
 * 但包在别的浮层里面时深度更大，Escape 先关它。
 */
export function useHoverLayerDismiss(options: {
  /** 这一层此刻是否在屏幕上，按下时读。 */
  isPresent: () => boolean
  /** 气泡元素。点外面不用它；深度相同时才靠它看包含关系。 */
  getContainer: () => HTMLElement | null
  /** Escape 打到这一层时关掉它。 */
  onDismiss: () => void
}): { isTop: () => boolean } {
  const depth = useLayerDepth()
  const token = {}
  const stop = pushLayer({
    token,
    depth,
    getContainer: options.getContainer,
    dismissOnPointerOutside: false,
    dismissOnEscape: 'close',
    isPresent: options.isPresent,
    onDismiss: options.onDismiss,
  })
  onScopeDispose(stop)
  return { isTop: () => isTopLayer(token) }
}
