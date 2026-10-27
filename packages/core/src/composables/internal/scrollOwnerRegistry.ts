import type { MeasuredScrollAxisState } from './scrollGeometry.js'

/**
 * 滚动归属的登记表：哪些元素是「可滚动容器」，各自两条轴现在能不能滚。
 *
 * `useScrollableArea` 量完就登记。滚动键盘委托靠它认出祖先里已经有一个滚动容器，
 * 不去越级抢焦点；以后按轴吸顶的组件也从这里找最近的滚动容器。存在 WeakMap 里，元素没了就跟着回收。
 */

export interface RegisteredScrollOwnerState {
  inline: MeasuredScrollAxisState
  block: MeasuredScrollAxisState
}

const owners = new WeakMap<HTMLElement, RegisteredScrollOwnerState>()

export function registerScrollOwner(element: HTMLElement, state: RegisteredScrollOwnerState): void {
  owners.set(element, state)
}

export function unregisterScrollOwner(element: HTMLElement): void {
  owners.delete(element)
}

export function getRegisteredScrollOwnerState(element: HTMLElement): RegisteredScrollOwnerState | undefined {
  return owners.get(element)
}

/** 往上找最近的、在这条轴上真能滚的登记容器。 */
export function findNearestScrollOwner(element: Element, axis: 'inline' | 'block'): HTMLElement | null {
  let candidate = element.parentElement
  while (candidate != null) {
    if (owners.get(candidate)?.[axis].isScrollable === true)
      return candidate
    candidate = candidate.parentElement
  }
  return null
}
