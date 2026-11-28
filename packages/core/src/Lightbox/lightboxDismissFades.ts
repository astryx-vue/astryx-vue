/**
 * @file lightboxDismissFades.ts
 * @input 灯箱的 dialog、容器和当前页的图注区域
 * @output createDismissFades：下拉关闭时背景、控件、相邻照片和图注跟着位移变淡，松手后跟着照片的弹簧
 *   一起走；灯箱再次打开时全部复原
 * @position Lightbox 内部；数值在 zoomDismiss.ts（照片 App 实测），手势在 zoomDismissGesture.ts。
 */

import type { Animator } from '../motion/animator'
import type { ZoomDismissOptions } from './zoomDismissGesture'
import { animatorFor } from '../motion/animator'
import { resolveMotion } from '../motion/resolveMotion'
import { springs } from '../motion/uikit/springs'
import { zoomMedia } from '../motion/uikit/zoomMedia'
import { dismissBackdropAlpha, dismissChromeAlpha } from './zoomDismiss'

export interface DismissFadeTargets {
  readonly dialog: () => HTMLElement | null
  readonly container: () => HTMLElement | null
  /** 当前页的图注区域：它带着自己的底色，和控件一起变淡。 */
  readonly captionBand: () => HTMLElement | null
  /** 当前页的照片盒子：取消时的 settle 弹簧按它读。 */
  readonly stage: () => HTMLElement | null
}

export interface DismissFades {
  readonly onDrag: ZoomDismissOptions['onDrag']
  readonly onRelease: ZoomDismissOptions['onRelease']
  /** 背景、控件、图注都回到完全不透明，背景的模糊回来。 */
  readonly restore: () => void
}

/** 控件层、相邻页、图注都跟着变淡；在相邻页里面的、在图注区域里面的跟着外层一起淡。 */
const CHROME_SELECTOR = '[data-lightbox-chrome], [data-lightbox-page]:not([data-current]), [data-lightbox-caption]'

export function createDismissFades(targets: DismissFadeTargets): DismissFades {
  let faded: Animator[] = []
  // 背景每动一次加一，只有最后一次动完才把模糊还回去。
  let backdropMoves = 0

  // 拖动和松手时整屏的模糊每帧重绘会掉帧，背景动的时候先关掉模糊。
  const setBackdropMoving = (moving: boolean): void => {
    const dialog = targets.dialog()
    if (moving)
      dialog?.style.setProperty('--_lightbox-backdrop-filter', 'none')
    else
      dialog?.style.removeProperty('--_lightbox-backdrop-filter')
  }

  const collect = (): { backdrop: Animator | null, chrome: Animator[] } => {
    const dialog = targets.dialog()
    const container = targets.container()
    if (dialog == null || container == null)
      return { backdrop: null, chrome: [] }
    const band = targets.captionBand()
    const elements: HTMLElement[] = band == null ? [] : [band]
    for (const element of container.querySelectorAll<HTMLElement>(CHROME_SELECTOR)) {
      const insideNeighbour = element.parentElement?.closest('[data-lightbox-page]:not([data-current])') != null
      if (!insideNeighbour && band?.contains(element) !== true)
        elements.push(element)
    }
    const backdrop = animatorFor(dialog, { pseudoElement: '::backdrop' })
    const chrome = elements.map(element => animatorFor(element))
    faded = [backdrop, ...chrome]
    return { backdrop, chrome }
  }

  return {
    onDrag: (travel) => {
      const { backdrop, chrome } = collect()
      backdropMoves += 1
      setBackdropMoving(true)
      backdrop?.set({ opacity: dismissBackdropAlpha(travel) })
      const opacity = dismissChromeAlpha(travel)
      for (const animator of chrome)
        animator.set({ opacity })
    },
    onRelease: (dismisses, touch) => {
      const { backdrop, chrome } = collect()
      // 跟着照片走：关闭用照片 App 实测的大小弹簧，取消用共用的 settle 弹簧（按舞台读）。
      const spring = dismisses ? zoomMedia.dismiss.dismissSizeSpring : resolveMotion(targets.stage(), springs.settle)
      const opacity = dismisses ? 0 : 1
      const move = (backdropMoves += 1)
      setBackdropMoving(true)
      const backdropMotion = backdrop?.animate({ opacity }, { spring }, { touchRelease: touch })
      for (const animator of chrome)
        animator.animate({ opacity }, { spring }, { touchRelease: touch })
      // 回到静止：模糊回来，除非背景又动了。
      void backdropMotion?.finished.then(() => {
        if (!dismisses && backdropMoves === move)
          setBackdropMoving(false)
      })
    },
    restore: () => {
      backdropMoves += 1
      setBackdropMoving(false)
      const previous = faded
      faded = []
      for (const animator of previous)
        animator.set({ opacity: 1 })
    },
  }
}
