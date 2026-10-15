import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { useAstryxLocale } from './context.js'

/**
 * 按当前语言比较字符串，对应原版的 `useCollator`。
 * 没提供语言时用 `en`。`options` 用 ref 或 computed 包起来，变了才会重建比较器。
 *
 * @example
 * ```ts
 * const collator = useCollator({ numeric: true })
 * items.sort((a, b) => collator.value.compare(a.name, b.name))
 * ```
 */
export function useCollator(options?: MaybeRefOrGetter<Intl.CollatorOptions | undefined>): ComputedRef<Intl.Collator> {
  const locale = useAstryxLocale()
  return computed(() => new Intl.Collator(locale.value, toValue(options)))
}
