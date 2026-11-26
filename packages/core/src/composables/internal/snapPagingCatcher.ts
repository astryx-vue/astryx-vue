import type { GestureEventContext, GestureTouch, PointerKind } from '../../gestures/types'
import { LongPressGestureRecognizer } from '../../gestures/LongPressGestureRecognizer'

/**
 * 翻页途中「接住」这一行的识别器：一个零时长、不认领触摸的长按。它从不认领
 * 触摸，所以从正在翻页的这一行上开始的竖向滑动或双指捏合仍然归页面，和 UIKit
 * 里分页视图停住后把竖向拖动交给外层滚动视图一样。它只记下按下来的是哪种指针，
 * 并提供一个按事件时钟走的接住计时器和「不让内容收到这次触摸」两件事。
 */
export class SettleCatcher extends LongPressGestureRecognizer {
  /** 按下来接住这一行的指针种类。 */
  pointerType: PointerKind | null = null

  override get claimsTouches(): boolean {
    return false
  }

  /**
   * 触摸后 `ms` 毫秒（按事件时钟）调用 `callback`，触摸先结束就不调。仲裁会在
   * 任何更晚的输入之前跑它，所以页面忙、按下和抬起一起到时，它仍然先跑。
   * 零时长、不认点按次数的长按不占用自己唯一的仲裁计时器，正好拿来用。
   */
  armCatch(ms: number, callback: () => void): void {
    this.setTimer((this.beganAt ?? this.now()) + ms, callback)
  }

  /** 取消 `armCatch` 设下、还没跑的接住。 */
  disarmCatch(): void {
    this.clearTimer()
  }

  /** 把这次触摸从下面的内容那里拿走：不按下、不点击。UIKit 里停住滚动视图的那次触摸也到不了内容。 */
  takeFromContent(): void {
    this.cancelTouchesInView()
  }

  protected override touchesBegan(touches: ReadonlyArray<GestureTouch>, event: GestureEventContext): void {
    if (this.state === 'possible' && touches.length > 0)
      this.pointerType = touches[0]!.pointerType
    super.touchesBegan(touches, event)
  }
}
