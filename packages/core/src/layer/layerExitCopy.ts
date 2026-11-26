/**
 * 浮层的退场副本（上游 Layer/layerExitCopy.ts）。
 *
 * 浮层一关就藏起来了（选中一项、Escape、点外面）。触屏呈现要把关闭的动效播完，
 * 就在关闭那一刻拍一份静态、惰性的副本，在副本上播，播完由调用方移除。
 *
 * - 副本是 Core 共用的惰性副本（motion/transientCopy.ts 的 `inertCopy`）：没有
 *   id、表单名和标签指向，`inert`，读屏器看不到，指针点不到。
 * - 它落在浮层排版的盒子上（`settledBox`），带着浮层画的变换：正在进行的动画
 *   此刻呈现的值（缩放、透明度等）写进副本，所以进场到一半时关闭，副本停在
 *   当时画出的地方。子元素的关键帧和过渡不重播。
 * - 保留浮层自己的 overflow、每处滚动位置，以及内边距、边框和颜色：放进顶层
 *   时浏览器给 popover 的默认样式会把它们换掉。
 * - 有 Popover API 时副本作为手动 popover 进顶层，被裁切、变换的祖先既裁不到
 *   也挪不动它；浏览器在关闭中的 popover 自己的切换里拒绝显示时，等脚本跑完或
 *   下一帧再显示。没有 Popover API 时副本是浮层后面的固定定位兄弟节点，带着
 *   浮层自己的层级。
 * - 一个浮层只有一份副本：再拍一份会把上一份拿走。
 */
import {
  inertCopy,
  isCopyable,
  keepInherited,
  restoreScrollOffsets,
} from '../motion/transientCopy.js'
import { settledBox } from './settledBox.js'

/** 正在进行的动画可能占着的属性：副本取浮层此刻呈现的值。 */
const PRESENTED_PROPERTIES = [
  'translate',
  'rotate',
  'scale',
  'transform',
  'transform-origin',
  'opacity',
] as const

/** 副本不能从活浮层带走的行内属性。 */
const LIVE_ONLY_PROPERTIES = [
  'position-anchor',
  'position-try-fallbacks',
  'inset',
  'right',
  'bottom',
  'transition',
] as const

/**
 * 浏览器给 popover 的默认样式会改的属性：副本从被拍的元素上取，被拍的元素
 * 不一定是 popover。
 */
const POPOVER_STYLE_PROPERTIES = [
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'color',
  'background-color',
] as const

const LAYER_SELECTOR = '[popover], dialog'

/** 每个浮层的副本：给同一个浮层再拍一份时替换掉。 */
const copies = new WeakMap<HTMLElement, HTMLElement>()

function hasDuration(value: string): boolean {
  return value.split(',').some(part => Number.parseFloat(part) > 0)
}

/** 把 `element` 和子树里正在进行的动画此刻呈现的值写到副本对应的节点上。 */
function commitPresented(element: HTMLElement, copy: HTMLElement, view: Window): void {
  if (typeof element.getAnimations !== 'function')
    return
  const animated = new Set<Element>()
  for (const animation of element.getAnimations({ subtree: true })) {
    const effect = animation.effect as KeyframeEffect | null
    if (effect?.target != null && effect.pseudoElement == null)
      animated.add(effect.target)
  }
  if (animated.size === 0)
    return
  const sources = [element, ...element.querySelectorAll('*')]
  const targets = [copy, ...copy.querySelectorAll('*')]
  sources.forEach((source, index) => {
    const target = targets[index] as HTMLElement | undefined
    if (!animated.has(source) || target?.style == null)
      return
    const computed = view.getComputedStyle(source)
    for (const property of PRESENTED_PROPERTIES)
      target.style.setProperty(property, computed.getPropertyValue(property))
  })
}

/** 副本子树里的关键帧和过渡不重播：活节点在跑的，副本上关掉。 */
function stopReplays(element: HTMLElement, copy: HTMLElement, view: Window): void {
  const liveNodes = element.querySelectorAll('*')
  copy.querySelectorAll('*').forEach((node, index) => {
    const live = liveNodes[index]
    const style = (node as HTMLElement).style
    if (live == null || style == null)
      return
    const liveStyle = view.getComputedStyle(live)
    const name = liveStyle.getPropertyValue('animation-name')
    if (name !== '' && name !== 'none')
      style.setProperty('animation-name', 'none')
    if (hasDuration(liveStyle.getPropertyValue('transition-duration')))
      style.setProperty('transition', 'none')
  })
}

/** `element` 外面最外层的浮层（popover 或 dialog），没有时为 null。 */
function outermostLayer(element: HTMLElement): HTMLElement | null {
  let outer: HTMLElement | null = null
  for (let node = element.parentElement; node != null; node = node.parentElement) {
    if (node.matches(LAYER_SELECTOR))
      outer = node
  }
  return outer
}

/** 让 `element` 里面那些浮层的副本重新显示，留在刚显示的这份上面。 */
function raiseInnerCopies(element: HTMLElement): void {
  const inner: HTMLElement[] = []
  for (const layer of element.querySelectorAll<HTMLElement>(LAYER_SELECTOR)) {
    const copy = copies.get(layer)
    if (copy?.isConnected === true && copy.matches(':popover-open'))
      inner.push(layer)
  }
  // 外层先显示，最里面的副本落在最上面。
  inner.sort((a, b) => (a.contains(b) ? -1 : b.contains(a) ? 1 : 0))
  for (const layer of inner) {
    const copy = copies.get(layer)!
    copy.hidePopover()
    copy.showPopover()
    restoreScrollOffsets(copy)
  }
}

function insertCopy(element: HTMLElement, copy: HTMLElement): void {
  const outer = outermostLayer(element)
  if (outer?.parentElement == null) {
    element.after(copy)
    return
  }
  // 同一步里一起关闭的外层会把副本藏起来：放到最外层后面，带上原处继承的值。
  keepInherited(copy, outer.parentElement)
  outer.after(copy)
}

function showInTopLayer(element: HTMLElement, copy: HTMLElement, view: Window): void {
  const show = (): boolean => {
    try {
      copy.showPopover()
    }
    catch {
      return false
    }
    // 藏着的盒子不保留滚动位置：显示后把滚动过的内容放回原处。
    restoreScrollOffsets(copy)
    raiseInnerCopies(element)
    return true
  }
  if (show())
    return
  // 关闭中的 popover 自己的切换里被拒绝：藏着等它结束。
  view.queueMicrotask(() => {
    if (!copy.isConnected || show())
      return
    view.requestAnimationFrame(() => {
      if (copy.isConnected && !show()) {
        copy.remove()
        if (copies.get(element) === copy)
          copies.delete(element)
      }
    })
  })
}

/**
 * 在 `element` 画着的地方放一份静态副本，标上 `attribute`。内容超过副本上限、
 * 或者没有窗口时返回 null，关闭就是立即的。调用方在副本上播退场，播完移除。
 */
export function placeLayerExitCopy(element: HTMLElement, attribute: string): HTMLElement | null {
  const view = element.ownerDocument.defaultView
  if (view == null)
    return null
  copies.get(element)?.remove()
  copies.delete(element)
  if (!isCopyable(element))
    return null
  const box = settledBox(element)
  const copy = inertCopy(element)
  if (copy == null)
    return null
  const topLayer = typeof copy.showPopover === 'function'
  copy.setAttribute(attribute, '')
  if (topLayer)
    copy.setAttribute('popover', 'manual')
  const { style } = copy
  for (const property of LIVE_ONLY_PROPERTIES)
    style.removeProperty(property)
  commitPresented(element, copy, view)
  // 落在浮层排版的盒子上，不再对齐锚点或视口。
  style.setProperty('position', 'fixed')
  style.setProperty('margin', '0')
  style.setProperty('left', `${box.left}px`)
  style.setProperty('top', `${box.top}px`)
  style.setProperty('right', 'auto')
  style.setProperty('bottom', 'auto')
  style.setProperty('width', `${box.width}px`)
  style.setProperty('height', `${box.height}px`)
  style.setProperty('box-sizing', 'border-box')
  style.setProperty('animation-name', 'none')
  style.setProperty('pointer-events', 'none')
  const layerStyle = view.getComputedStyle(element)
  if (hasDuration(layerStyle.getPropertyValue('transition-duration')))
    style.setProperty('transition', 'none')
  stopReplays(element, copy, view)
  // 浮层自己的 overflow：滚动内容的浮层保留它的裁切。
  style.setProperty('overflow-x', layerStyle.getPropertyValue('overflow-x'))
  style.setProperty('overflow-y', layerStyle.getPropertyValue('overflow-y'))
  // 浏览器给 popover 的内边距、边框和底色会盖掉被拍元素自己的。
  for (const property of POPOVER_STYLE_PROPERTIES) {
    const value = layerStyle.getPropertyValue(property)
    if (value !== '')
      style.setProperty(property, value)
  }
  insertCopy(element, copy)
  copies.set(element, copy)
  if (topLayer)
    showInTopLayer(element, copy, view)
  else
    restoreScrollOffsets(copy)
  return copy
}
