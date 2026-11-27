/**
 * @file useLightboxStage.ts
 * @input 灯箱的各个元素（dialog、容器、视口、轨道、当前页的照片盒子和图注区域）、灯箱状态、关闭和翻页回调
 * @output useLightboxStage：把缩放舞台、下拉关闭、图集翻页和手指点空白关闭接到灯箱上
 * @position Lightbox.vue 的手势层。缩放在 zoomCore.ts / useZoomStage.ts，翻页在 lightboxPager.ts，
 *   下拉时的变淡在 lightboxDismissFades.ts。
 */

import type { GestureTouch, Point } from '../gestures/types'
import type { LightboxPager } from './lightboxPager'
import type { ZoomStageWithTouch } from './useZoomStage'
import { nextTick, watch } from 'vue'
import { TapGestureRecognizer } from '../gestures/TapGestureRecognizer'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'
import { zoomMedia } from '../motion/uikit/zoomMedia'
import { createDismissFades } from './lightboxDismissFades'
import { useLightboxPager } from './lightboxPager'
import { useZoomStage } from './useZoomStage'
import { createZoomCore } from './zoomCore'

/** 视频原生控件在底边的这一条里（浏览器不给控件的几何）。从这里起的拖动归视频。 */
const VIDEO_CONTROLS_BAND = 48

export interface LightboxStageElements {
  readonly dialog: () => HTMLElement | null
  readonly container: () => HTMLElement | null
  /** 翻页器的视口，也是手指点空白关闭的表面。 */
  readonly viewport: () => HTMLElement | null
  /** 页面轨道：缩放手势挂在这里。 */
  readonly track: () => HTMLElement | null
  /** 当前页的照片盒子：缩放舞台。 */
  readonly stage: () => HTMLElement | null
  readonly captionBand: () => HTMLElement | null
}

export interface LightboxStageOptions extends LightboxStageElements {
  readonly isOpen: () => boolean
  /** 能缩放：`hasZoom` 且当前项是图片。 */
  readonly isZoomTarget: () => boolean
  readonly isVideo: () => boolean
  readonly isGallery: () => boolean
  /** 触屏呈现（主指针是粗指针）。 */
  readonly isTouch: () => boolean
  readonly index: () => number
  readonly count: () => number
  /** 换了一项时变化。 */
  readonly itemKey: () => unknown
  readonly close: () => void
  /** 拖着翻到了另一页。 */
  readonly onSwipe: (index: number) => void
  readonly onZoomedChange: (isZoomed: boolean) => void
  /** 放大后的平移或下拉开始了：之后松开的点击不关闭。 */
  readonly onDragStart: () => void
}

export interface LightboxStage {
  readonly zoom: ZoomStageWithTouch
  readonly pager: LightboxPager
}

function within(rect: DOMRect | undefined, { x, y }: Point): boolean {
  return rect != null && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

/** 有尺寸的元素的盒子；还没尺寸（照片在加载）的不算。 */
function sized(element: Element | null | undefined): DOMRect | null {
  const rect = element?.getBoundingClientRect()
  return rect != null && rect.width > 0 && rect.height > 0 ? rect : null
}

export function useLightboxStage(options: LightboxStageOptions): LightboxStage {
  const currentPage = (): Element | null => options.track()?.querySelector('[data-current]') ?? null
  const zoomEnabled = (): boolean => options.isOpen() && options.isZoomTarget()

  const core = createZoomCore({
    stage: options.stage,
    surface: options.track,
    isEnabled: zoomEnabled,
    itemKey: options.itemKey,
    onZoomedChange: options.onZoomedChange,
  })
  const fades = createDismissFades(options)

  // 落在图注上的捏合归页面自己的缩放。
  const startsOnCaption = (touch: GestureTouch | undefined): boolean => {
    const target = touch?.target
    return target instanceof Element && target.closest('[data-lightbox-caption]') != null
  }

  const zoom = useZoomStage(core, {
    isEnabled: zoomEnabled,
    // 舞台和周围的页面共用表面：点在那里和点遮罩一样关闭，点在图注上除外。
    onTapOutside: (point) => {
      const caption = currentPage()?.querySelector('[data-lightbox-caption]')?.getBoundingClientRect()
      if (!within(caption, point))
        options.close()
    },
    onDragStart: options.onDragStart,
    isTouchPresentation: options.isTouch,
    // 只有图集的触屏翻页器接手越过放大照片边缘的拖动。
    hasOuterPager: () => options.isGallery() && options.isTouch(),
    shouldBeginPinch: recognizer => !startsOnCaption(recognizer.trackedTouches[0]),
    dismiss: {
      // 属于触屏呈现；精细指针下拖动不动照片。视频保留自己控件上的拖动。
      isEnabled: () => options.isOpen() && !options.isVideo() && options.isTouch(),
      onDrag: fades.onDrag,
      onRelease: fades.onRelease,
      onDismissed: () => {
        options.close()
        // 关不关由调用方决定：它让灯箱继续开着时，把照片、背景和控件还回来，不留一个看不见的对话框。
        void nextTick(() => {
          if (options.isOpen())
            restore()
        })
      },
    },
  })

  // 只在灯箱打开（或关闭被拒绝）时复原：每次写入都会提升图层，手势途中再释放会重绘。
  function restore(): void {
    zoom.reset()
    fades.restore()
  }
  watch(options.isOpen, (open) => {
    if (open)
      restore()
  }, { flush: 'pre' })

  // 视频的原生控件当成底边的一条。从那里起的拖动（进度条、音量）归视频。
  const startsOnVideoControls = (touch: GestureTouch | undefined): boolean => {
    const video = currentPage()?.querySelector('video[controls]')
    if (touch == null || video == null)
      return false
    const box = video.getBoundingClientRect()
    return touch.startX >= box.left && touch.startX <= box.right
      && touch.startY <= box.bottom && touch.startY >= box.bottom - VIDEO_CONTROLS_BAND
  }

  // 图集像照片 App 一样翻页：一次拖动或轻扫最多一页，页距 40pt。放大的照片拖到边之后，下一下交给翻页器。
  // 翻页器停稳后，留在身后的照片回到适应大小。
  const pager = useLightboxPager({
    viewport: options.viewport,
    // 单张照片没有可翻的页，不挂翻页器。
    track: () => (options.isGallery() ? options.track() : null),
    count: options.count,
    gap: zoomMedia.viewer.pageGap,
    index: options.index,
    // 拖着翻页属于触屏呈现。精细指针下用按钮和方向键翻页。
    isPanEnabled: () => options.isOpen() && options.isGallery() && options.isTouch(),
    // 触屏呈现下换页滑过去，被拒绝的拖动弹回；精细指针下直接到位。
    isControlledChangeAnimated: options.isTouch,
    panShouldBegin: pan => !startsOnVideoControls(pan.trackedTouches[0]),
    shouldBeginPan: direction => !zoom.isZoomed() || zoom.isAtEdge(direction),
    onIndexChange: options.onSwipe,
    // 翻页器报的是它停住的那一页；报告可能比标出当前页的渲染还早，所以按页决定，不按标记。
    onSettle: (settled) => {
      for (const page of options.track()?.querySelectorAll<HTMLElement>(':scope > [data-lightbox-page]') ?? []) {
        const img = page.querySelector<HTMLElement>('img')
        if (img != null && page.dataset.lightboxPage !== String(settled)) {
          img.style.translate = ''
          img.style.scale = ''
        }
      }
    },
  })

  // 一个点是否在当前页的媒体上：图注自己的盒子里，或照片（视频）所在的行里、两者合起来的宽度内。
  const isOnCurrentMedia = (point: Point): boolean => {
    const page = currentPage()
    const media = sized(page?.querySelector('img')) ?? sized(page?.querySelector('video'))
    const caption = sized(page?.querySelector('[data-lightbox-caption]'))
    const boxes = [media, caption].filter((rect): rect is DOMRect => rect != null)
    const inRows = (rect: DOMRect | null): boolean => rect != null && point.y >= rect.top && point.y <= rect.bottom
    return (inRows(caption) && caption != null && point.x >= caption.left && point.x <= caption.right)
      || (inRows(media) && point.x >= Math.min(...boxes.map(r => r.left)) && point.x <= Math.max(...boxes.map(r => r.right)))
  }
  // 不能缩放时舞台铺满灯箱：手指点在媒体旁边就关闭，和点遮罩一样。能缩放时由舞台自己的单击负责。
  useGestureRecognizer(
    options.viewport,
    () => new TapGestureRecognizer({ name: 'lightbox-backdrop-tap', allowedPointerTypes: ['touch'] }),
    (tap) => {
      if (tap.state === 'ended' && !isOnCurrentMedia(tap.location()))
        options.close()
    },
    { isEnabled: () => options.isOpen() && !options.isZoomTarget(), manageStyle: false },
  )

  return { zoom, pager }
}
