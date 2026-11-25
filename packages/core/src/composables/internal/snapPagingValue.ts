import { markRaw, toRaw } from 'vue'

/**
 * `SnapPaging` 值本身，以及 Carousel 对它的几种调用，还有一行的停点怎么算。
 * 这里不引入任何手势和动画代码：没把 `useSnapPaging()` 交给 `hasSnap` 的轮播，
 * 只会带上这一小块。
 */

/** `useSnapPaging` 的选项。 */
export interface SnapPagingOptions {
  /**
   * 一次轻扫翻多少。`'view'`：翻一屏，停在离一屏之外最近的那一项起始边；`'item'`：翻一项。
   * @default 'view'
   */
  readonly pages?: 'view' | 'item'
}

/** 配置好的吸附分页。用 `useSnapPaging` 生成，交给 Carousel 的 `hasSnap`。 */
export interface SnapPaging {
  readonly __snapPaging: true
}

/** 分页正按住的这一行显示在哪：朝末端的偏移，以及按住时的可滚动距离。 */
export interface HeldRow {
  readonly offset: number
  readonly travel: number
}

/** 按住期间每次挪动都会收到这一行的位置，交还给原生滚动时收到 null。 */
export type HeldRowListener = (held: HeldRow | null) => void

/** 目标位置：收到当前显示的偏移和可滚动距离，返回朝末端的目标偏移。 */
export type SnapTarget = (at: number, end: number) => number

/** 挂到某一行上的分页。 */
export interface SnapPagingAttachment {
  readonly detach: () => void
  /** 由分页把这一行挪到目标位置，不管它此刻是否被按住。手指按着时不动。 */
  readonly move: (target: SnapTarget) => void
  /** 只在分页正按住这一行时挪动它，返回是否按住。 */
  readonly moveHeld: (target: SnapTarget) => boolean
}

type Attach = (element: HTMLElement, onHeld?: HeldRowListener) => SnapPagingAttachment

interface SnapPagingValue {
  readonly attach: Attach
}

const values = new WeakSet<object>()
// 每一行挂着的分页，供 Carousel 自己的滚动调用使用。
const attachments = new WeakMap<HTMLElement, SnapPagingAttachment>()

/** 生成一个用 `attach` 挂载的 `SnapPaging` 值。 */
export function makeSnapPaging(attach: Attach): SnapPaging {
  const value: SnapPagingValue = markRaw({ attach })
  values.add(value)
  return value as unknown as SnapPaging
}

/** `value` 是否来自 `useSnapPaging`。被 Vue 包成响应式的也认得。 */
export function isSnapPaging(value: unknown): value is SnapPaging {
  return typeof value === 'object' && value !== null && values.has(toRaw(value))
}

/** 把分页挂到 `element` 上，返回卸载函数。`onHeld` 在分页按住这一行期间收到它的位置。 */
export function attachSnapPaging(value: SnapPaging, element: HTMLElement, onHeld?: HeldRowListener): () => void {
  const attachment = (toRaw(value) as unknown as SnapPagingValue).attach(element, onHeld)
  attachments.set(element, attachment)
  return () => {
    attachments.delete(element)
    attachment.detach()
  }
}

/** 由分页把挂着分页的这一行挪到 `target`。这一行没挂分页时返回 false。 */
export function moveSnapPaging(element: HTMLElement, target: SnapTarget): boolean {
  const attachment = attachments.get(element)
  if (attachment == null)
    return false
  attachment.move(target)
  return true
}

/** 分页正按住这一行时把它挪到 `target`；没按住时返回 false。 */
export function moveHeldSnapPaging(element: HTMLElement, target: SnapTarget): boolean {
  return attachments.get(element)?.moveHeld(target) ?? false
}

/** 离 `at` 最近的停点；一行没有停点时就是 `at`。 */
export function nearestStop(stops: readonly number[], at: number): number {
  return stops.reduce((best, stop) => Math.abs(stop - at) < Math.abs(best - at) ? stop : best, stops[0] ?? at)
}

/** 一行的分页：每页一个停点，以及原生吸附要跳过的项。 */
export interface SnapPages {
  readonly stops: number[]
  readonly skipped: Element[]
}

function isRtl(element: HTMLElement): boolean {
  return getComputedStyle(element).direction === 'rtl'
}

/** 祖先缩放会缩放矩形，但不缩放滚动偏移。 */
function rowScale(element: HTMLElement, box: DOMRect): number {
  return element.offsetWidth > 0 && box.width > 0 ? box.width / element.offsetWidth : 1
}

function itemStops(element: HTMLElement, shown: number, end: number): { item: Element, stop: number }[] {
  const rtl = isRtl(element)
  const box = element.getBoundingClientRect()
  const scale = rowScale(element, box)
  const border = rtl ? element.offsetWidth - element.clientWidth - element.clientLeft : element.clientLeft
  const style = getComputedStyle(element)
  const padding = Number.parseFloat(rtl ? style.scrollPaddingRight : style.scrollPaddingLeft) || 0
  return Array.from(element.children, (item) => {
    const rect = item.getBoundingClientRect()
    const fromEdge = (rtl ? box.right - rect.right : rect.left - box.left) / scale
    return { item, stop: Math.min(Math.max(fromEdge - border + shown - padding, 0), end) }
  })
}

/**
 * 一行的停点，每页一个，从各项的矩形读出，再加回当前显示的偏移 `shown`。
 * 相距不到半像素的停点算一个。末端那一页是末端就近归属的那一页：离末端不到
 * 前一步一半的停点并进末端，停在这一行真正的尽头，原生吸附也跳过它那一项（`skipped`）。
 */
export function snapPages(element: HTMLElement, shown: number, end: number): SnapPages {
  const stops: number[] = []
  const owners: Element[][] = []
  for (const { item, stop } of itemStops(element, shown, end)) {
    if (stops.length === 0 || stop > stops[stops.length - 1]! + 0.5) {
      stops.push(stop)
      owners.push([item])
    }
    else {
      owners[owners.length - 1]!.push(item)
    }
  }
  const n = stops.length
  if (n >= 3 && stops[n - 1]! >= end - 0.5 && stops[n - 1]! - stops[n - 2]! < (stops[n - 2]! - stops[n - 3]!) / 2) {
    const skipped = owners[n - 2]!
    stops.splice(n - 2, 1)
    return { stops, skipped }
  }
  return { stops: n > 0 ? stops : [0], skipped: [] }
}

/** 一行的停点（见 `snapPages`）。 */
export function snapStops(element: HTMLElement, shown: number, end: number): number[] {
  return snapPages(element, shown, end).stops
}
