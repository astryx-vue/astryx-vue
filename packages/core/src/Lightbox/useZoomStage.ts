/**
 * @file useZoomStage.ts
 * @input 缩放内核（zoomCore.ts）、舞台和手势表面、是否开启手势和触屏呈现、当前项、下拉关闭、
 *   点按和拖动回调
 * @output useZoomStage：灯箱的缩放手势，照着能缩放的 UIScrollView，对所有指针都生效
 * @position 灯箱内部的手势模块，建在手势识别器和内核的动画器上；几何在 zoomStage.ts，
 *   下拉关闭的手势在 zoomDismissGesture.ts。
 *
 * 识别器挂在舞台或图集的轨道上：
 * - 捏合（只认手指，ctrl + 滚轮也算），和平移同时识别，两根手指能同时缩放和移动。捏合结束后留下的
 *   那根手指继续平移。
 * - 平移：一根或两根手指、鼠标或触控笔拖动、触控板滚动。只移动放大后的照片。触屏呈现下松手带
 *   滚动视图的惯性，越过边缘有橡皮筋；否则 1:1 跟手、停在边上、松手就停。外层有翻页器时，朝边外拖
 *   且照片已经贴边，这一下交给翻页器。
 * - 双击（手指）：铺满舞台、至少 2 倍、点到的地方不动；已放大时还原。鼠标双击走浏览器的 `dblclick`。
 * - 单击（手指），等双击失败后才算：点在照片外面就报给灯箱，灯箱关闭。
 * - 零时长按下：UIKit 的「按下即停」。按在正在动的照片上会把它停在显示的位置，不拖就抬起让它落位。
 *
 * 照着 UIKit 实测：上下限以内缩放 1:1 跟捏合；质心下的点一直在质心下，越界也是；抬手后没有缩放惯性；
 * 越界后从捏合的速度弹回，锚在最后的质心。两指单击什么都不做。
 */

import type { GestureRecognizer } from '../gestures/GestureRecognizer'
import type { Point } from '../gestures/types'
import type { ZoomCore, ZoomStage } from './zoomCore'
import type { ZoomDismissOptions } from './zoomDismissGesture'
import type { StagePoint, ZoomGeometry } from './zoomStage'
import { LongPressGestureRecognizer } from '../gestures/LongPressGestureRecognizer'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { PinchGestureRecognizer } from '../gestures/PinchGestureRecognizer'
import { TapGestureRecognizer } from '../gestures/TapGestureRecognizer'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'
import { coast as coastCurves } from '../motion/coast'
import { decayRestDistance } from '../motion/decay'
import { UIKIT_PAN } from '../motion/uikit/gestures'
import { ZOOM_DRAGGING_ATTRIBUTE } from './zoomCore'
import { useZoomDismiss } from './zoomDismissGesture'
import {
  doubleTapTarget,
  draggedTransform,
  isZoomed,
  overshootScale,
  pinchScaleFor,
  rawForDragged,
  releaseTarget,
  restRange,
  transformKeepingPoint,
} from './zoomStage'

export interface ZoomStageGestureOptions {
  /** 手势开着（能缩放时），对所有指针都生效。 */
  readonly isEnabled: () => boolean
  /** 手指单击落在照片外面（舞台上，或图集页面空白处），客户区坐标。 */
  readonly onTapOutside?: (location: Point) => void
  /** 平移开始了（之后在遮罩上松开的点击不能关闭）。 */
  readonly onDragStart?: () => void
  /** 触屏呈现：平移越过边缘的橡皮筋和松手惯性只属于它。 */
  readonly isTouchPresentation: () => boolean
  /** 捏合（或两指平移）能不能开始；false 把手指留给页面自己的缩放。 */
  readonly shouldBeginPinch?: (recognizer: GestureRecognizer) => boolean
  /** 外层有翻页器：朝已贴边的一侧拖，这一下交给翻页器。 */
  readonly hasOuterPager: () => boolean
  /** 下拉关闭（照片 App 那样）；没有就不开。 */
  readonly dismiss?: ZoomDismissOptions
}

/** 手势层在内核 API 上加的部分。 */
export interface ZoomStageWithTouch extends ZoomStage {
  /** 已经被拖走关闭的照片立刻回到适应大小（灯箱再次打开时）。 */
  reset: () => void
}

interface PinchSession {
  readonly start: { x: number, y: number, scale: number }
  /** 起点对应的捏合自身倍数（越界时更大）。 */
  readonly startPinchScale: number
  readonly anchor: StagePoint
  centroid: StagePoint
}

interface PanSession {
  /** 会话开始时的指针位移变换。 */
  readonly raw: { x: number, y: number, scale: number }
  readonly translation: Point
  /** 越过边缘会让步，松手带惯性。 */
  readonly hasGive: boolean
}

const EVERY_POINTER = ['touch', 'pen', 'mouse'] as const
/** 只有手指捏合；ctrl + 滚轮也会捏合。 */
const FINGERS = ['touch'] as const

export function useZoomStage(core: ZoomCore, options: ZoomStageGestureOptions): ZoomStageWithTouch {
  const { animator, measure, toStage, current, write, setTarget, setZoomed, settleTo, isMoving, isAtEdgeOf } = core
  let pinch: PinchSession | null = null
  let pan: PanSession | null = null
  // 按下停住了一张在动的照片；之后有没有拖过或捏过。
  let caught = false
  let draggedSinceCatch = false
  // 每个手势是不是手指起的头，开始时读第一个触点。
  const finger = { pinch: false, catch: false }
  const hasGive = (): boolean => options.isTouchPresentation()

  /** 放大后平移的松手：UIScrollView 的惯性，碰到边缘回弹。减少动效时也保留，这是人自己的动作。 */
  const coast = (geometry: ZoomGeometry, velocity: Point): void => {
    const from = current()
    const range = restRange(geometry, from.scale)
    const vx = range.x.min === range.x.max ? 0 : velocity.x
    const vy = range.y.min === range.y.max ? 0 : velocity.y
    const rest = (value: number, v: number, { min, max }: typeof range.x): number =>
      Math.min(max, Math.max(min, value + decayRestDistance(v)))
    setTarget({ x: rest(from.x, vx, range.x), y: rest(from.y, vy, range.y), scale: from.scale })
    setZoomed(isZoomed(geometry, from))
    animator.decay(coastCurves(animator, { x: vx, y: vy }, { bounds: { x: range.x, y: range.y } }))
  }

  const dismiss = useZoomDismiss(core, options)

  const pinchRecognizer = new PinchGestureRecognizer({
    name: 'Lightbox.zoomPinch',
    allowedPointerTypes: FINGERS,
    shouldBegin: recognizer => options.shouldBeginPinch?.(recognizer) ?? true,
  })
  // 两根手指时跟着捏合的规则；一根手指时只在放大后开始，外层有翻页器且朝已贴边的一侧拖就让给它。
  const panRecognizer = new PanGestureRecognizer({
    name: 'Lightbox.zoomPan',
    maximumNumberOfTouches: 2,
    allowedPointerTypes: EVERY_POINTER,
    allowedScrollTypes: ['continuous'],
    shouldBegin: (recognizer) => {
      if (recognizer.numberOfTouches > 1)
        return options.shouldBeginPinch?.(recognizer) ?? true
      const geometry = measure()
      if (geometry == null || !isZoomed(geometry, current()))
        return false
      const { x, y } = recognizer.totalTranslation()
      return !(options.hasOuterPager() && Math.abs(x) >= Math.abs(y) && isAtEdgeOf(geometry, x < 0 ? 'left' : 'right'))
    },
    // 鼠标或触控笔拖放大的照片，第一下移动就开始平移；手指保留 UIKit 的起拖距离，好分清点按和拖动。
    hysteresis: (touch) => {
      const geometry = core.geometry()
      return touch.pointerType !== 'touch' && geometry != null && isZoomed(geometry, current())
        ? 0
        : UIKIT_PAN.hysteresis.value
    },
  })
  const doubleTap = new TapGestureRecognizer({
    name: 'lightbox-zoom-double-tap',
    numberOfTapsRequired: 2,
    allowedPointerTypes: FINGERS,
  })
  const tap = new TapGestureRecognizer({ name: 'lightbox-zoom-tap', allowedPointerTypes: FINGERS })
  // 只停住在动的照片，静止的照片把按下留给别人（比如外层翻页器自己的「接住」）。
  const touchDown = new LongPressGestureRecognizer({
    name: 'lightbox-zoom-touch-down',
    minimumPressDuration: 0,
    allowableMovement: Number.POSITIVE_INFINITY,
    cancelsTouchesInView: false,
    delaysTouchesEnded: false,
    allowedPointerTypes: EVERY_POINTER,
    shouldBegin: () => !dismiss.isLeaving() && isMoving(),
  })
  pinchRecognizer.recognizeSimultaneouslyWith(panRecognizer)
  tap.requireToFail(doubleTap)
  for (const other of [pinchRecognizer, panRecognizer, doubleTap, tap, dismiss.recognizer])
    touchDown.recognizeSimultaneouslyWith(other)

  const surface = (): HTMLElement | null => (core.options.surface ?? core.options.stage)()
  const recognizerOptions = { isEnabled: options.isEnabled, manageStyle: false }

  useGestureRecognizer(surface, () => pinchRecognizer, (recognizer) => {
    if (recognizer.state === 'began') {
      finger.pinch = recognizer.trackedTouches[0]?.pointerType === 'touch'
      const geometry = measure()
      if (geometry == null)
        return
      draggedSinceCatch = true
      animator.stop()
      const start = current()
      const anchor = toStage(recognizer.focalPoint())
      pinch = { start, startPinchScale: pinchScaleFor(geometry, start.scale), anchor, centroid: anchor }
    }
    const session = pinch
    const geometry = core.geometry()
    const moving = recognizer.state === 'began' || recognizer.state === 'changed'
    // 会话随捏合一起结束，不然留下的会话会挡住之后所有的平移。
    if (!moving)
      pinch = null
    if (session == null || geometry == null)
      return
    if (moving) {
      session.centroid = toStage(recognizer.focalPoint())
      const shown = overshootScale(geometry, session.startPinchScale * recognizer.scale)
      write(transformKeepingPoint(geometry, session.start, session.anchor, session.centroid, shown))
      return
    }
    const shown = current()
    const to = releaseTarget(geometry, shown, session.centroid)
    if (to !== shown) {
      // 越界了：从抬手时照片的缩放速度弹回，锚在最后的质心。还按着的手指等它再落下。
      pan = null
      // 照片每秒的缩放变化：捏合的速度乘上越界让步的斜率。被取消的捏合从静止弹回。
      const raw = session.startPinchScale * recognizer.scale
      const step = raw * 1e-4
      const give = (overshootScale(geometry, raw + step) - overshootScale(geometry, raw - step)) / (2 * step)
      settleTo(geometry, to, {
        touchRelease: finger.pinch,
        scaleVelocity: recognizer.state === 'ended' ? give * session.startPinchScale * recognizer.velocity : 0,
      })
      return
    }
    if (panRecognizer.state === 'began' || panRecognizer.state === 'changed') {
      // 还按着的手指从这里接着平移，不跳。
      const withGive = hasGive()
      pan = {
        raw: rawForDragged(geometry, shown),
        translation: withGive ? panRecognizer.translation() : panRecognizer.totalTranslation(),
        hasGive: withGive,
      }
      setZoomed(isZoomed(geometry, shown))
      return
    }
    coast(geometry, { x: 0, y: 0 })
  }, recognizerOptions)

  useGestureRecognizer(surface, () => panRecognizer, (recognizer) => {
    const stage = core.options.stage()
    if (recognizer.state === 'began') {
      const geometry = measure()
      if (geometry == null)
        return
      draggedSinceCatch = true
      animator.stop()
      options.onDragStart?.()
      const shown = current()
      if (isZoomed(geometry, shown))
        stage?.setAttribute(ZOOM_DRAGGING_ATTRIBUTE, '')
      pan = { raw: rawForDragged(geometry, shown), translation: { x: 0, y: 0 }, hasGive: hasGive() }
    }
    const geometry = core.geometry()
    if (recognizer.state === 'began' || recognizer.state === 'changed') {
      const session = pan
      if (pinch != null || session == null || geometry == null)
        return
      // 有让步时位移不含起拖距离（越过的部分立刻显示，和 UIKit 一样）；没有让步时照片跟着整段位移。
      const translation = session.hasGive ? recognizer.translation() : recognizer.totalTranslation()
      const raw = {
        x: session.raw.x + translation.x - session.translation.x,
        y: session.raw.y + translation.y - session.translation.y,
        scale: session.raw.scale,
      }
      if (session.hasGive) {
        write(draggedTransform(geometry, raw))
        return
      }
      const range = restRange(geometry, raw.scale)
      write({
        x: Math.min(range.x.max, Math.max(range.x.min, raw.x)),
        y: Math.min(range.y.max, Math.max(range.y.min, raw.y)),
        scale: raw.scale,
      })
      return
    }
    stage?.removeAttribute(ZOOM_DRAGGING_ATTRIBUTE)
    const session = pan
    pan = null
    if (pinch != null || session == null || geometry == null)
      return
    // 松手带共用滤波器在抬手时的速度：滚动视图的速度，停顿后抬手就是静止。
    coast(geometry, recognizer.state === 'ended' && session.hasGive ? recognizer.scrollVelocity() : { x: 0, y: 0 })
  }, recognizerOptions)

  useGestureRecognizer(surface, () => touchDown, (recognizer) => {
    if (recognizer.state === 'began') {
      finger.catch = recognizer.trackedTouches[0]?.pointerType === 'touch'
      // 只在照片在动时开始：按呈现值停在显示的位置。
      draggedSinceCatch = false
      caught = true
      const shown = current()
      animator.stop()
      setTarget(shown)
      return
    }
    if (recognizer.state === 'changed')
      return
    // 抬起或被别人接走。停住后没拖过就从停住的地方落位：回到舞台里，或回到越过的缩放极限。
    const wasCaught = caught
    caught = false
    const geometry = core.geometry() ?? measure()
    if (!wasCaught || draggedSinceCatch || geometry == null)
      return
    const shown = current()
    const limit = releaseTarget(geometry, shown, { x: geometry.width / 2, y: geometry.height / 2 })
    if (limit !== shown) {
      settleTo(geometry, limit, { touchRelease: finger.catch })
      return
    }
    coast(geometry, { x: 0, y: 0 })
  }, recognizerOptions)

  useGestureRecognizer(surface, () => doubleTap, (recognizer) => {
    if (recognizer.state !== 'ended')
      return
    const geometry = measure()
    if (geometry == null)
      return
    settleTo(geometry, doubleTapTarget(geometry, current(), toStage(recognizer.location())))
  }, recognizerOptions)

  useGestureRecognizer(surface, () => tap, (recognizer) => {
    if (recognizer.state !== 'ended')
      return
    const geometry = measure()
    if (geometry == null)
      return
    const point = toStage(recognizer.location())
    const { x, y, scale } = current()
    const left = geometry.fit.x + x
    const top = geometry.fit.y + y
    const onPhoto = point.x >= left && point.x <= left + geometry.fit.width * scale
      && point.y >= top && point.y <= top + geometry.fit.height * scale
    if (!onPhoto)
      options.onTapOutside?.(recognizer.location())
  }, recognizerOptions)

  return { ...core.api, reset: dismiss.reset }
}
