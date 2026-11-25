import type { Ref } from 'vue'
import type { HeldRowListener, SnapPaging } from '../composables/internal/snapPagingValue.js'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { attachSnapPaging, isSnapPaging, nearestStop, snapStops } from '../composables/internal/snapPagingValue.js'

/**
 * 吸附分页下按一次边缘按钮去哪：从偏移 `at` 往前大约一屏，落到最近的停点，并且至少走一个停点。
 * `wraps` 为真时，越过边缘就到另一端。
 */
export function pagingStep(element: HTMLElement, at: number, end: number, direction: -1 | 1, wraps: boolean): number {
  if (wraps && (direction === 1 ? at >= end - 0.5 : at <= 0.5))
    return direction === 1 ? 0 : end
  const first = element.firstElementChild as HTMLElement | null
  const itemWidth = first?.offsetWidth ?? 0
  const amount = element.clientWidth - itemWidth * 0.5
  const stops = snapStops(element, at, end)
  const nearest = nearestStop(stops, at + direction * Math.max(amount, itemWidth))
  if (direction === 1 && nearest <= at + 0.5)
    return stops.find(stop => stop > at + 0.5) ?? nearest
  if (direction === -1 && nearest >= at - 0.5)
    return [...stops].reverse().find(stop => stop < at - 0.5) ?? nearest
  return nearest
}

/**
 * `hasSnap` 收到 `useSnapPaging()` 的值时，把分页挂到滚动区上。只在第一次拿到值时挂一次，
 * 之后换成别的值不会重新挂；在分页和普通吸附之间切换才会挂上或卸下。
 * 分页按住这一行期间，`onHeld` 收到它显示的位置。
 */
export function useCarouselPaging(
  scroller: Ref<HTMLElement | null>,
  hasSnap: () => boolean | SnapPaging,
  onHeld: HeldRowListener,
): void {
  const paging = computed(() => {
    const value = hasSnap()
    return isSnapPaging(value) ? value : null
  })
  let detach: (() => void) | null = null

  function sync(): void {
    const value = paging.value
    const element = scroller.value
    if ((detach != null) === (value != null && element != null))
      return
    detach?.()
    detach = null
    if (value != null && element != null)
      detach = attachSnapPaging(value, element, onHeld)
  }

  onMounted(sync)
  watch(() => paging.value != null, sync)
  onBeforeUnmount(() => {
    detach?.()
    detach = null
  })
}
