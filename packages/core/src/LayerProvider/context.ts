import type { ComputedRef, InjectionKey } from 'vue'
import type { LayerGutter } from '../layer/gutter.js'
import type { LayerToastConfig } from './types.js'
import { computed, inject } from 'vue'
import { resolveLayerGutter } from '../layer/gutter.js'

/** 已经量成 px 的逐边偏移。 */
export type ResolvedLayerInset = Partial<Record<keyof LayerGutter, number>>

export interface LayerContextValue {
  /** 锚定浮层离视口每条边的额外偏移。 */
  inset: ResolvedLayerInset
  /** toast 视口的配置，`inset` 已经和 provider 的偏移合并过。 */
  toast: {
    position?: LayerToastConfig['position']
    maxVisible?: number
    inset: ResolvedLayerInset
  }
}

export const layerContextKey: InjectionKey<ComputedRef<LayerContextValue>> = Symbol('astryx-layer')

/** 已经在一个 LayerProvider 里。内层的 provider 会被忽略。 */
export const layerNestingKey: InjectionKey<true> = Symbol('astryx-layer-nesting')

/** 最近的 `LayerProvider` 配置。没有 provider 时是 `null`。 */
export function useLayerConfig(): ComputedRef<LayerContextValue> | null {
  return inject(layerContextKey, null)
}

/**
 * 锚定浮层离视口四条边的距离。基础空隙和设备安全区取大，再加 provider 给的偏移。
 */
export function useLayerGutter(): ComputedRef<LayerGutter> {
  const config = useLayerConfig()
  return computed(() => resolveLayerGutter(config?.value.inset))
}
