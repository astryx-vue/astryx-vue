import type { MaybeRefOrGetter } from 'vue'
import type { Reorderable, ReorderableOptions } from '../reorderable/createReorderable.js'
import { toValue } from 'vue'
import { createReorderable } from '../reorderable/createReorderable.js'

/**
 * @file useReorderable.ts
 * @input 应用的 `onReorder` 和可选的 `isReorderable`，可以是 ref 或 getter
 * @output `useReorderable`：在 `setup` 里建一个可重排对象，交给 List 的 `reorderable`
 * @position 公开组合式函数，`createReorderable` 的组件内写法
 */

/**
 * 让一个集合的行可以重排：拖行末的手柄，或者进入重排模式后用方向键挪。
 * 在 `setup` 里调用一次，把返回值交给 List 的 `reorderable`，每个 ListItem 带上 `itemKey`。
 * 每次调用都读 `options` 的最新值，所以传 ref 或 getter 时换掉回调不用重建。
 *
 * @example
 * ```ts
 * const reorderable = useReorderable<string>({
 *   onReorder: ({ key, to }) => {
 *     const next = items.value.filter(item => item.id !== key)
 *     next.splice(to, 0, items.value.find(item => item.id === key)!)
 *     items.value = next
 *   },
 * })
 * ```
 */
export function useReorderable<TKey extends string | number = string | number, TTo = number>(
  options: MaybeRefOrGetter<ReorderableOptions<TKey, TTo>>,
): Reorderable<TKey, TTo> {
  return createReorderable<TKey, TTo>({
    onReorder: move => toValue(options).onReorder(move),
    isReorderable: key => toValue(options).isReorderable?.(key) ?? true,
  })
}
