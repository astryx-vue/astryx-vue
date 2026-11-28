/**
 * Popover 打开和开始关闭时要做的调用（上游 Popover/usePopoverSurfaceMotion.ts）。
 *
 * 打开那一刻判断：主指针是粗指针（手指）时，浮层从触发器长出；开始关闭时缩回去。
 * 细指针（鼠标）保留浮层自己的 CSS 进场，这里什么都不建。是不是触屏呈现从打开
 * 保持到开始关闭（layer/presentationHold.ts），中途换了指针也按打开时的走。
 */
import type { PopoverSurfaceMotion } from './popoverSurfaceMotion.js'
import { onBeforeUnmount } from 'vue'
import { createPresentationHold } from '../layer/presentationHold.js'
import { isCoarsePointer } from '../utils/coarsePointer.js'
import { createPopoverSurfaceMotion } from './popoverSurfaceMotion.js'

function boxOf(element: Element): { left: number, top: number, width: number, height: number } {
  const { left, top, width, height } = element.getBoundingClientRect()
  return { left, top, width, height }
}

export interface PopoverSurfaceMotionCalls {
  /** 浮层刚打开、还没画出来时调用。 */
  present: (layer: HTMLElement | null, source: HTMLElement | null) => void
  /** 浮层开始关闭、还显示着时调用。 */
  closeStart: () => void
}

export function usePopoverSurfaceMotion(): PopoverSurfaceMotionCalls {
  let current: { element: HTMLElement, motion: PopoverSurfaceMotion } | null = null
  const touchHold = createPresentationHold<boolean>()

  const release = (): void => {
    current?.motion.dispose()
    current = null
  }

  const motionFor = (element: HTMLElement): PopoverSurfaceMotion => {
    if (current?.element === element)
      return current.motion
    release()
    current = { element, motion: createPopoverSurfaceMotion(element) }
    return current.motion
  }

  // 卸载时放掉合成器上的动画和还在屏幕上的退场副本。
  onBeforeUnmount(release)

  return {
    present(layer, source) {
      if (layer == null)
        return
      const isTouch = source != null && isCoarsePointer(layer.ownerDocument.defaultView)
      touchHold.take(isTouch)
      if (!isTouch || source == null) {
        // 鼠标呈现什么都不播，也不留合成层；之前的触屏动效一并放掉。
        release()
        return
      }
      motionFor(layer).enter(() => ({ surface: boxOf(layer), source: boxOf(source) }))
    },
    closeStart() {
      if (touchHold.current() === true)
        current?.motion.exit()
      touchHold.release()
    },
  }
}
