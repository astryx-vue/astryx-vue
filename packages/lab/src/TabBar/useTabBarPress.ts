/**
 * @file useTabBarPress.ts
 * @input 胶囊元素、是否启用、按压各阶段的回调；core 的 RTL 判断和 tabBarModel.ts 的几何
 * @output useTabBarPress：手指和触控笔在标签栏上的按压跟踪，返回取消当前按压的函数
 * @position lab TabBar 触屏层的一部分。对应上游借 core `useActionGroupTracking` 的那段：
 *   手指下面是哪个标签、松手时运行那个标签、第二根手指取消、松手后聚焦。Vue 版 core 的
 *   动作组跟踪不带按压回调，所以在这里单独跟踪。
 */

import type { Ref } from 'vue'
import { isRtlElement } from '@astryx-vue/core/internal/touch'
import { onBeforeUnmount, onMounted } from 'vue'
import { itemCenters, nearestIndex } from './tabBarModel'

export interface TabBarPressHandlers {
  /** 手指落下，`tab` 是手指下的标签（在栏外是 null）。 */
  readonly begin: (clientX: number, tab: HTMLElement | null) => void
  readonly move: (clientX: number, tab: HTMLElement | null) => void
  /** 手指抬起（`wasCancelled` 为 false，`tab` 是松手处的标签）或被取消。 */
  readonly end: (tab: HTMLElement | null, wasCancelled: boolean) => void
  /** 松手落在 `tab` 上：在 `end` 之后、同一个事件里运行。 */
  readonly activate: (tab: HTMLElement) => void
}

export interface UseTabBarPressOptions {
  /** 只在触屏呈现下跟踪；用鼠标时按压就是普通的按钮点击。 */
  readonly isEnabled: () => boolean
  readonly handlers: TabBarPressHandlers
}

/** 松手后浏览器补发的那次点击在这段时间内到达，由这里吞掉，免得同一个标签被选两次。 */
const CLICK_SWALLOW_MS = 600

export function tabsOf(capsule: HTMLElement): HTMLElement[] {
  return [...capsule.children].filter(
    (child): child is HTMLElement => child.getAttribute('role') === 'tab',
  )
}

/**
 * 点 (`clientX`, `clientY`) 下的标签。每个按钮一直铺到和邻居的中点，首尾两个铺到胶囊边，
 * 所以胶囊里任何一点下的标签就是离它最近的那个；在胶囊外没有标签。
 */
export function tabAt(capsule: HTMLElement, clientX: number, clientY: number): HTMLElement | null {
  const box = capsule.getBoundingClientRect()
  if (clientX < box.left || clientX > box.right || clientY < box.top || clientY > box.bottom)
    return null
  const tabs = tabsOf(capsule)
  if (tabs.length === 0)
    return null
  const centers = itemCenters(box.width, tabs.length, isRtlElement(capsule))
  return tabs[nearestIndex(clientX - box.left, centers)] ?? null
}

export function useTabBarPress(capsule: Ref<HTMLElement | null>, options: UseTabBarPressOptions): { cancel: () => void } {
  let pointerId: number | null = null
  let swallowUntil = 0

  const view = (): Window | null => capsule.value?.ownerDocument.defaultView ?? null

  function stopListening(): void {
    const target = view()
    target?.removeEventListener('pointermove', onMove)
    target?.removeEventListener('pointerup', onUp)
    target?.removeEventListener('pointercancel', onCancel)
    target?.removeEventListener('blur', onCancel)
    pointerId = null
  }

  function cancel(): void {
    if (pointerId == null)
      return
    stopListening()
    options.handlers.end(null, true)
  }

  function onDown(event: PointerEvent): void {
    const element = capsule.value
    if (element == null || !options.isEnabled() || (event.pointerType !== 'touch' && event.pointerType !== 'pen'))
      return
    // 第二根手指落下：取消这次按压，和 UIKit 一样什么都不选。
    if (pointerId != null) {
      cancel()
      return
    }
    if (event.button !== 0)
      return
    pointerId = event.pointerId
    const target = view()
    target?.addEventListener('pointermove', onMove)
    target?.addEventListener('pointerup', onUp)
    target?.addEventListener('pointercancel', onCancel)
    target?.addEventListener('blur', onCancel)
    options.handlers.begin(event.clientX, tabAt(element, event.clientX, event.clientY))
  }

  function onMove(event: PointerEvent): void {
    const element = capsule.value
    if (event.pointerId !== pointerId || element == null)
      return
    options.handlers.move(event.clientX, tabAt(element, event.clientX, event.clientY))
  }

  function onUp(event: PointerEvent): void {
    const element = capsule.value
    if (event.pointerId !== pointerId || element == null)
      return
    stopListening()
    const tab = tabAt(element, event.clientX, event.clientY)
    options.handlers.end(tab, false)
    if (tab == null)
      return
    swallowUntil = event.timeStamp + CLICK_SWALLOW_MS
    options.handlers.activate(tab)
    tab.focus({ preventScroll: true })
  }

  function onCancel(event: Event): void {
    if (event.type === 'pointercancel' && (event as PointerEvent).pointerId !== pointerId)
      return
    cancel()
  }

  function onClick(event: MouseEvent): void {
    if (event.timeStamp > swallowUntil)
      return
    swallowUntil = 0
    event.preventDefault()
    event.stopPropagation()
  }

  // 直接挂原生监听：吞点击要在按钮自己的点击处理之前，所以挂在捕获阶段。
  onMounted(() => {
    capsule.value?.addEventListener('pointerdown', onDown)
    capsule.value?.addEventListener('click', onClick, true)
  })
  onBeforeUnmount(() => {
    capsule.value?.removeEventListener('pointerdown', onDown)
    capsule.value?.removeEventListener('click', onClick, true)
    stopListening()
  })

  return { cancel }
}
