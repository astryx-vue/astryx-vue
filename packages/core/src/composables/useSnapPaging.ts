import type { MaybeRefOrGetter } from 'vue'
import type { SnapPaging, SnapPagingOptions } from './internal/snapPagingValue.js'
import { toValue } from 'vue'
import { attachPaging } from './internal/snapPagingAttach.js'
import { makeSnapPaging } from './internal/snapPagingValue.js'

export type { SnapPaging, SnapPagingOptions } from './internal/snapPagingValue.js'

/**
 * 给 Carousel 的吸附停点加上 iOS 式翻页：`<Carousel :has-snap="paging">`，
 * 其中 `const paging = useSnapPaging()`。手指或触控板横扫时，一次轻扫翻一屏，
 * 传 `{ pages: 'item' }` 时翻一项，停在某一项的起始边。鼠标滚轮和鼠标拖动保持原生滚动。
 *
 * `options` 可以是 ref 或 getter，新的 `pages` 从下一次轻扫开始生效。
 * Carousel 一直用它第一次挂上的那个值。
 */
export function useSnapPaging(options: MaybeRefOrGetter<SnapPagingOptions> = {}): SnapPaging {
  return makeSnapPaging((element, onHeld) => attachPaging(element, () => toValue(options), onHeld))
}
