/**
 * @file progressBarMotion.ts
 * @input 已填份额（0–100）、条上有没有刻度标记、轨道元素
 * @output useProgressBarTouch：触屏下填充的行程变量（移动时长、曲线、回程偏移、最短长度）
 *   和填充实际画出的份额；reducedMotionPulseVars：减少动态效果下不确定进度条的呼吸变量
 * @position ProgressBar 的动效层，只给 ProgressBar.vue 用，数值取自 motion/uikit/progressBar
 */

import type { ComputedRef, Ref } from 'vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { resolveMotion } from '../motion/resolveMotion.js'
import { formatMotionRoleValue } from '../motion/roles.js'
import { progressBar } from '../motion/uikit/progressBar.js'
import { timing } from '../motion/uikit/timing.js'

/** 轨道高度（和 progress-bar.css 的默认高度一致）。 */
const TRACK_HEIGHT_PX = 8

/** 手指下填充在大于 0 时不短于这个长度：UIProgressView 的两倍轨道高度。 */
export const TOUCH_MIN_FILL_PX = progressBar.progressView.minimumFillHeights * TRACK_HEIGHT_PX

export interface ProgressBarTouch {
  /** 填充的触屏行程变量，行内写在填充上。 */
  fillVars: ComputedRef<Record<string, string>>
  /** 填充实际画出的份额（0–100），用来判断刻度标记落在填充上还是轨道上。 */
  drawnPercentage: ComputedRef<number>
}

/**
 * 手指下的数值变化按 UIProgressView 的 setProgress(_:animated:) 走：线性，
 * 时长是整条轨道的时长乘以这次移动的份额，从填充当前画出的位置起步。
 * 变化份额停在下一次变化之前，所以同值重渲染不会改它。
 * `flip` 在 0、1、2 之间轮转：它把填充错开百分之一像素，让「回到刚离开的值」
 * 不会被 CSS 当成正在进行的过渡的起点而缩短。
 */
export function useProgressBarTouch(
  percentage: Ref<number> | ComputedRef<number>,
  hasMarks: Ref<boolean> | ComputedRef<boolean>,
  coarse: Ref<boolean> | ComputedRef<boolean>,
  track: Ref<HTMLElement | null>,
): ProgressBarTouch {
  const change = ref(0)
  const flip = ref(0)
  watch(percentage, (next, previous) => {
    change.value = Math.abs(next - previous) / 100
    flip.value = (flip.value + 1) % 3
  }, { flush: 'sync' })

  // 手指下填充至少画 TOUCH_MIN_FILL_PX 长，它盖住的刻度标记算在填充上。
  // 这个长度是轨道宽度的份额，只有布局知道，所以只在手指下且有刻度标记时量轨道。
  const trackWidth = ref(0)
  let observer: ResizeObserver | undefined
  function stop(): void {
    observer?.disconnect()
    observer = undefined
  }
  watch(
    () => [coarse.value && hasMarks.value, track.value] as const,
    ([watches, element]) => {
      stop()
      if (!watches || element == null || typeof ResizeObserver === 'undefined')
        return
      trackWidth.value = element.getBoundingClientRect().width
      observer = new ResizeObserver((entries) => {
        trackWidth.value = entries[0]?.contentRect.width ?? element.getBoundingClientRect().width
      })
      observer.observe(element)
    },
    { flush: 'post', immediate: true },
  )
  onBeforeUnmount(stop)

  const drawnPercentage = computed(() => {
    if (!coarse.value || !hasMarks.value || percentage.value <= 0 || trackWidth.value <= 0)
      return percentage.value
    return Math.max(percentage.value, (TOUCH_MIN_FILL_PX / trackWidth.value) * 100)
  })

  const fillVars = computed(() => {
    const fillTrackMs = resolveMotion(null, progressBar, 'fillTrackMs')
    const curve = resolveMotion(null, progressBar.curves.fill)
    return {
      '--_progress-bar-move': `${Math.round(change.value * fillTrackMs * 1000) / 1000}ms`,
      '--_progress-bar-curve': formatMotionRoleValue('curve', curve),
      '--_progress-bar-flip': String(flip.value),
      '--_progress-bar-min': `${TOUCH_MIN_FILL_PX}px`,
    }
  })

  return { fillVars, drawnPercentage }
}

/**
 * 减少动态效果下，不确定进度条的填充不再滑动，铺满轨道只让不透明度呼吸：
 * 每一程取 `progress.reducedMotionPulseMs`，走 `timing.curves.move` 曲线，降到下限再回来。
 * 这是个忙等循环，主题节奏不缩放它。
 */
export function reducedMotionPulseVars(): Record<string, string> {
  const pulseMs = resolveMotion(null, progressBar, 'reducedMotionPulseMs')
  const curve = resolveMotion(null, timing.curves.move)
  return {
    '--_progress-bar-pulse': `${pulseMs}ms`,
    '--_progress-bar-pulse-curve': formatMotionRoleValue('curve', curve),
    '--_progress-bar-pulse-floor': String(progressBar.reducedMotionPulseFloor),
  }
}
