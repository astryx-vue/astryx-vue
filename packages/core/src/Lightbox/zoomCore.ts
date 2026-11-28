/**
 * @file zoomCore.ts
 * @input 舞台元素（裁切并居中照片）、手势挂载的表面（图集的页面轨道）、是否能缩放、当前项、
 *   缩放状态回调
 * @output createZoomCore：灯箱的缩放舞台内核。照片的变换走合成器动画器，所有缩放（包括键盘缩放和平移）
 *   都落在 `springs.settle` 弹簧上；对外的 API 还告诉外层翻页器照片是否已经顶到边（`isAtEdge`）
 * @position 灯箱内部。useZoomStage.ts 在它上面接手势，几何在 zoomStage.ts。
 */

import type { Animator } from '../motion/animator'
import type { StagePoint, ZoomGeometry, ZoomTransform } from './zoomStage'
import { watch } from 'vue'
import { useAttachment } from '../gestures/useAttachment'
import { createMotionEngine } from '../motion/animator'
import { resolveMotion } from '../motion/resolveMotion'
import { springs } from '../motion/uikit/springs'
import { registerReducedMotionCrossFade } from '../motion/uikit/timing'
import { observeResize } from '../utils/sharedResizeObserver'
import {
  doubleClickTarget,
  doubleTapScaleFor,
  IDENTITY,
  isZoomed,
  maxScaleFor,
  pannedBy,
  releasedZoomTarget,
  restingTransform,
  restRange,
  transformForResize,
} from './zoomStage'

/** 手指或鼠标拖动放大后的照片时，舞台上带这个属性。 */
export const ZOOM_DRAGGING_ATTRIBUTE = 'data-zoom-dragging'

/** 拖动起手的屏幕方向。 */
export type PanDirection = 'left' | 'right'

export interface ZoomCoreOptions {
  /** 舞台：照片在里面适应并居中，超出部分裁掉。 */
  readonly stage: () => HTMLElement | null
  /** 手势挂载、尺寸观察的元素：默认是舞台，图集里是页面轨道。 */
  readonly surface?: () => HTMLElement | null
  /** 能缩放（`hasZoom` 的图片项）。 */
  readonly isEnabled: () => boolean
  /** 换了一项时变化：照片回到适应大小。 */
  readonly itemKey: () => unknown
  /** 照片放大了，或回到了适应大小。 */
  readonly onZoomedChange: (isZoomed: boolean) => void
}

/** 灯箱调用的部分：照片的 ref，以及键盘和鼠标双击的缩放。 */
export interface ZoomStage {
  /** 绑定被移动、缩放的照片元素。 */
  readonly contentRef: (element: unknown) => void
  isZoomed: () => boolean
  /** 键盘：以舞台中心放大 2 倍，已放大时还原。 */
  toggle: () => void
  zoomIn: () => void
  zoomOut: () => void
  /** 键盘：把放大的照片平移 (dx, dy) px，留在舞台里。 */
  panBy: (dx: number, dy: number) => void
  /** 鼠标或触控笔在某个客户区坐标双击：按点放大 2 倍，已放大时还原。 */
  doubleClickAt: (clientX: number, clientY: number) => void
  /** 放大的照片朝 `direction` 拖已经拖不动了（那一侧的边已经贴住舞台边），外层翻页器接手。 */
  isAtEdge: (direction: PanDirection) => boolean
}

export interface SettleOptions {
  /** 手指松手：减少动效时就地淡入淡出。 */
  readonly touchRelease?: boolean
  /** 捏合松手时照片每秒的缩放变化，弹簧从这个速度起步。 */
  readonly scaleVelocity?: number
}

/** 手势层（useZoomStage.ts）驱动的内核。 */
export interface ZoomCore {
  readonly api: ZoomStage
  readonly animator: Animator
  readonly options: ZoomCoreOptions
  /** 最近一次测量的几何（测量之前是 null）。 */
  geometry: () => ZoomGeometry | null
  /** 照片要去的地方：最后写入的值或弹簧的终点。 */
  target: () => ZoomTransform
  zoomed: () => boolean
  /** 读舞台和照片的尺寸：只在一步开始时读布局。 */
  measure: () => ZoomGeometry | null
  /** 客户区 px 转舞台 px（按最近一次测量）。 */
  toStage: (point: StagePoint) => StagePoint
  /** 照片现在显示在哪（呈现值）。 */
  current: () => ZoomTransform
  /** 立刻把照片显示在 `transform`。 */
  write: (transform: ZoomTransform) => void
  /** 不是内核发起的动画结束在这里时，更新「要去的地方」。 */
  setTarget: (transform: ZoomTransform) => void
  setZoomed: (next: boolean) => void
  /** 照片在动（显示位置离要去的地方还有距离）。 */
  isMoving: () => boolean
  isAtEdgeOf: (geometry: ZoomGeometry, direction: PanDirection) => boolean
  /**
   * 落在 `springs.settle` 上：越界松手、双击、鼠标双击、键盘缩放和平移。灯箱的主要交互是手势，
   * 所有缩放都用这一根弹簧。捏合松手从 `scaleVelocity` 起步，其余从静止起步。
   * 减少动效时按动画器的默认处理：触屏或手指松手就地淡入淡出，其余直接到位。
   */
  settleTo: (geometry: ZoomGeometry, target: ZoomTransform, options?: SettleOptions) => void
}

/**
 * 灯箱的缩放舞台。每一步都在合成器上播放烘焙好的关键帧，一步开始后不再读布局。
 * 键盘的一步从「要去的地方」接着走，所以弹簧途中连按会累加。Vue 只听到离散的状态变化。
 */
export function createZoomCore(options: ZoomCoreOptions): ZoomCore {
  const animator = createMotionEngine(null)
  let content: HTMLElement | null = null
  let geometry: ZoomGeometry | null = null
  // 最近一次测量时舞台左上角的客户区坐标。
  let origin: StagePoint = { x: 0, y: 0 }
  let zoomed = false
  let target: ZoomTransform = IDENTITY

  const contentRef = (element: unknown): void => {
    const next = element instanceof HTMLElement ? element : null
    if (next === content)
      return
    content = next
    animator.attach(next)
  }

  // 只在手势或键盘缩放开始时读布局。尺寸不取整读（取整误差会被深度放大成倍放大）：
  // 舞台的盒子和照片实际用到的尺寸。舞台让照片居中，所以适应盒子由这两者算出。
  const measure = (): ZoomGeometry | null => {
    const stage = options.stage()
    const view = stage?.ownerDocument.defaultView
    if (stage == null || content == null || view == null)
      return null
    const rect = stage.getBoundingClientRect()
    const width = rect.width > 0 ? rect.width : stage.clientWidth
    const height = rect.height > 0 ? rect.height : stage.clientHeight
    const used = view.getComputedStyle(content)
    const fitWidth = Number.parseFloat(used.width) || content.offsetWidth
    const fitHeight = Number.parseFloat(used.height) || content.offsetHeight
    if (!(width > 0 && height > 0 && fitWidth > 0 && fitHeight > 0))
      return null
    origin = { x: rect.left + stage.clientLeft, y: rect.top + stage.clientTop }
    // 按标签名判断而不是 instanceof：渲染到别的窗口里的元素属于那个窗口的类。
    const naturalWidth = content.tagName === 'IMG' ? (content as HTMLImageElement).naturalWidth : 0
    const natural = naturalWidth > 0 ? naturalWidth : fitWidth
    const doubleTapScale = doubleTapScaleFor(width, height, fitWidth, fitHeight)
    geometry = {
      width,
      height,
      fit: { x: (width - fitWidth) / 2, y: (height - fitHeight) / 2, width: fitWidth, height: fitHeight },
      minScale: 1,
      maxScale: maxScaleFor(natural, fitWidth, view.devicePixelRatio || 1, doubleTapScale),
      doubleTapScale,
    }
    return geometry
  }

  const toStage = (point: StagePoint): StagePoint => ({ x: point.x - origin.x, y: point.y - origin.y })

  const current = (): ZoomTransform => ({
    x: animator.get('x'),
    y: animator.get('y'),
    scale: animator.get('scale'),
  })

  const write = (transform: ZoomTransform): void => {
    target = transform
    animator.set({ x: transform.x, y: transform.y, scale: transform.scale })
  }

  const setTarget = (transform: ZoomTransform): void => {
    target = transform
  }

  const isMoving = (): boolean => {
    const shown = current()
    return Math.abs(shown.x - target.x) > 0.01
      || Math.abs(shown.y - target.y) > 0.01
      || Math.abs(shown.scale - target.scale) > 0.0001
  }

  const isAtEdgeOf = (at: ZoomGeometry, direction: PanDirection): boolean => {
    const range = restRange(at, target.scale)
    return direction === 'left' ? target.x <= range.x.min + 0.5 : target.x >= range.x.max - 0.5
  }

  const setZoomed = (next: boolean): void => {
    if (zoomed !== next) {
      zoomed = next
      options.onZoomedChange(next)
    }
  }

  const settleTo = (at: ZoomGeometry, to: ZoomTransform, { touchRelease = false, scaleVelocity = 0 }: SettleOptions = {}): void => {
    const from = current()
    animator.stop()
    // 减少动效的淡入淡出在半路停下会让照片一直发暗（下一次淡出回到被冻结的不透明度），
    // 所以每次落位都从完全不透明开始，也在完全不透明结束。
    if (animator.get('opacity') !== 1)
      animator.set({ opacity: 1 })
    target = to
    setZoomed(isZoomed(at, to))
    if (from.x === to.x && from.y === to.y && from.scale === to.scale)
      return
    registerReducedMotionCrossFade()
    // 捏合松手时从照片的缩放速度起步；偏移按同样的比例起步，手指捏住的点保持不动。
    const span = to.scale - from.scale
    const rate = Number.isFinite(scaleVelocity) && span !== 0 ? scaleVelocity / span : 0
    animator.animate(
      { x: to.x, y: to.y, scale: to.scale },
      {
        spring: resolveMotion(options.stage(), springs.settle),
        velocity: { x: (to.x - from.x) * rate, y: (to.y - from.y) * rate, scale: span * rate },
      },
      { touchRelease },
    )
  }

  // 换了一项：画出来之前回到适应大小。
  watch(options.itemKey, () => {
    animator.stop()
    animator.set({ x: 0, y: 0, scale: 1, opacity: 1 })
    target = IDENTITY
    zoomed = false
    geometry = null
  }, { flush: 'pre' })

  // 旋转或改变窗口大小：同一个照片点留在中心，屏幕上的大小不变。观察的是表面：
  // 图集里舞台会换到每个当前页，而轨道（每页都和它一样大）一直在。
  const onResize = (): void => {
    const before = geometry
    if (before == null || !zoomed)
      return
    const after = measure()
    if (after == null)
      return
    animator.stop()
    const next = transformForResize(before, after, target)
    write(next)
    setZoomed(isZoomed(after, next))
  }
  useAttachment(
    () => (options.surface ?? options.stage)(),
    surface => options.isEnabled() ? observeResize(surface, onResize) : () => {},
    options.isEnabled,
  )

  // 键盘按「要去的地方」算，和 UIKit 的模型值一样：弹簧途中再按一下，从那段弹簧的终点接着走。
  const zoomIn = (): void => {
    const at = measure()
    if (at == null || zoomed)
      return
    settleTo(at, releasedZoomTarget(at, target))
  }
  const zoomOut = (): void => {
    const at = measure()
    if (at == null || !zoomed)
      return
    settleTo(at, restingTransform(at, { ...IDENTITY, scale: at.minScale }))
  }

  const api: ZoomStage = {
    contentRef,
    isZoomed: () => zoomed,
    toggle: () => (zoomed ? zoomOut() : zoomIn()),
    zoomIn,
    zoomOut,
    panBy: (dx, dy) => {
      const at = measure()
      if (at == null || !zoomed)
        return
      settleTo(at, pannedBy(at, target, dx, dy))
    },
    doubleClickAt: (clientX, clientY) => {
      const at = measure()
      if (at == null)
        return
      settleTo(at, doubleClickTarget(at, current(), toStage({ x: clientX, y: clientY })))
    },
    isAtEdge: (direction) => {
      const at = geometry ?? measure()
      if (at == null || !zoomed)
        return true
      return isAtEdgeOf(at, direction)
    },
  }

  return {
    api,
    animator,
    options,
    geometry: () => geometry,
    target: () => target,
    zoomed: () => zoomed,
    measure,
    toStage,
    current,
    write,
    setTarget,
    setZoomed,
    isMoving,
    isAtEdgeOf,
    settleTo,
  }
}
