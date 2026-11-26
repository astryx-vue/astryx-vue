/**
 * @file inputHoldShield.ts
 * @output 输入暂挡的挡板：放进浮层里的一块透明遮挡，以及给静止的鼠标、
 *   挡板升起前就按下的手指留的口子
 * @position `inputHold.ts` 的挡板部分（对应上游 Layer/inputHold 的 addShield、
 *   openToMouse、openToEarlierPresses）
 */

import type { MousePoint } from '../utils/inputStream'
import type { HeldLayer } from './inputHoldState'
import { getDownPresses, getLastMousePoint } from '../utils/inputStream'
import { liveShields, pressHolds } from './inputHoldState'

const SWALLOWED = [
  'pointerdown',
  'pointerup',
  'touchstart',
  'touchend',
  'mousedown',
  'mouseup',
  'click',
  'contextmenu',
] as const

function swallow(event: Event): void {
  // touchstart 不取消：取消它会连页面的双指缩放一起取消。挡板的
  // `touch-action: pinch-zoom` 已经让单指拖不动页面；一下轻点后续的
  // 鼠标兼容事件和 click 落在挡板上，在这里吞掉。
  if (event.cancelable && event.type !== 'touchstart')
    event.preventDefault()
  event.stopPropagation()
}

/**
 * 放进 `layer` 里的透明遮挡：`isFull` 时从顶层盖满视口，否则只盖浮层自己。
 * 挡板在浮层里面，点在它上面等于点在浮层里，会被轻触关闭的浮层不会因此关掉。
 */
export function addShield(layer: Element, isFull: boolean): HTMLElement {
  const shield = layer.ownerDocument.createElement('div')
  if (isFull)
    shield.setAttribute('popover', 'manual')
  shield.setAttribute('aria-hidden', 'true')
  shield.setAttribute('data-astryx-input-shield', '')
  Object.assign(shield.style, {
    position: isFull ? 'fixed' : 'absolute',
    inset: '0',
    width: isFull ? '100vw' : '100%',
    height: isFull ? '100vh' : '100%',
    // 压在浮层自己的内容上面。
    zIndex: isFull ? 'auto' : '2147483647',
    maxWidth: 'none',
    maxHeight: 'none',
    margin: '0',
    padding: '0',
    border: '0',
    background: 'transparent',
    overflow: 'hidden',
    touchAction: 'pinch-zoom',
    // 这两个会继承的属性决定命中。浮层根自己可能不接点击（由遮罩子元素接），
    // 继承下来的话，被挡的一下会漏到页面上。
    pointerEvents: 'auto',
    visibility: 'visible',
  })
  for (const type of SWALLOWED)
    shield.addEventListener(type, swallow, { capture: true, passive: false })
  layer.append(shield)
  liveShields.add(shield)
  if (isFull && typeof shield.showPopover === 'function') {
    try {
      shield.showPopover()
    }
    catch {
      // 不在文档里，或者不支持 popover：它照样作为 fixed 元素尽量盖住。
    }
  }
  return shield
}

/** 拆掉一块挡板。 */
export function removeShield(shield: HTMLElement): void {
  liveShields.delete(shield)
  shield.remove()
}

/** 静止的鼠标在满屏挡板上留下的口子：以它为中心、边长 4px 的正方形。 */
export const MOUSE_OPENING_HALF_SIDE_PX = 2

interface Opening {
  left: number
  right: number
  top: number
  bottom: number
}

/**
 * 每个点周围的正方形口子。两个重叠的口子合成一个盖住两者的框：按非零环绕规则，
 * 同向画的两个口子重叠的部分会被算两次，反而又合上了。
 */
export function openings(points: ReadonlyArray<MousePoint>): Opening[] {
  const boxes: Opening[] = []
  for (const { x, y } of points) {
    let box: Opening = {
      left: x - MOUSE_OPENING_HALF_SIDE_PX,
      right: x + MOUSE_OPENING_HALF_SIDE_PX,
      top: y - MOUSE_OPENING_HALF_SIDE_PX,
      bottom: y + MOUSE_OPENING_HALF_SIDE_PX,
    }
    for (let index = boxes.length - 1; index >= 0; index--) {
      const other = boxes[index]!
      if (box.left < other.right && other.left < box.right && box.top < other.bottom && other.top < box.bottom) {
        box = {
          left: Math.min(box.left, other.left),
          right: Math.max(box.right, other.right),
          top: Math.min(box.top, other.top),
          bottom: Math.max(box.bottom, other.bottom),
        }
        boxes.splice(index, 1)
        index = boxes.length
      }
    }
    boxes.push(box)
  }
  return boxes
}

/**
 * 给鼠标在挡板上留条路。浏览器先命中测试、脚本才读得到指针类型，所以手指
 * 升起挡板后一直没动过的鼠标，会按到挡板上。满屏挡板在输入流最后听到鼠标
 * 的那一点留个口子；只盖浮层自己的挡板干脆不接点击（它跟着进场动画在动）——
 * 手指按在那里照样被按压暂挡按指针拦下。满屏挡板还给升起前就按下的手指
 * 各留一个口子（见 {@link openToEarlierPresses}）。
 */
export function openToMouse(state: HeldLayer, doc: Document): void {
  const { shield } = state
  // 退场暂挡不给鼠标留路。
  if (shield == null || state.layer > 0)
    return
  const view = doc.defaultView
  const mouse = view == null ? null : getLastMousePoint(view)
  const downPresses = view == null ? null : getDownPresses(view)
  const presses: MousePoint[] = []
  if (state.isShieldFull && downPresses != null) {
    for (const pointerId of state.pressOpenings) {
      const point = downPresses.get(pointerId)
      if (point != null)
        presses.push(point)
    }
  }
  if ((mouse == null && presses.length === 0) || shield.style.pointerEvents === 'none') {
    shield.style.removeProperty('clip-path')
    return
  }
  if (!state.isShieldFull) {
    shield.style.pointerEvents = 'none'
    return
  }
  // 先是整个视口，再把每个口子反方向画一遍：非零规则把口子挖掉，挖掉的地方不接点击。
  const outline = ['0 0', '100% 0', '100% 100%', '0 100%']
  for (const { left, right, top, bottom } of openings(mouse == null ? presses : [mouse, ...presses])) {
    outline.push(
      `0 ${top}px`,
      `${left}px ${top}px`,
      `${left}px ${bottom}px`,
      `${right}px ${bottom}px`,
      `${right}px ${top}px`,
      `0 ${top}px`,
    )
  }
  shield.style.clipPath = `polygon(${outline.join(', ')})`
}

/**
 * 满屏挡板升起前就按下的每根手指或笔，在它那里留个口子。WebKit 会对这一下的
 * 抬起重新做命中测试（即使抓着指针），抬起落在挡板上就是落在浮层里，会被轻触
 * 关闭的浮层就关不掉了。有了口子，抬起落到下面原本的东西上，轻触关闭照常。
 * 在更早一次暂挡里按下、正被按压暂挡拦着的按压不留口子。
 */
export function openToEarlierPresses(state: HeldLayer, doc: Document): void {
  const view = doc.defaultView
  if (view == null)
    return
  const pressHold = pressHolds.get(doc)
  for (const pointerId of getDownPresses(view).keys()) {
    if (pressHold?.holds(pointerId) !== true)
      state.pressOpenings.add(pointerId)
  }
}
