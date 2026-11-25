/**
 * @file hitArea.ts
 * @input 目标的矩形和它周围可点元素的矩形
 * @output 触控热区的几何：目标每一边最多能往外长多少（朝 44px 长，碰到邻居就停在一半间距），
 *   组的整体长法，以及一次触摸该算给哪个目标
 * @position 内部工具，不对外导出。实时测量在 hitAreaWatch.ts，Vue 接入在 useTouchHitArea.ts。
 *
 * 手指需要 44 × 44px 的目标，但控件在手机上不一定能变大，热区也不能抢走邻居的点按。
 * 所以每一边朝 44px 长，长到离最近邻居一半间距的地方就停：落在间隙里的触摸总归离它更近的那个。
 */

/** 视口坐标里的矩形。 */
export interface HitRect {
  readonly left: number
  readonly top: number
  readonly right: number
  readonly bottom: number
}

/** 热区在目标每一边往外伸出多少，px。 */
export interface HitInsets {
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}

/** 手指的最小目标，px（Apple 的 44pt）。 */
export const MIN_TOUCH_TARGET = 44

/** 不长：热区就是目标本身。 */
export const NO_HIT_INSETS: HitInsets = { top: 0, right: 0, bottom: 0, left: 0 }

/** `writeHitInsets` 写在元素上的自定义属性，热区伪元素读它们。 */
export const HIT_INSET_PROPERTIES = {
  top: '--astryx-hit-inset-top',
  right: '--astryx-hit-inset-right',
  bottom: '--astryx-hit-inset-bottom',
  left: '--astryx-hit-inset-left',
} as const

const SIDES = ['top', 'right', 'bottom', 'left'] as const

/** 页面上手指能点到的东西：热区不能从它们那里抢点按。 */
export const INTERACTIVE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  'label[for]',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="treeitem"]',
  '[role="combobox"]',
  '[role="textbox"]',
  '[role="searchbox"]',
  '[role="spinbutton"]',
  '[role="option"]',
  '[role="slider"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/** 两个矩形在每条轴上的间距：分开为正，投影重叠为负。 */
function gaps(a: HitRect, b: HitRect): { x: number, y: number } {
  return {
    x: Math.max(b.left - a.right, a.left - b.right),
    y: Math.max(b.top - a.bottom, a.top - b.bottom),
  }
}

export function grown(rect: HitRect, insets: HitInsets): HitRect {
  return {
    left: rect.left - insets.left,
    top: rect.top - insets.top,
    right: rect.right + insets.right,
    bottom: rect.bottom + insets.bottom,
  }
}

function intersects(a: HitRect, b: HitRect): boolean {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
}

/** `rect` 在每条轴上居中朝 `minSize` 长多少，不考虑邻居。 */
export function growth(rect: HitRect, minSize: number = MIN_TOUCH_TARGET): HitInsets {
  const x = Math.max(0, (minSize - (rect.right - rect.left)) / 2)
  const y = Math.max(0, (minSize - (rect.bottom - rect.top)) / 2)
  return { top: y, right: x, bottom: y, left: x }
}

/**
 * 一个组的盒子在碰到邻居之前每一边长多少：和贴着那条边的成员朝 `minSize` 长得一样远，
 * 所以末端成员的目标会伸出组外，就像单独一个控件那样。成员够不到的边是负数，缩回到成员长出的边。
 */
export function groupGrowth(group: HitRect, members: ReadonlyArray<HitRect>, minSize: number = MIN_TOUCH_TARGET): HitInsets {
  if (members.length === 0)
    return NO_HIT_INSETS
  let top = -Infinity
  let right = -Infinity
  let bottom = -Infinity
  let left = -Infinity
  for (const member of members) {
    const own = growth(member, minSize)
    top = Math.max(top, own.top - (member.top - group.top))
    right = Math.max(right, own.right - (group.right - member.right))
    bottom = Math.max(bottom, own.bottom - (group.bottom - member.bottom))
    left = Math.max(left, own.left - (member.left - group.left))
  }
  return { top, right, bottom, left }
}

/**
 * `target` 每一边最多长多少：每条轴居中朝 `minSize` 长，每一边不超过到邻居间距的一半。
 *
 * 只有会「碰上」的邻居才算：任一方全长后伸进对方那一半间距，或者双方全长的区域相交。
 * 它卡住朝向它的那一边；两条轴上都分开（斜对角）的邻居卡住间距更大的那条轴。
 * 这个判断只看两个矩形，邻居对这个目标的判断也一样，所以两边的热区永远不重叠。
 * 和目标重叠的元素（祖先、浮层）不在旁边，不卡任何一边。`full` 替换默认的居中长法，组用它传 `groupGrowth`。
 */
export function clampedHitInsets(
  target: HitRect,
  neighbours: ReadonlyArray<HitRect>,
  minSize: number = MIN_TOUCH_TARGET,
  full: HitInsets = growth(target, minSize),
): HitInsets {
  if (SIDES.every(side => full[side] === 0))
    return NO_HIT_INSETS
  const insets = { ...full }
  const reach = grown(target, full)
  for (const rect of neighbours) {
    const gap = gaps(target, rect)
    if (gap.x < 0 && gap.y < 0)
      continue
    const halfX = Math.max(0, gap.x) / 2
    const halfY = Math.max(0, gap.y) / 2
    const half = { top: halfY, right: halfX, bottom: halfY, left: halfX }
    const neighbourReach = grown(rect, growth(rect, minSize))
    const crosses = intersects(reach, grown(rect, half))
      || intersects(neighbourReach, grown(target, half))
      || intersects(reach, neighbourReach)
    if (!crosses)
      continue
    if (gap.x >= gap.y) {
      if (rect.left >= target.right)
        insets.right = Math.min(insets.right, halfX)
      else
        insets.left = Math.min(insets.left, halfX)
    }
    else if (rect.top >= target.bottom) {
      insets.bottom = Math.min(insets.bottom, halfY)
    }
    else {
      insets.top = Math.min(insets.top, halfY)
    }
  }
  return insets
}

/** 点 (x, y) 到矩形的距离；在矩形里是 0。 */
export function distanceTo(rect: HitRect, x: number, y: number): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right)
  const dy = Math.max(rect.top - y, 0, y - rect.bottom)
  return Math.hypot(dx, dy)
}

/**
 * 在 (x, y) 的一次触摸算给 `rects` 里的哪一个：最近的那个（落在两个重叠目标里时取中心更近的），
 * 并且触摸要在它朝 `minSize` 长出的范围里；否则 -1。组在按下时用它把落在热区上的触摸交给成员。
 */
export function resolveHitTarget(x: number, y: number, rects: ReadonlyArray<HitRect>, minSize: number = MIN_TOUCH_TARGET): number {
  let nearest = -1
  let nearestDistance = Infinity
  rects.forEach((rect, index) => {
    const distance = distanceTo(rect, x, y) * 1e6
      + Math.hypot(x - (rect.left + rect.right) / 2, y - (rect.top + rect.bottom) / 2)
    if (distance < nearestDistance) {
      nearest = index
      nearestDistance = distance
    }
  })
  if (nearest === -1)
    return -1
  const area = grown(rects[nearest], growth(rects[nearest], minSize))
  return x >= area.left && x <= area.right && y >= area.top && y <= area.bottom ? nearest : -1
}

/** 把热区写到元素的 `HIT_INSET_PROPERTIES` 上。 */
export function writeHitInsets(element: HTMLElement, insets: HitInsets): void {
  for (const side of SIDES)
    element.style.setProperty(HIT_INSET_PROPERTIES[side], `${insets[side]}px`)
}

/** 去掉元素上的热区属性。 */
export function clearHitInsets(element: HTMLElement): void {
  for (const side of SIDES)
    element.style.removeProperty(HIT_INSET_PROPERTIES[side])
}

export function sameInsets(a: HitInsets, b: HitInsets): boolean {
  return SIDES.every(side => a[side] === b[side])
}

/** 元素的视口矩形，转成普通对象。 */
export function plainRect(element: Element): HitRect {
  const { left, top, right, bottom } = element.getBoundingClientRect()
  return { left, top, right, bottom }
}
