/**
 * 打开着的 Tooltip、HoverCard 气泡登记在这里。
 *
 * 气泡挂载时会尽量靠近触发元素（见 `layer/mount.ts`），可能落在一个可点容器
 * （可点卡片、列表行、文件选择区）的 DOM 里面，于是在气泡里点一下会冒泡到容器，
 * 把容器的动作也触发了。容器判断「这一下是不是点在别的东西上」时，把登记过的气泡
 * 当作别的东西，就不再响应。事件本身照常冒泡，页面级的监听仍然收得到。不从包里导出。
 */

const surfaces = new WeakSet<Element>()

/** 给气泡内容元素用的 ref 回调。 */
export function registerLayerSurface(element: Element | null): void {
  if (element != null)
    surfaces.add(element)
}

/** 这个元素是不是登记过的气泡。 */
export function isLayerSurface(element: Element): boolean {
  return surfaces.has(element)
}

/** 从 `target` 往上走到 `root`（不含）之间，有没有登记过的气泡。 */
export function isInLayerSurface(target: Element, root: Element): boolean {
  let current: Element | null = target
  while (current != null && current !== root) {
    if (surfaces.has(current))
      return true
    current = current.parentElement
  }
  return false
}
