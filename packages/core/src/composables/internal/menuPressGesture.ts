/**
 * 菜单按压的纯状态机。不碰 DOM，每一步都能脱离浏览器单测。
 *
 * 所有菜单和选择器共用这一套：指针**松开**时下面是哪一行，就由哪一行执行；
 * 按住期间高亮跟着指针走。macOS 和 iOS 的菜单就是这样。
 *
 * 状态：
 * - `idle`：没有手势。
 * - `triggerPress`：手指按在触发器上，菜单还没开。鼠标不经过这一步，按下就开。
 * - `open`：菜单在按住的指针下面打开了（鼠标按下，或手指按满长按时间），指针还没进菜单。
 * - `tracking`：指针按着，高亮跟着它。
 *
 * 落定规则：打开菜单的那次按压，只有指针进过菜单、或者按满 `MENU_PRESS_SETTLE_MS`，
 * 松开时才执行；否则什么都不执行，菜单保持打开。没有这条，一个在指针下面弹出的菜单
 * 会替用户挑一行谁都没选的。
 *
 * 行是不透明的 `T`：调用方把指针下可用的那一行找出来喂进来，`null` 表示指针在分割线、
 * 标题、禁用行上，或者在菜单外。
 */

/** 打开菜单的那次按压至少要按多久，松开时才能执行。 */
export const MENU_PRESS_SETTLE_MS = 300

export type MenuPressPointerType = 'mouse' | 'touch' | 'pen'

export type MenuPressGesture<T>
  = | { phase: 'idle' }
    | { phase: 'triggerPress', pointerType: MenuPressPointerType, startedAt: number }
    | { phase: 'open', pointerType: MenuPressPointerType, openedAt: number }
    | {
      phase: 'tracking'
      pointerType: MenuPressPointerType
      /** 按压从哪里开始。 */
      origin: 'trigger' | 'menu'
      /** 指针下面当前那一行可用的行。 */
      row: T | null
    }

export type MenuPressEvent<T>
  = | {
    type: 'down'
    target: 'trigger' | 'menu'
    pointerType: MenuPressPointerType
    /** 落在菜单里时，按下位置那一行可用的行。 */
    row: T | null
    time: number
  }
  /** 触发器上的按压还按着，菜单开了。 */
  | { type: 'opened', time: number }
  | { type: 'move', row: T | null, isInMenu: boolean, time: number }
  | { type: 'up', row: T | null, isInMenu: boolean, isOnTrigger: boolean, time: number }
  /** 浏览器拿走了手势：pointercancel、第二根手指、滚动。 */
  | { type: 'cancel' }

export type MenuPressEffect<T>
  = | { type: 'none' }
  /** 鼠标按下触发器：现在就在按住的指针下面打开菜单。 */
    | { type: 'open' }
    | { type: 'highlight', row: T }
    | { type: 'clear' }
    | { type: 'act', row: T }
  /**
   * 手势结束，没有行执行。`stray` 表示浏览器还会为这次手势补一个 click，
   * 必须吞掉；`dismiss` 表示菜单该关（鼠标在菜单外松开）。
   */
    | { type: 'settle', stray: boolean, dismiss: boolean }

export interface MenuPressStep<T> {
  gesture: MenuPressGesture<T>
  effect: MenuPressEffect<T>
}

export const IDLE_MENU_PRESS: MenuPressGesture<never> = { phase: 'idle' }

const NONE: MenuPressEffect<never> = { type: 'none' }

function idle<T>(effect: MenuPressEffect<T>): MenuPressStep<T> {
  return { gesture: { phase: 'idle' }, effect }
}

function highlightEffect<T>(row: T | null): MenuPressEffect<T> {
  return row == null ? { type: 'clear' } : { type: 'highlight', row }
}

/**
 * 高亮跟着指针时的松开：在可用行上就执行；在菜单的空白处什么都不执行；
 * 在菜单外什么都不执行，鼠标还会关掉菜单（手指不关）。松回触发器上从不关。
 */
function release<T>(pointerType: MenuPressPointerType, event: Extract<MenuPressEvent<T>, { type: 'up' }>): MenuPressStep<T> {
  if (event.row != null)
    return idle({ type: 'act', row: event.row })
  if (event.isInMenu || event.isOnTrigger)
    return idle({ type: 'settle', stray: true, dismiss: false })
  return idle({ type: 'settle', stray: true, dismiss: pointerType === 'mouse' })
}

function stepIdle<T>(gesture: MenuPressGesture<T>, event: MenuPressEvent<T>): MenuPressStep<T> {
  if (event.type !== 'down')
    return { gesture, effect: NONE }
  if (event.target === 'menu') {
    return {
      gesture: { phase: 'tracking', pointerType: event.pointerType, origin: 'menu', row: event.row },
      effect: highlightEffect(event.row),
    }
  }
  if (event.pointerType === 'mouse')
    return { gesture: { phase: 'open', pointerType: 'mouse', openedAt: event.time }, effect: { type: 'open' } }
  return { gesture: { phase: 'triggerPress', pointerType: event.pointerType, startedAt: event.time }, effect: NONE }
}

function stepTriggerPress<T>(
  gesture: Extract<MenuPressGesture<T>, { phase: 'triggerPress' }>,
  event: MenuPressEvent<T>,
): MenuPressStep<T> {
  switch (event.type) {
    case 'opened':
      return { gesture: { phase: 'open', pointerType: gesture.pointerType, openedAt: event.time }, effect: NONE }
    case 'up':
      // 轻点。打开菜单的是浏览器给触发器的那次 click，所以它必须放行。
      return idle({ type: 'settle', stray: false, dismiss: false })
    case 'cancel':
      // 浏览器拿走了手势。照样走结束流程，好把挡页面滚动的监听拆掉。被取消的指针后面没有 click。
      return idle({ type: 'settle', stray: false, dismiss: false })
    default:
      return { gesture, effect: NONE }
  }
}

function stepOpen<T>(
  gesture: Extract<MenuPressGesture<T>, { phase: 'open' }>,
  event: MenuPressEvent<T>,
): MenuPressStep<T> {
  switch (event.type) {
    case 'move':
      if (!event.isInMenu)
        return { gesture, effect: NONE }
      return {
        gesture: { phase: 'tracking', pointerType: gesture.pointerType, origin: 'trigger', row: event.row },
        effect: highlightEffect(event.row),
      }
    case 'up':
      // 没进过菜单、按得又短：菜单开着，什么都不执行，触发器为这次手势收到的 click 也不能把它关掉。
      if (event.time - gesture.openedAt < MENU_PRESS_SETTLE_MS)
        return idle({ type: 'settle', stray: true, dismiss: false })
      return release(gesture.pointerType, event)
    case 'cancel':
      return idle({ type: 'settle', stray: false, dismiss: false })
    default:
      return { gesture, effect: NONE }
  }
}

function stepTracking<T>(
  gesture: Extract<MenuPressGesture<T>, { phase: 'tracking' }>,
  event: MenuPressEvent<T>,
): MenuPressStep<T> {
  switch (event.type) {
    case 'move':
      if (event.row === gesture.row)
        return { gesture, effect: NONE }
      return { gesture: { ...gesture, row: event.row }, effect: highlightEffect(event.row) }
    case 'up':
      return release(gesture.pointerType, event)
    case 'cancel':
      // 滚动或第二根手指：什么都不执行，菜单留着。
      return idle({ type: 'settle', stray: false, dismiss: false })
    default:
      return { gesture, effect: NONE }
  }
}

/** 往前走一步。纯函数：同样的输入，同样的输出。 */
export function menuPressStep<T>(gesture: MenuPressGesture<T>, event: MenuPressEvent<T>): MenuPressStep<T> {
  switch (gesture.phase) {
    case 'idle':
      return stepIdle(gesture, event)
    case 'triggerPress':
      return stepTriggerPress(gesture, event)
    case 'open':
      return stepOpen(gesture, event)
    case 'tracking':
      return stepTracking(gesture, event)
  }
}
