/**
 * AlertDialog 的触屏动效（上游 AlertDialog/useAlertMotion.ts）。
 *
 * 手指下（主指针是粗指针），弹窗像 iOS 一样从 1.2 倍缩到原大，弹窗和遮罩一起淡入，
 * 用主题的对话框进场时序；关闭时按退场时长和曲线淡出，淡出播完对话框才真正关闭。
 * 中途关闭或重新打开，都从当前的样子折返。进场期间手指和笔的输入被挡住；退场期间
 * 内容是 inert，焦点移出去，它里面的另一个浮层（模态框托管的 toast）照常可用。
 * 鼠标保留主题的 CSS 进场，关闭是立即的。
 */
import type { ComputedRef } from 'vue'
import type { Animator, MotionCurve, MotionHandle } from '../motion/animator.js'
import type { ThemeTimingTokens } from '../motion/themeTiming.js'
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { holdInput } from '../layer/inputHold.js'
import { createMotionEngine } from '../motion/animator.js'
import { mapProgress, mapRange } from '../motion/progress.js'
import { readThemeTimingOrInstant } from '../motion/themeTiming.js'

/** 进场用主题的进场曲线，时长取最接近 UIKit 实测 404ms 弹窗呈现的一档。轻点没有速度，不放弹簧。 */
const ALERT_ENTRANCE_TOKENS: ThemeTimingTokens = {
  duration: '--duration-medium-max',
  easing: '--ease-entrance',
}

/** 退场用所有浮层共用的退场时长和曲线。 */
const ALERT_EXIT_TOKENS: ThemeTimingTokens = {
  duration: '--duration-exit',
  easing: '--ease-exit',
}

/** iOS 的弹窗从 1.2 倍大小开始。 */
const PRESENT_SCALE_FROM = 1.2

/** 错过退场结束通知的对话框，在退场时长之后再过这么久也会关闭。 */
const EXIT_BACKSTOP_MS = 100

type Status = 'hidden' | 'open' | 'leaving'

/** 弹窗自己和它的遮罩（`::backdrop`）各一个动画器。 */
interface Engines {
  panel: Animator
  backdrop: Animator
}

/** 1.2 倍的起点，但不比视口宽：宽弹窗不会从屏幕边缘外开始。打开时读一次布局。 */
function presentScaleFrom(element: HTMLElement | null): number {
  const width = element?.offsetWidth ?? 0
  const viewport = element?.ownerDocument.documentElement.clientWidth ?? 0
  return width > 0 && viewport > 0
    ? Math.max(1, Math.min(PRESENT_SCALE_FROM, viewport / width))
    : PRESENT_SCALE_FROM
}

function between(progress: MotionCurve, from: number, to: number): MotionCurve {
  // 不夹住：会过冲的缓动带着数值一起过冲。
  return mapProgress(progress, mapRange([0, 1], [from, to], { clamp: false }))
}

/** 弹窗和遮罩从屏幕上的样子淡到 `opacity`；还在动的缩放保留自己的曲线。 */
function fadeFromHere({ panel, backdrop }: Engines, opacity: number, progress: MotionCurve): MotionHandle {
  backdrop.play({ opacity: between(progress, backdrop.get('opacity'), opacity) })
  return panel.play({ opacity: between(progress, panel.get('opacity'), opacity) })
}

export interface AlertMotionOptions {
  /** 调用方的打开状态。 */
  isOpen: () => boolean
  /** 播触屏动效（主指针是粗指针）。 */
  isEnabled: () => boolean
  /** 对话框元素。 */
  element: () => HTMLElement | null
}

export interface AlertMotion {
  /** 对话框是否打开：显示着或正在退场时都为 true。 */
  isPresented: ComputedRef<boolean>
  /** 动效正在驱动对话框（主题的 CSS 进场关掉）。 */
  isDriving: ComputedRef<boolean>
}

export function useAlertMotion({ isOpen, isEnabled, element }: AlertMotionOptions): AlertMotion {
  // 退场期间弹窗保持呈现；同步设置，对话框不会在退场结束前先关闭。
  const isLeaving = shallowRef(false)
  watch(isOpen, (open) => {
    isLeaving.value = !open && isEnabled()
  }, { flush: 'sync' })
  const isPresented = computed(() => isOpen() || isLeaving.value)
  const isDriving = computed(() => isEnabled())

  // 动画器在挂载后才建：服务端渲染不碰 DOM 相关的东西。
  let engines: Engines | null = null
  const attachEngines = (target: HTMLElement | null): Engines => {
    engines ??= {
      panel: createMotionEngine(null),
      backdrop: createMotionEngine(null, { pseudoElement: '::backdrop', base: { opacity: 1 } }),
    }
    if (engines.panel.element !== target) {
      engines.panel.attach(target)
      engines.backdrop.attach(target)
    }
    return engines
  }

  // 动画器只在动效驱动对话框时拿着它，鼠标呈现保留自己的样式。
  watch([isDriving, element], ([driving, target]) => {
    if (driving) {
      attachEngines(target)
      return
    }
    if (engines == null)
      return
    // 鼠标接替了手指：主题样式重新显示。
    if (engines.panel.element != null) {
      engines.panel.set({ opacity: 1, scale: 1 })
      engines.backdrop.set({ opacity: 1 })
    }
    engines.panel.attach(null)
    engines.backdrop.attach(null)
  }, { flush: 'post' })

  // 即使挂载时就打开，也从 hidden 开始，和其它打开一样呈现。
  let status: Status = 'hidden'
  let exit: MotionHandle | null = null
  let exitMs = 0
  let backstop: ReturnType<typeof setTimeout> | null = null
  let releaseHold: (() => void) | null = null
  // 退场暂挡拿走焦点的那个按钮：退场途中重新打开时把焦点还给它。
  let blurredByDismissal: HTMLElement | null = null
  let isUnmounted = false

  const hold = (target: HTMLElement | null, until: PromiseLike<unknown>, scope: 'viewport' | 'layer'): void => {
    releaseHold?.()
    releaseHold = target == null ? null : holdInput(target, { until, scope })
  }

  const clearBackstop = (): void => {
    if (backstop != null)
      clearTimeout(backstop)
    backstop = null
  }

  const finishExit = (): void => {
    exit = null
    clearBackstop()
    isLeaving.value = false
  }

  const enterFromHidden = ({ panel, backdrop }: Engines, target: HTMLElement | null): void => {
    // 对话框已经以模态打开，还没画出来。手指和笔的输入等弹窗进场完；键盘和辅助技术照常。
    const scaleFrom = presentScaleFrom(target)
    panel.set({ opacity: 0, scale: scaleFrom })
    backdrop.set({ opacity: 0 })
    const progress = readThemeTimingOrInstant(target, ALERT_ENTRANCE_TOKENS)
    const handle = panel.play({ opacity: between(progress, 0, 1), scale: between(progress, scaleFrom, 1) })
    backdrop.play({ opacity: between(progress, 0, 1) })
    hold(target, handle.finished, 'viewport')
  }

  const reopen = (attached: Engines, target: HTMLElement | null): void => {
    exit = null
    clearBackstop()
    const handle = fadeFromHere(attached, 1, readThemeTimingOrInstant(target, ALERT_ENTRANCE_TOKENS))
    hold(target, handle.finished, 'viewport')
    // 退场暂挡已经放开，内容重新可用；焦点没去别处时还给它拿走焦点的那个按钮。
    const blurred = blurredByDismissal
    blurredByDismissal = null
    const doc = target?.ownerDocument
    if (blurred?.isConnected === true && doc != null && (doc.activeElement == null || doc.activeElement === doc.body))
      blurred.focus({ preventScroll: true })
  }

  const leave = (attached: Engines, target: HTMLElement | null): void => {
    const progress = readThemeTimingOrInstant(target, ALERT_EXIT_TOKENS)
    exitMs = progress.duration * 1000
    const handle = fadeFromHere(attached, 0, progress)
    const focused = target?.ownerDocument.activeElement
    blurredByDismissal = focused instanceof HTMLElement && focused !== target && target?.contains(focused) === true
      ? focused
      : null
    // 退场期间什么输入都到不了弹窗：内容 inert，挡板接住每一下。
    hold(target, handle.finished, 'layer')
    exit = handle
    void handle.finished.then((isDone) => {
      if (isDone && exit === handle)
        finishExit()
    })
    // 退场结束没有报到（动画关掉、元素离开文档）时，到点也关闭。
    clearBackstop()
    backstop = setTimeout(() => {
      if (exit === handle || exit == null)
        finishExit()
    }, exitMs + EXIT_BACKSTOP_MS)
  }

  const sync = (): void => {
    if (isUnmounted)
      return
    const was = status
    const now: Status = !isPresented.value ? 'hidden' : isOpen() ? 'open' : 'leaving'
    status = now
    if (!isEnabled() || was === now)
      return
    const target = element()
    const attached = attachEngines(target)
    if (now === 'open' && was === 'hidden') {
      enterFromHidden(attached, target)
      return
    }
    if (now === 'open') {
      reopen(attached, target)
      return
    }
    if (now === 'leaving') {
      leave(attached, target)
      return
    }
    // hidden：退场结束，对话框关闭了模态。
    exit = null
    blurredByDismissal = null
    releaseHold?.()
    releaseHold = null
  }

  // 对话框在它自己的 post 回调里打开模态；等这一轮更新全部结束再同步。
  watch([isOpen, isPresented], () => {
    void nextTick(sync)
  }, { flush: 'post' })
  onMounted(sync)

  onBeforeUnmount(() => {
    isUnmounted = true
    clearBackstop()
    releaseHold?.()
    releaseHold = null
    engines?.panel.dispose()
    engines?.backdrop.dispose()
  })

  return { isPresented, isDriving }
}
