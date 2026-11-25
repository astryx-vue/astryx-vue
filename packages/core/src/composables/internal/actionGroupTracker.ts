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

interface TrackedAction {
  readonly element: HTMLElement
  readonly left: number
  readonly top: number
  readonly right: number
  readonly bottom: number
}

export interface ActionGroupTracker {
  /** 在视口坐标 (x, y) 开始一次按压，`landed` 是落点。返回落在了哪个动作上。 */
  begin: (root: Element, pointerType: string, x: number, y: number, landed: Node | null) => HTMLElement | null
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

function measure(root: Element, pointerType: string): TrackedAction[] {
  const actions: TrackedAction[] = []
  for (const element of root.querySelectorAll<HTMLElement>(`[${PRESS_GROUP_ITEM_ATTRIBUTE}]`)) {
    if (element.matches(DISABLED) || !isTrackedByGroup(element, pointerType))
      continue
    const { left, top, right, bottom } = element.getBoundingClientRect()
    actions.push({ element, left, top, right, bottom })
  }
  return actions
}

export function createActionGroupTracker(): ActionGroupTracker {
  let actions: TrackedAction[] = []
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
    return first
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
    highlighted = null
    landedOn = null
    isTracking = false
  }

  return {
    begin(root, pointerType, x, y, landed) {
      paint(highlighted, 'none')
      highlighted = null
      actions = measure(root, pointerType)
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
