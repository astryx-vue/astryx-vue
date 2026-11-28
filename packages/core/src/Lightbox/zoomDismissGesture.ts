/**
 * @file zoomDismissGesture.ts
 * @input 缩放内核（zoomCore.ts）和下拉关闭的选项
 * @output useZoomDismiss：照片 App 的「往下拖关闭」手势
 * @position useZoomStage.ts 的一部分；几何在 zoomDismiss.ts。
 *
 * 照片在适应大小时，一根手指（或鼠标、触控笔、触控板）从往下的方向起拖，照片的中心跟着走，
 * 并随位移缩小。松手后要么关（照片按照片 App 实测的位置弹簧一直往下走出屏幕），要么按共用的
 * `springs.settle` 弹回。外层（灯箱）按位移让背景和控件变淡，照片离场后关闭。
 */

import type { PanGestureRecognizer as Pan } from '../gestures/PanGestureRecognizer'
import type { ZoomCore } from './zoomCore'
import type { ZoomGeometry } from './zoomStage'
import { watch } from 'vue'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'
import { resolveMotion } from '../motion/resolveMotion'
import { springs } from '../motion/uikit/springs'
import { zoomMedia } from '../motion/uikit/zoomMedia'
import { dismissCommits, dismissExitY, dismissTransform } from './zoomDismiss'
import { IDENTITY, isZoomed } from './zoomStage'

/**
 * 下拉关闭时舞台带这个属性，直到照片落位。只包住照片的舞台这时让移出去的照片画在外面。
 */
export const ZOOM_DISMISSING_ATTRIBUTE = 'data-zoom-dismissing'

export interface ZoomDismissOptions {
  /** 现在能不能下拉关闭（图片项、触屏呈现）。 */
  readonly isEnabled: () => boolean
  /** 拖动的每一步：向下的位移，pt。 */
  readonly onDrag: (travel: number) => void
  /**
   * 松手：关（照片离场）还是弹回，以及是不是手指松的手。减少动效时手指松手就地淡入淡出；
   * 鼠标、触控板、触控笔的松手在主指针是粗指针时也淡入淡出。
   */
  readonly onRelease: (dismisses: boolean, touch: boolean) => void
  /** 关掉的照片已经离开舞台。 */
  readonly onDismissed: () => void
}

export interface ZoomDismiss {
  readonly recognizer: Pan
  /** 关掉的照片正在离场：什么都接不住它。 */
  isLeaving: () => boolean
  /** 关掉的照片立刻回到适应大小（灯箱再次打开时）。 */
  reset: () => void
}

interface DismissHost {
  readonly onDragStart?: () => void
  readonly dismiss?: ZoomDismissOptions
}

export function useZoomDismiss(core: ZoomCore, options: DismissHost): ZoomDismiss {
  const { animator, measure, current, write, setTarget, toStage } = core
  const stage = (): HTMLElement | null => core.options.stage()
  // 下拉进行中：起拖时的几何。
  let dragging: ZoomGeometry | null = null
  let leaving = false
  let finger = false

  // 下拉从适应大小的照片上往下起拖。看的是照片要去的地方：正在放大的照片不能下拉关闭。
  const recognizer = new PanGestureRecognizer({
    name: 'Lightbox.dismissPan',
    maximumNumberOfTouches: 1,
    allowedPointerTypes: ['touch', 'pen', 'mouse'],
    allowedScrollTypes: ['continuous'],
    shouldBegin: (pan) => {
      if (options.dismiss?.isEnabled() !== true || leaving)
        return false
      const geometry = measure()
      if (geometry == null || isZoomed(geometry, core.target()))
        return false
      const { x, y } = pan.totalTranslation()
      return y > 0 && y >= Math.abs(x)
    },
  })

  const release = (pan: Pan, geometry: ZoomGeometry, dismiss: ZoomDismissOptions | undefined): void => {
    dragging = null
    // 松手规则和动画都读共用滤波器在抬手时的速度，停顿后抬手就是静止。
    const translation = pan.translation()
    const velocity = pan.velocity()
    const dismisses = pan.state === 'ended' && dismissCommits(translation.y, velocity.y)
    dismiss?.onRelease(dismisses, finger)
    const shown = current()
    if (dismisses) {
      leaving = true
      // 没有缩略图可回去，所以按离场的位置弹簧、从松手速度起一直往下走到屏幕外。
      // 只包住照片的舞台在屏幕底边上方；屏幕底边按起拖时的测量换算成舞台坐标。
      const view = stage()?.ownerDocument.defaultView
      const bottom = view != null ? toStage({ x: 0, y: view.innerHeight }).y : geometry.height
      const y = dismissExitY(geometry, shown, bottom)
      setTarget({ ...shown, y })
      const handle = animator.animate(
        { x: shown.x, y },
        { spring: zoomMedia.dismiss.dismissPositionSpring, velocity: { x: velocity.x, y: velocity.y } },
        { crossfadeAs: 'exit', touchRelease: finger },
      )
      void handle.finished.then(() => {
        if (leaving)
          dismiss?.onDismissed()
      })
      return
    }
    setTarget(IDENTITY)
    // 取消的下拉不是离场，回去用共用的 settle 弹簧（按舞台读），从松手速度起步。
    const settle = resolveMotion(stage(), springs.settle)
    const position = animator.animate(
      { x: 0, y: 0 },
      { spring: settle, velocity: { x: velocity.x, y: velocity.y } },
      { touchRelease: finger },
    )
    const size = animator.animate({ scale: 1 }, { spring: settle }, { touchRelease: finger })
    // 回到盒子里：舞台重新裁切，除非又开始了一次下拉。
    void Promise.all([position.finished, size.finished]).then(() => {
      if (dragging == null && !leaving)
        stage()?.removeAttribute(ZOOM_DISMISSING_ATTRIBUTE)
    })
  }

  useGestureRecognizer(
    () => (core.options.surface ?? core.options.stage)(),
    () => recognizer,
    (pan) => {
      const dismiss = options.dismiss
      if (pan.state === 'began') {
        finger = pan.trackedTouches[0]?.pointerType === 'touch'
        const geometry = measure()
        if (geometry == null || dismiss == null)
          return
        animator.stop()
        options.onDragStart?.()
        dragging = geometry
        stage()?.setAttribute(ZOOM_DISMISSING_ATTRIBUTE, '')
      }
      const geometry = dragging
      if (geometry == null)
        return
      if (pan.state === 'began' || pan.state === 'changed') {
        const translation = pan.translation()
        write(dismissTransform(geometry, translation.x, translation.y))
        dismiss?.onDrag(Math.max(0, translation.y))
        return
      }
      release(pan, geometry, dismiss)
    },
    { isEnabled: () => options.dismiss?.isEnabled() === true, manageStyle: false },
  )

  // 换了一项：进行中的下拉结束，舞台重新裁切。照片回到适应大小由内核负责。
  watch(core.options.itemKey, () => {
    dragging = null
    leaving = false
    stage()?.removeAttribute(ZOOM_DISMISSING_ATTRIBUTE)
  }, { flush: 'pre' })

  return {
    recognizer,
    isLeaving: () => leaving,
    reset: () => {
      if (!leaving)
        return
      leaving = false
      dragging = null
      animator.stop()
      animator.set({ x: 0, y: 0, scale: 1, opacity: 1 })
      setTarget(IDENTITY)
      stage()?.removeAttribute(ZOOM_DISMISSING_ATTRIBUTE)
    },
  }
}
