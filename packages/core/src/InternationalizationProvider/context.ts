import type { ComputedRef, InjectionKey } from 'vue'
import type { TextDirection } from './direction.js'
import { computed, inject } from 'vue'
import { useAstryxLocale } from '../locale/context.js'
import { getLocaleDirection } from './direction.js'

/** 最近的 `InternationalizationProvider` 定下的书写方向。 */
export const astryxDirectionKey: InjectionKey<ComputedRef<TextDirection>> = Symbol('astryx-direction')

/**
 * 子树当前的书写方向。有 provider 时用它的 `dir`，否则按最近的 locale 推导。
 * 它只描述 Astryx 组件读数用的方向；DOM 的 `dir` 属性要自己设。
 */
export function useLocaleDirection(): ComputedRef<TextDirection> {
  const provided = inject(astryxDirectionKey, null)
  if (provided != null)
    return provided
  const locale = useAstryxLocale()
  return computed(() => getLocaleDirection(locale.value))
}
