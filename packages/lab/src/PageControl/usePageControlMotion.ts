/**
 * @file usePageControlMotion.ts
 * @input 控件的元素、页码状态和刚要过的请求；core 的动效引擎和减少动态效果规则
 * @output usePageControlMotion：按住的样子、指示点的淡出、窗口的滑动，以及鼠标下被裁的整排
 * @position PageControl 的动效层。窗口滑动和淡出是触屏呈现，只在 `isTouch` 时开着。
 */

import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { PageRequests } from './pageControlRequest'
import { animatorFor, isRtlElement, reducedMotionFade } from '@astryx-vue/core/internal/touch'
import { onMounted, onScopeDispose, shallowRef, watch } from 'vue'
import { BOX, croppedRowOffset, fadeOf, indicatorSize, PITCH, renderedPages, SWITCH } from './pageControlModel'
import { pageControl as PC } from './pageControlTable'

/** 10px 的盒子缩到 9.67px 的指示点（见 BOX）。 */
export const DOT_SCALE = PC.indicatorSize / BOX

export interface PageControlMotionInput {
  isTouch: Readonly<Ref<boolean>>
  root: Readonly<ShallowRef<HTMLElement | null>>
  strip: Readonly<ShallowRef<HTMLElement | null>>
  pages: ComputedRef<number>
  current: ComputedRef<number>
  windowStart: ComputedRef<number>
  isScrubbing: Readonly<Ref<boolean>>
  requests: PageRequests
}

export interface PageControlMotion {
  /** 按住的样子：垫片显示、其余点变暗。 */
  isInteracting: Readonly<Ref<boolean>>
  /**
   * 盖过默认切换的不透明度过渡，null 时用默认。减少动态效果下按住的样子立刻出现（none）、
   * 松手时按规则淡出；页码一变，点立刻换，垫片的淡出不受影响。
   */
  platterTransition: Readonly<Ref<string | null>>
  dotTransition: Readonly<Ref<string | null>>
  showHeld: () => void
  hideHeld: () => void
}

/** 减少动态效果下按住的样子松手时的淡出：粗指针 200ms，其他指针没有。动效正常时是 null。 */
function reducedFadeOf(root: Element): string | null {
  const fade = reducedMotionFade(root)
  if (fade == null)
    return null
  return fade.duration === 0 ? 'none' : `opacity ${fade.duration / 1000}s ${fade.easing}`
}

export function usePageControlMotion(input: PageControlMotionInput): PageControlMotion {
  const { isTouch, root, strip, pages, current, windowStart, requests } = input
  const view = (): Window => root.value?.ownerDocument.defaultView ?? window
  const isInteracting = shallowRef(false)
  const platterTransition = shallowRef<string | null>(null)
  const dotTransition = shallowRef<string | null>(null)
  /** 按住的样子（垫片和其余点变暗）一起换过渡。 */
  const setHeldTransition = (value: string): void => {
    platterTransition.value = value
    dotTransition.value = value
  }
  const dots = (): HTMLElement[] => Array.from(strip.value?.children ?? []) as HTMLElement[]
  const pageOf = (dot: HTMLElement): number => Number(dot.dataset.page)

  function showHeld(): void {
    const el = root.value
    if (!isTouch.value || el == null)
      return
    if (reducedFadeOf(el) != null)
      setHeldTransition('none')
    isInteracting.value = true
  }

  function hideHeld(): void {
    const el = root.value
    if (isTouch.value && el != null) {
      const reduced = reducedFadeOf(el)
      if (reduced != null)
        setHeldTransition(reduced)
    }
    isInteracting.value = false
  }

  // 鼠标下：被裁的整排，每页都是原尺寸，立刻挪到让当前点留在视野里。拖动时按点原地的位置
  // 换页，所以松手前这排不动。
  function syncCroppedRow(): void {
    const el = root.value
    const row = strip.value
    if (isTouch.value || input.isScrubbing.value || row == null || el == null)
      return
    animatorFor(row).set({ x: (isRtlElement(el) ? 1 : -1) * croppedRowOffset(pages.value, current.value) })
    for (const dot of dots())
      animatorFor(dot).set({ scale: DOT_SCALE })
  }

  // 页码变了：旧的当前点淡出，点按要的淡得更快；其余的不透明度变化都是切换。减少动态效果下
  // 高亮是选中色，立刻换。
  let shownPage = current.value
  function syncFade(): void {
    const old = shownPage
    shownPage = current.value
    if (old === current.value)
      return
    const pending = requests.pending
    const kind = pending?.page === current.value ? pending.kind : 'other'
    // 清掉：之后 app 自己改的页按「其他」淡出。
    requests.pending = null
    const el = root.value
    if (!isTouch.value || el == null)
      return
    if (reducedMotionFade(el) != null) {
      dotTransition.value = 'none'
      return
    }
    dotTransition.value = null
    const fading = dots().find(dot => pageOf(dot) === old)
    if (fading == null)
      return
    fading.style.transition = fadeOf(kind === 'tap' ? PC.tapFadeOutMs : PC.fadeOutMs, PC.fadeOutCurve)
    // 读一次样式，淡出按上面写的时长开始。进行中的过渡保留自己的时长，所以这个点下一次变化
    // 马上又是切换。隐藏的控件不开始淡出。
    void getComputedStyle(fading).opacity
    fading.style.transition = SWITCH
  }

  // 每个元素的动效引擎跟着窗口：条的偏移和每个点的尺寸。
  let shown: { windowStart: number, pages: number } | null = null
  let resizeTimer = 0
  function syncWindow(): void {
    view().clearTimeout(resizeTimer)
    const row = strip.value
    const el = root.value
    if (row == null || el == null)
      return
    if (!isTouch.value) {
      shown = null
      return
    }
    const start = windowStart.value
    const count = pages.value
    const isRtl = isRtlElement(el)
    const offsetFor = (from: number): number => (isRtl ? 1 : -1) * from * PITCH
    const scaleFor = (from: number, page: number): number => indicatorSize(count, from, page) / BOX
    const before = shown
    shown = { windowStart: start, pages: count }
    if (before == null || before.pages !== count || before.windowStart === start) {
      animatorFor(row).set({ x: offsetFor(start) })
      for (const dot of dots())
        animatorFor(dot).set({ scale: scaleFor(start, pageOf(dot)) })
      return
    }
    // 刚挂上的点从它在旧窗口里的尺寸开始。
    const [wasFirst, wasLast] = renderedPages(count, before.windowStart)
    for (const dot of dots()) {
      const page = pageOf(dot)
      if (page < wasFirst || page >= wasLast)
        animatorFor(dot).set({ scale: scaleFor(before.windowStart, page) })
    }
    // 窗口变化 50ms 后开始滑。条和每个点在文档时间线上共用一个开始时刻，主线程忙也推不迟。
    const at = performance.now() + PC.windowSlideDelayMs
    const transition = { spring: PC.windowSlide }
    const stripAnimator = animatorFor(row)
    stripAnimator.animate({ x: offsetFor(start) }, transition, { at })
    if (stripAnimator.reducedMotion() === 'off') {
      for (const dot of dots())
        animatorFor(dot).animate({ scale: scaleFor(start, pageOf(dot)) }, transition, { at })
      return
    }
    // 减少动态效果下条的交叉淡化承担整个变化：点在它最透明的中点换成新尺寸，
    // 自己再淡一次会和页码的不透明度打架。
    const half = (reducedMotionFade(el)?.duration ?? 0) / 2
    const resized = dots()
    resizeTimer = view().setTimeout(() => {
      for (const dot of resized)
        animatorFor(dot).set({ scale: scaleFor(start, pageOf(dot)) })
    }, PC.windowSlideDelayMs + half)
  }

  // 顺序要紧：淡出先于窗口，窗口那边的样式读取会让过渡从旧值开始。
  onMounted(() => {
    syncCroppedRow()
    syncWindow()
  })
  watch([isTouch, input.isScrubbing, pages, current], syncCroppedRow, { flush: 'post' })
  watch(current, syncFade, { flush: 'post' })
  watch([windowStart, pages, isTouch], syncWindow, { flush: 'post' })
  // 控件藏起来（页数变成 0）时忘掉旧窗口，卸载时停下等着的换尺寸。
  watch(root, (el) => {
    if (el == null) {
      view().clearTimeout(resizeTimer)
      shown = null
    }
  })
  onScopeDispose(() => view().clearTimeout(resizeTimer))

  return { isInteracting, platterTransition, dotTransition, showHeld, hideHeld }
}
