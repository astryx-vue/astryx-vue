import type { HitRect } from './hitArea.js'
import { INTERACTIVE_SELECTOR, resolveHitTarget } from './hitArea.js'
import { PRESSED_ATTRIBUTE, pressFadeMs } from './pressFeedback.js'
import { isTrackedByGroup, PRESS_GROUP_ITEM_ATTRIBUTE } from './pressSurface.js'
import { armStrayClick } from './strayClick.js'

/**
 * 一组并排的动作（提示对话框的两个按钮、按钮组、切换按钮组）当成一个控件来跟踪手指，
 * 和 UIKit 处理系统弹窗按钮一样：
 * - 手指下的那个动作高亮，手指滑到别的动作上，高亮跟过去；滑到动作之间或组外，什么都不亮。
 * - 松手时执行手指下的那个动作，它的高亮淡出。在组外松手什么都不执行。
 *
 * 只在开始时读一次各个动作的位置，滑动过程中不再读布局。
 */

export { isTrackedByGroup, PRESS_GROUP_ITEM_ATTRIBUTE } from './pressSurface.js'

/** 组跟踪手指和笔的滑动；鼠标保持原生按钮的行为。 */
export const GROUP_PRESS_POINTERS: readonly string[] = ['touch', 'pen']

/** 不可用的动作不亮也不执行。 */
const DISABLED = ':disabled, [aria-disabled="true"]'

/** 摊到组跟踪的每个动作上的标记。 */
export function pressGroupItemProps(pointerTypes: readonly string[] = GROUP_PRESS_POINTERS): Readonly<Record<string, string>> {
  return { [PRESS_GROUP_ITEM_ATTRIBUTE]: pointerTypes.join(' ') }
}

export interface TrackedAction extends HitRect {
  readonly element: HTMLElement
}

export interface ActionGroupTracker {
  /**
   * 在视口坐标 (x, y) 开始一次按压，`landed` 是落点。返回落在了哪个动作上。
   * `growsTargets` 为真时，不在任何动作上的点落到最近动作朝 44px 长出的范围里，也算那个动作。
   */
  begin: (root: Element, pointerType: string, x: number, y: number, landed: Node | null, growsTargets?: boolean) => HTMLElement | null
  /** 手指移到了 (x, y)。 */
  move: (x: number, y: number) => void
  /** 松手：高亮淡出，执行手指下的动作，返回执行了哪个。在松手事件里调，保住用户激活。 */
  end: () => HTMLElement | null
  /** 手势被拿走了：高亮直接擦掉，什么都不执行。 */
  cancel: () => void
  /** 现在高亮的动作。 */
  readonly highlighted: HTMLElement | null
  /** 正在跟踪吗。 */
  readonly isTracking: boolean
  /** 卸载时：结束所有淡出，忘掉这次按压。 */
  dispose: () => void
}

function boxOf(element: HTMLElement): TrackedAction {
  const { left, top, right, bottom } = element.getBoundingClientRect()
  return { element, left, top, right, bottom }
}

/** 组为 `pointerType` 跟踪的可用动作和它们的位置。 */
export function measureActions(root: Element, pointerType: string): TrackedAction[] {
  const actions: TrackedAction[] = []
  for (const element of root.querySelectorAll<HTMLElement>(`[${PRESS_GROUP_ITEM_ATTRIBUTE}]`)) {
    if (element.matches(DISABLED) || !isTrackedByGroup(element, pointerType))
      continue
    actions.push(boxOf(element))
  }
  return actions
}

/** 组里手指不能穿过去的东西：禁用的动作，以及组不跟踪的可点成员（比如菜单触发器）。 */
function measureNeighbours(root: Element, pointerType: string): TrackedAction[] {
  const neighbours: TrackedAction[] = []
  for (const element of root.querySelectorAll<HTMLElement>(`[${PRESS_GROUP_ITEM_ATTRIBUTE}], ${INTERACTIVE_SELECTOR}`)) {
    const action = element.closest(`[${PRESS_GROUP_ITEM_ATTRIBUTE}]`)
    const isTracked = action != null && root.contains(action) && isTrackedByGroup(action, pointerType)
    // 被跟踪动作里面的部件属于那个动作；被跟踪的动作只在禁用时算邻居。
    if (!isTracked || (action === element && element.matches(DISABLED)))
      neighbours.push(boxOf(element))
  }
  return neighbours
}

/** 落在 (x, y) 的触摸归哪个动作：最近的那个，并且在它朝 44px 长出的范围里；离邻居更近就不归任何动作。 */
function nearestGrownAction(actions: ReadonlyArray<TrackedAction>, neighbours: ReadonlyArray<HitRect>, x: number, y: number): HTMLElement | null {
  const index = resolveHitTarget(x, y, [...actions, ...neighbours])
  return index >= 0 && index < actions.length ? actions[index].element : null
}

/** 落在组自己（热区）上的一次触摸归哪个动作。 */
export function resolveGroupTouch(root: Element, pointerType: string, x: number, y: number): HTMLElement | null {
  return nearestGrownAction(measureActions(root, pointerType), measureNeighbours(root, pointerType), x, y)
}

export function createActionGroupTracker(): ActionGroupTracker {
  let actions: TrackedAction[] = []
  let neighbours: TrackedAction[] = []
  let growsTargets = false
  let highlighted: HTMLElement | null = null
  let landedOn: Node | null = null
  let isTracking = false
  const fades = new Map<Element, ReturnType<typeof setTimeout>>()

  function clearFade(element: Element): void {
    const fade = fades.get(element)
    if (fade != null) {
      clearTimeout(fade)
      fades.delete(element)
    }
  }

  function paint(element: HTMLElement | null, state: 'on' | 'fading' | 'none'): void {
    if (element == null)
      return
    clearFade(element)
    if (state === 'none') {
      element.removeAttribute(PRESSED_ATTRIBUTE)
      return
    }
    element.setAttribute(PRESSED_ATTRIBUTE, state)
    if (state === 'fading') {
      fades.set(element, setTimeout(() => {
        fades.delete(element)
        if (element.getAttribute(PRESSED_ATTRIBUTE) === 'fading')
          element.removeAttribute(PRESSED_ATTRIBUTE)
      }, pressFadeMs(element)))
    }
  }

  /** 手指下的动作。没有布局（测试环境）时几个矩形都包含这个点，落点所在的那个优先。 */
  function actionAt(x: number, y: number): HTMLElement | null {
    let first: HTMLElement | null = null
    for (const action of actions) {
      if (x < action.left || x > action.right || y < action.top || y > action.bottom)
        continue
      if (landedOn != null && action.element.contains(landedOn))
        return action.element
      first ??= action.element
    }
    return first ?? (growsTargets ? nearestGrownAction(actions, neighbours, x, y) : null)
  }

  function highlight(next: HTMLElement | null): void {
    if (next === highlighted)
      return
    paint(highlighted, 'none')
    highlighted = next
    paint(next, 'on')
  }

  function reset(): void {
    actions = []
    neighbours = []
    growsTargets = false
    highlighted = null
    landedOn = null
    isTracking = false
  }

  return {
    begin(root, pointerType, x, y, landed, grows = false) {
      paint(highlighted, 'none')
      highlighted = null
      actions = measureActions(root, pointerType)
      growsTargets = grows
      neighbours = grows ? measureNeighbours(root, pointerType) : []
      landedOn = landed
      isTracking = true
      highlight(actionAt(x, y))
      return highlighted
    },
    move(x, y) {
      if (isTracking)
        highlight(actionAt(x, y))
    },
    end() {
      const lifted = highlighted
      const wasTracking = isTracking
      reset()
      if (!wasTracking || lifted == null)
        return null
      paint(lifted, 'fading')
      if (lifted.matches(DISABLED))
        return null
      // 浏览器随后还会给按下的那个元素补一个 click，吞掉它，动作只执行一次。
      armStrayClick(lifted.ownerDocument)
      lifted.click()
      return lifted
    },
    cancel() {
      paint(highlighted, 'none')
      reset()
    },
    get highlighted() {
      return highlighted
    },
    get isTracking() {
      return isTracking
    },
    dispose() {
      for (const [element, fade] of fades) {
        clearTimeout(fade)
        if (element.getAttribute(PRESSED_ATTRIBUTE) === 'fading')
          element.removeAttribute(PRESSED_ATTRIBUTE)
      }
      fades.clear()
      paint(highlighted, 'none')
      reset()
    },
  }
}
