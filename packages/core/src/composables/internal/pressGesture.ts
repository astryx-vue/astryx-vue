/**
 * 触屏按压模型的纯状态机：输入「刚发生了什么」，输出「现在该画什么」。
 *
 * 系统原生列表（UIKit）对手指的处理：按下先等 0.15 秒才认；滚动一接管手势就立刻取消，
 * 这次手势里不再亮回来；抬手后淡出。iOS Safari 的 CSS `:active` 一样都不做：
 * 手指一碰就亮，滚动开始 1.6 秒后还亮着。所以粗指针下的按压状态由这里管，
 * `:active` 只留给鼠标。
 *
 * 这里不碰 DOM、不碰时钟，测试直接喂事件就能把整套规则跑一遍。
 * DOM 那一半在 `pressFeedback.ts`。
 */

/** 手指停多久才算真按。UIKit 的 `delaysContentTouches` 就是 0.15 秒。快速划一下在这之前就被滚动接管了，所以什么都不亮。 */
export const PRESS_ONSET_MS = 150

/** 手指最多能挪多远还算按压，单位 CSS 像素。iOS 的滚动大约在这个距离接管手势。 */
export const PRESS_SLOP_PX = 10

/** 太快的轻点：抬手时补亮，满强度保持这么久再淡出。不然最常见的操作一点反馈都没有。 */
export const PRESS_FLASH_MS = 100

/** 抬手后淡出的时长。样式表里的淡出动画用同一个数，见 `styles/pressable.css`。 */
export const PRESS_FADE_MS = 200

/** 滚动刚停不久就落下的手指是在「刹车」，不是按压。这个窗口内不亮。 */
export const PRESS_SCROLL_BRAKE_MS = 150

/** 元素上该画的样子。`fading` 是抬手后的淡出。 */
export type PressPaint = 'none' | 'on' | 'fading'

/**
 * 手势走到哪一步了。
 *
 * `dead` 最要紧：变成滚动的手势一直是 dead，直到手指抬起、下一次按下才重新开始。
 * 所以手指停下来、或者滑回原来的控件，都不会再亮。这正是它和 `:active` 的区别。
 */
export type PressPhase = 'idle' | 'armed' | 'pressed' | 'flash' | 'fading' | 'dead'

export interface PressGesture {
  readonly phase: PressPhase
  /** 手指落下的位置，视口坐标。 */
  readonly originX: number
  readonly originY: number
}

export type PressEvent
  = | { kind: 'down', x: number, y: number }
    | { kind: 'move', x: number, y: number }
    | { kind: 'up' }
  /** 平台把手势拿走了：pointercancel、touchcancel、滚动、拖拽。 */
    | { kind: 'cancel' }
  /** 手指按满了 {@link PRESS_ONSET_MS}。 */
    | { kind: 'onset' }
  /** 轻点的满强度保持结束。 */
    | { kind: 'flashEnd' }
  /** 淡出结束。 */
    | { kind: 'fadeEnd' }

export type PressTimer = 'onset' | 'flash' | 'fade'

export interface PressStep {
  readonly gesture: PressGesture
  readonly paint: PressPaint
  /**
   * 这一步要新开的计时器。
   *
   * `null` 表示「不新开」，不等于「把正在跑的关掉」：阶段没变的一步是路过，
   * 那个阶段欠下的计时器还得跑完（armed 欠 onset，flash 欠 flashEnd，fading 欠 fadeEnd）。
   * 调用方只在阶段变了的时候才丢掉旧计时器。
   */
  readonly timer: PressTimer | null
}

const IDLE: PressGesture = { originX: 0, originY: 0, phase: 'idle' }

function travelled(gesture: PressGesture, x: number, y: number): boolean {
  return Math.hypot(x - gesture.originX, y - gesture.originY) > PRESS_SLOP_PX
}

function to(gesture: PressGesture, phase: PressPhase, paint: PressPaint, timer: PressTimer | null): PressStep {
  return { gesture: { ...gesture, phase }, paint, timer }
}

function stay(gesture: PressGesture, paint: PressPaint): PressStep {
  return { gesture, paint, timer: null }
}

function stepArmed(gesture: PressGesture, event: PressEvent): PressStep {
  switch (event.kind) {
    case 'move':
      // 挪远了就是在滚动。什么都还没画，所以也没什么要擦。
      return travelled(gesture, event.x, event.y) ? to(gesture, 'dead', 'none', null) : stay(gesture, 'none')
    case 'cancel':
      // 等待期内就被滚动接管：快速一划什么都不亮，靠的就是这一条。
      return to(gesture, 'dead', 'none', null)
    case 'onset':
      return to(gesture, 'pressed', 'on', null)
    case 'up':
      // 太快了，等不到 onset。抬手时补亮。
      return to(gesture, 'flash', 'on', 'flash')
    default:
      return stay(gesture, 'none')
  }
}

function stepPressed(gesture: PressGesture, event: PressEvent): PressStep {
  if (event.kind === 'move' && !travelled(gesture, event.x, event.y))
    return stay(gesture, 'on')
  // 取消不带过渡，直接擦掉，赶在列表开始动之前。
  if (event.kind === 'move' || event.kind === 'cancel')
    return to(gesture, 'dead', 'none', null)
  if (event.kind === 'up')
    return to(gesture, 'fading', 'fading', 'fade')
  return stay(gesture, 'on')
}

/**
 * 一个事件，一个答案。
 */
export function pressGestureStep(gesture: PressGesture, event: PressEvent): PressStep {
  if (event.kind === 'down') {
    // 新的一次触摸总是从 armed、什么都不画开始，不管上一次是怎么结束的。离开 dead 只有这一条路。
    return { gesture: { originX: event.x, originY: event.y, phase: 'armed' }, paint: 'none', timer: 'onset' }
  }

  switch (gesture.phase) {
    case 'armed':
      return stepArmed(gesture, event)
    case 'pressed':
      return stepPressed(gesture, event)
    case 'flash':
      // 手指已经抬起。这时的 cancel 是平台在收尾（iOS 在 scrollend 才发 pointercancel），不能剪掉这次轻点该得的反馈。
      return event.kind === 'flashEnd' ? to(gesture, 'fading', 'fading', 'fade') : stay(gesture, 'on')
    case 'fading':
      return event.kind === 'fadeEnd' ? stay(IDLE, 'none') : stay(gesture, 'fading')
    case 'dead':
      // 手指抬起才算结束一次被取消的手势，回到 idle 后下一次触摸才能被听见。
      return event.kind === 'up' ? stay(IDLE, 'none') : stay(gesture, 'none')
    case 'idle':
      return stay(IDLE, 'none')
  }
}

export function idlePressGesture(): PressGesture {
  return IDLE
}
