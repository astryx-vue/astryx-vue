import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

/**
 * 浮层嵌套深度。
 *
 * 关层时要比谁在上面。气泡经常被 Teleport 到 body，DOM 上的包含关系就断了。
 * provide/inject 跟着组件树走，Teleport 切不断，所以深度从这里往下传。
 * 根上是 0。每一层浮层只给自己的内容加 1，里面再开的层读到的就是更深的数字。
 */

export const layerDepthKey: InjectionKey<number> = Symbol('astryx-layer-depth')

/** 读当前子树的嵌套深度。没有外层浮层时是 0。必须在 setup 里调用。 */
export function useLayerDepth(): number {
  return inject(layerDepthKey, 0)
}

/**
 * 给这一层的内容再加深一层。
 * 在内容边界的 setup 里调用，不要包住触发器：触发器还在外面那一层。
 */
export function provideLayerDepth(): void {
  provide(layerDepthKey, useLayerDepth() + 1)
}
