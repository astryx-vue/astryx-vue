import type { HeldRowListener, SnapPages } from './snapPagingValue.js'
import { snapPages } from './snapPagingValue.js'

/**
 * 分页挪动的那条轨道，也就是滚动行本身。平时这一行交给原生滚动和原生吸附；
 * 手势或按钮把它「接管」后，原生吸附先关掉，由分页逐帧写滚动偏移；停稳后再
 * 把原生吸附还回去，这叫「交还」。
 */
export interface SnapTrack {
  readonly isHeld: () => boolean
  /** 朝末端的当前偏移。 */
  readonly position: () => number
  /** 可滚动距离。按住期间是接管那一刻的值。 */
  readonly travel: () => number
  readonly pages: () => SnapPages
  /** 一屏的宽度：可视宽度减去两侧的 scroll-padding。 */
  readonly viewWidth: () => number
  readonly takeOver: () => void
  /** 把按住的这一行放到偏移 `at`。 */
  readonly place: (at: number) => void
  /** 把这一行交还给原生滚动。`beforeSnap` 在原生吸附恢复之前运行。 */
  readonly handBack: (beforeSnap?: () => void) => void
}

export function createSnapTrack(element: HTMLElement, onHeld?: HeldRowListener): SnapTrack {
  let held = false
  let heldAt = 0
  let heldTravel = 0
  let sign = 1
  // 这一行自己写在行内的吸附类型，交还时原样放回。
  let ownSnapType = ''
  let ownSnapPriority = ''

  const isRtl = (): boolean => getComputedStyle(element).direction === 'rtl'
  const nativeTravel = (): number => Math.max(0, element.scrollWidth - element.clientWidth)
  const position = (): number => held ? heldAt : Math.abs(element.scrollLeft)
  const travel = (): number => held ? heldTravel : nativeTravel()

  function write(at: number): void {
    // 轮播的样式里是平滑滚动，这里每一帧都要立刻到位。
    element.scrollTo({ left: sign * at, behavior: 'instant' })
  }

  function report(): void {
    onHeld?.({ offset: heldAt, travel: heldTravel })
  }

  return {
    isHeld: () => held,
    position,
    travel,
    pages: () => snapPages(element, position(), travel()),
    viewWidth() {
      const style = getComputedStyle(element)
      const padding = (Number.parseFloat(style.scrollPaddingLeft) || 0) + (Number.parseFloat(style.scrollPaddingRight) || 0)
      return Math.max(1, element.clientWidth - padding)
    },
    takeOver() {
      if (held)
        return
      sign = isRtl() ? -1 : 1
      heldAt = Math.abs(element.scrollLeft)
      heldTravel = nativeTravel()
      ownSnapType = element.style.getPropertyValue('scroll-snap-type')
      ownSnapPriority = element.style.getPropertyPriority('scroll-snap-type')
      // 原生吸附会把分页写下的每一个中间位置都吸回停点。
      element.style.setProperty('scroll-snap-type', 'none')
      held = true
      report()
    },
    place(at) {
      if (!held)
        return
      heldAt = Math.min(Math.max(at, 0), heldTravel)
      write(heldAt)
      report()
    },
    handBack(beforeSnap) {
      if (!held)
        return
      held = false
      beforeSnap?.()
      if (ownSnapType === '')
        element.style.removeProperty('scroll-snap-type')
      else
        element.style.setProperty('scroll-snap-type', ownSnapType, ownSnapPriority)
      write(heldAt)
      if (onHeld != null) {
        onHeld({ offset: heldAt, travel: heldTravel })
        onHeld(null)
      }
    },
  }
}
