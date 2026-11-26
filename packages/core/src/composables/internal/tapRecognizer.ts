import { currentGesture } from './gestureCounter.js'

/** 「按下去」算作点击的指针类型。笔只在落笔时算：悬停的笔和鼠标一样是悬停。 */
export const TOUCH_POINTER_TYPES: ReadonlySet<string> = new Set(['touch', 'pen'])

export interface TapRecognizer {
  /**
   * 记下一次按压，等它变成「一次轻点」。
   * 浏览器在手指抬起、没有滚动时才在 `trigger` 上派发 click，那就是轻点；
   * 被接走滚动或缩放的按压以 `pointercancel` 结束，等不到 click。
   */
  press: (trigger: Element | null, onTap: (tapEvent: Event) => void) => void
  /** 不再等上一次按压的轻点。 */
  forget: () => void
}

/**
 * 轻点识别：一次手指按压只有在浏览器认定它是轻点（派发 click）时才算数。
 *
 * 手指落下时还不知道它会是轻点、滚动还是长按，只有浏览器在手指挪动或抬起后知道。
 * 它的 click 就是结论（iOS 上来自 UIKit 自己的轻点识别），所以按下只做记录，
 * 等到同一次按压的 click 再开关浮层。从触发器上开始的一次滚动就不会打开提示。
 *
 * click 必须属于这次按压：键盘按键或新的按下都会推进手势编号，
 * 之后键盘激活触发器（按钮上按回车）合成的 click 不会被当成这次的轻点。
 */
export function createTapRecognizer(): TapRecognizer {
  let forgetPending: (() => void) | null = null

  function forget(): void {
    forgetPending?.()
  }

  function press(trigger: Element | null, onTap: (tapEvent: Event) => void): void {
    forget()
    if (trigger == null)
      return
    const target: Element = trigger
    const gesture = currentGesture()
    function handleTap(tapEvent: Event): void {
      stop()
      if (currentGesture() === gesture)
        onTap(tapEvent)
    }
    function stop(): void {
      // 捕获阶段：触发器里禁用的控件会挡住 click 冒泡，那一下仍是对触发器的轻点。
      target.removeEventListener('click', handleTap, true)
      target.removeEventListener('pointercancel', stop)
      if (forgetPending === stop)
        forgetPending = null
    }
    target.addEventListener('click', handleTap, true)
    target.addEventListener('pointercancel', stop)
    forgetPending = stop
  }

  return { press, forget }
}
