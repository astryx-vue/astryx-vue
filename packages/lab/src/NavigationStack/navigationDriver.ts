/**
 * @file navigationDriver.ts
 * @input core 的动效引擎、弹簧求解和动效角色解析（`@astryx-vue/core/internal/touch`），
 *   navigationTransition.ts 的层位置，navigationMotion.ts 的数值
 * @output createNavigationDriver：把各屏的卡片、栏、遮暗和栏裁切放到某个进度，或按弹簧弹过去；
 *   返回按钮小箭头的淡入淡出；屏幕停到原位
 * @position NavigationStack 的转场驱动。只碰合成层动效引擎，不碰响应式状态。
 */

import type { MotionEngine, MotionHandle, SpringDescription, SpringTransition } from '@astryx-vue/core/internal/touch'
import type { Ref } from 'vue'
import { isCoarsePointer, isRtlElement, resolveMotion, solveSpring, toSpring } from '@astryx-vue/core/internal/touch'
import { navigation, springs } from './navigationMotion'
import { layersAt, layerVelocities } from './navigationTransition'

/**
 * 一屏会动的层：卡片和盖在上面的遮暗，栏和栏上同样的遮暗。栏跟着卡片走，
 * 标题和尾部内容也在里面。
 */
export interface ScreenLayers {
  card: MotionEngine
  dim: MotionEngine
  bar: MotionEngine
  barDim: MotionEngine
  /**
   * 栏的裁切框和框里的那一行，反向移动：行移动框的相反数。手指下框的边缘在最上面那张
   * 卡片的前沿处切掉被盖住的栏，行本身不动。其余时候都在原位。
   */
  barClip: MotionEngine
  barClipContent: MotionEngine
  titleElement: HTMLElement | null
  /** `titleDisplayMode="large"` 时内容上方的大标题。 */
  largeTitleElement: HTMLElement | null
  /** 栏标题的文字，大标题显示时藏起来。 */
  titleText: MotionEngine
}

export type NavigationRegistry = Map<string, Partial<ScreenLayers>>

/**
 * 把一个组件的层登记到 `key` 这一屏名下，返回注销函数。注销只删还是自己登记的那些项，
 * 外加 `owned` 列出的元素项；这一屏什么都不剩时整条删掉。
 */
export function registerLayers(
  registry: NavigationRegistry,
  key: string,
  layers: Partial<ScreenLayers>,
  owned: ReadonlyArray<'titleElement' | 'largeTitleElement'> = [],
): () => void {
  const entry = registry.get(key) ?? {}
  Object.assign(entry, layers)
  registry.set(key, entry)
  return () => {
    const current = registry.get(key)
    if (current == null)
      return
    for (const name of Object.keys(layers) as Array<keyof ScreenLayers>) {
      if (current[name] === layers[name])
        delete current[name]
    }
    for (const name of owned)
      delete current[name]
    if (Object.keys(current).length === 0)
      registry.delete(key)
  }
}

/** 转场动画什么时候开始，作为动效引擎的调用选项。 */
export interface TransitionClock {
  at?: number
  start?: 'next-frame'
}

/**
 * 一次转场的时钟。手指松开的转场用松手时刻，弹簧从手指离开的那一帧接着走。从静止开始的
 * 转场把开始交给动效引擎，由浏览器的提交来定时：提交慢了或者后面的监听阻塞了，动画只会
 * 晚开始，不会跳帧。在输入事件自己的任务里（点一行、按一个键），动画从这个任务之后的
 * 第一帧开始。
 */
export function transitionClock(releasedAt: number | undefined, isInputTask: boolean): TransitionClock {
  if (releasedAt != null)
    return { at: releasedAt }
  return isInputTask ? { start: 'next-frame' } : {}
}

/** 一次按压派发的指针、按键和触摸事件。 */
const INPUT_EVENT_TYPES: ReadonlySet<string> = new Set([
  'click',
  'pointerdown',
  'pointerup',
  'mousedown',
  'mouseup',
  'touchstart',
  'touchend',
  'keydown',
  'keyup',
])

/** 页面此刻正在派发一个输入事件。用于应用在栈自己的监听之外发起的推入。 */
export function isDispatchingInput(view: (Window & typeof globalThis) | null | undefined): boolean {
  if (view == null)
    return false
  const event: unknown = Reflect.get(view, 'event')
  return event instanceof view.Event && INPUT_EVENT_TYPES.has(event.type)
}

/** 栈的书写方向，按 core 的读法。 */
export function writingDirection(element: HTMLElement | null): 'ltr' | 'rtl' {
  return isRtlElement(element) ? 'rtl' : 'ltr'
}

export interface NavigationDriverOptions {
  readonly container: Ref<HTMLElement | null>
  readonly cards: Ref<HTMLElement | null>
  readonly registry: NavigationRegistry
  /** 返回按钮的底盘和小箭头（整个栈一个）。 */
  readonly backControl: MotionEngine
  readonly backChevron: MotionEngine
  /** 栈里的点击或按键正在这个任务里处理。 */
  readonly isInputTask: () => boolean
  /** 根屏幕的 key。 */
  readonly rootKey: () => string | undefined
}

/** 底下那张卡片的栏停在哪里：原地不动（`rest`），或跟着卡片的视差走（`ride`）。 */
export type UnderBar = 'rest' | 'ride'

/** 栈驱动各屏层的入口：摆放、跟手、弹簧动画和静止停放。 */
export interface NavigationDriver {
  layersOf: (key: string | null | undefined) => Partial<ScreenLayers> | null
  width: () => number
  direction: () => 'ltr' | 'rtl'
  readClearBars: () => boolean
  setProgress: (p: number, top: string, under: string | null, underBar?: UnderBar) => void
  animateProgress: (
    to: 0 | 1,
    top: string,
    under: string | null,
    spring: SpringDescription,
    dp: number | undefined,
    release: boolean,
    underBar: UnderBar,
    releasedAt?: number,
  ) => Promise<boolean>
  fadeBack: (kind: 'push' | 'pop', under: string | null, release?: boolean) => void
  settle: (key: string, role: 'top' | 'covered') => void
  parkBar: (key: string) => void
  parkClip: (key: string, underX: number) => void
  placeOffscreen: (key: string) => void
  stop: (keys: readonly string[]) => void
  progress: () => number
}

export function createNavigationDriver(options: NavigationDriverOptions): NavigationDriver {
  const { container, cards, registry, backControl, backChevron } = options
  let progress = 0
  // 手指下的栏是 iOS 26 的透明栏，被盖住的栏会从上面的卡片透出来。UIKit 的覆盖视图在前沿处
  // 切掉下面的标题；这里被盖住的栏的裁切框跟着最上面那张卡片的前沿走，框里的行不动。静止时
  // 框是关上的；卡片移动时它跟着弹簧或手指走。每次移动开始时读一次指针，和滑动手势一样。
  // 用鼠标时栏是不透明的，裁切框在原位。
  let clearBars = false
  // 上一次转场各屏用的时钟（它们的开始），返回按钮的小箭头跟着它走。
  let started: TransitionClock = {}

  const width = (): number => cards.value?.clientWidth ?? 0
  const direction = (): 'ltr' | 'rtl' => writingDirection(container.value)
  const layersOf = (key: string | null | undefined): Partial<ScreenLayers> | null =>
    key == null ? null : (registry.get(key) ?? null)

  function readClearBars(): boolean {
    clearBars = isCoarsePointer(container.value?.ownerDocument.defaultView)
    return clearBars
  }

  /** 被盖住的栏的框移到哪里，边缘才和最上面那张卡片的前沿对齐（卡片在 topX，栏在 underBarX）。 */
  function clipXFor(topX: number, underBarX: number): number {
    const sign = direction() === 'rtl' ? -1 : 1
    return topX - underBarX - sign * width()
  }

  function setClip(key: string | null | undefined, x: number): void {
    const layers = layersOf(key)
    layers?.barClip?.set({ x })
    layers?.barClipContent?.set({ x: -x })
  }

  /** 静止时被盖住的栏的裁切：手指下切在最上面卡片的前沿，鼠标下整条。 */
  function parkClip(key: string, underX: number): void {
    setClip(key, readClearBars() ? clipXFor(0, underX) : 0)
  }

  /**
   * 把各层写到进度 p（手指的一帧，或转场的第一帧；没有动画）。上面的栏跟着卡片走。
   * 手指下露出来的栏停在原地，和 UIKit 一样；`underBar: 'ride'` 让它停在卡片的视差上，
   * 程序发起的退出从那里开始。
   */
  function setProgress(p: number, top: string, under: string | null, underBar: UnderBar = 'rest'): void {
    const values = layersAt(p, width(), direction())
    const topLayers = layersOf(top)
    const underLayers = layersOf(under)
    topLayers?.card?.set({ x: values.topX })
    topLayers?.bar?.set({ x: values.topX })
    underLayers?.card?.set({ x: values.underX })
    const underBarX = underBar === 'ride' ? values.underX : 0
    underLayers?.bar?.set({ x: underBarX })
    underLayers?.dim?.set({ opacity: values.dim })
    underLayers?.barDim?.set({ opacity: values.dim })
    // 手指下被盖住的栏切在最上面卡片的前沿；鼠标下两条栏都是整的。
    setClip(top, 0)
    setClip(under, clearBars ? clipXFor(values.topX, underBarX) : 0)
    progress = p
  }

  /**
   * 把各层按弹簧弹到进度 `to`。`dp` 是起步的进度速度（不传就沿用各层在屏幕上的速度）。
   * `releasedAt` 是手指松开的时刻；没有它时弹簧按动效引擎的时钟开始（transitionClock）。
   */
  function animateProgress(
    to: 0 | 1,
    top: string,
    under: string | null,
    spring: SpringDescription,
    dp: number | undefined,
    release: boolean,
    underBar: UnderBar,
    releasedAt?: number,
  ): Promise<boolean> {
    const w = width()
    const dir = direction()
    const values = layersAt(to, w, dir)
    const velocity = dp == null ? null : layerVelocities(dp, w, dir)
    const clock = transitionClock(
      releasedAt,
      options.isInputTask() || isDispatchingInput(container.value?.ownerDocument.defaultView as (Window & typeof globalThis) | null | undefined),
    )
    const topLayers = layersOf(top)
    const underLayers = layersOf(under)
    const handles: MotionHandle[] = []
    const springTo = (v: number | undefined, prop: 'x' | 'opacity'): SpringTransition =>
      ({ spring, velocity: v == null ? undefined : { [prop]: v } })
    // 「减弱动态效果」由动效引擎处理；`crossfadeAs` 说明哪张卡片进来（在落点淡入）、
    // 哪张离开（原地淡出）。手指松开后的动画在任何指针上都淡变（`touchRelease`）。
    if (topLayers?.card) {
      handles.push(topLayers.card.animate(
        { x: values.topX },
        springTo(velocity?.topX, 'x'),
        { ...clock, touchRelease: release, crossfadeAs: to === 0 ? 'entrance' : 'exit' },
      ))
      started = clock
    }
    // 栏跟着卡片走（在 UIKit 里每屏的栏是它的一部分）：进来的栏盖住出去的标题。
    if (topLayers?.bar)
      handles.push(topLayers.bar.animate({ x: values.topX }, springTo(velocity?.topX, 'x'), { ...clock, touchRelease: release }))
    if (underLayers?.bar && underBar === 'ride')
      handles.push(underLayers.bar.animate({ x: values.underX }, springTo(velocity?.underX, 'x'), { ...clock, touchRelease: release }))
    if (underLayers?.card) {
      handles.push(underLayers.card.animate(
        { x: values.underX },
        springTo(velocity?.underX, 'x'),
        { ...clock, touchRelease: release, crossfadeAs: to === 1 ? 'entrance' : 'exit' },
      ))
    }
    if (clearBars) {
      // 手指下被盖住的栏的框沿着最上面卡片的前沿，用同一个弹簧、同样的起点和速度走。
      // 两条栏曲线的差还是同一条曲线。不做截断：越过静止位置的回弹仍然切着。
      // 「减弱动态效果」的淡变没有位移：标题立刻换掉，和 UIKit 一样。
      const underBarTo = underBar === 'ride' ? values.underX : (underLayers?.bar?.get('x') ?? 0)
      const clipTo = clipXFor(values.topX, underBarTo)
      setClip(top, 0)
      if ((topLayers?.card?.reducedMotion({ touchRelease: release }) ?? 'off') !== 'off') {
        setClip(under, clipTo)
        // 退出：离开的栏也立刻走。
        if (to === 1)
          setClip(top, dir === 'rtl' ? w : -w)
      }
      else if (underLayers?.barClip && underLayers.barClipContent) {
        const clipVelocity = velocity == null
          ? undefined
          : velocity.topX - (underBar === 'ride' ? velocity.underX : 0)
        handles.push(
          underLayers.barClip.animate({ x: clipTo }, springTo(clipVelocity, 'x'), { ...clock, touchRelease: release }),
          underLayers.barClipContent.animate(
            { x: -clipTo },
            springTo(clipVelocity == null ? undefined : -clipVelocity, 'x'),
            { ...clock, touchRelease: release },
          ),
        )
      }
    }
    else {
      // 鼠标下两条栏都是整的，粗指针留下的裁切也收回来。
      setClip(top, 0)
      setClip(under, 0)
    }
    for (const dim of [underLayers?.dim, underLayers?.barDim]) {
      if (dim == null)
        continue
      if (dim.reducedMotion({ touchRelease: release }) !== 'off') {
        // 「减弱动态效果」的淡变没有遮暗：遮暗属于滑动。
        dim.set({ opacity: 0 })
      }
      else {
        handles.push(dim.animate({ opacity: values.dim }, springTo(velocity?.dim, 'opacity'), { ...clock, touchRelease: release }))
      }
    }
    progress = to
    return Promise.all(handles.map(async handle => handle.finished)).then(results => results.every(Boolean))
  }

  /**
   * 从根屏幕推入或退回根屏幕时的返回按钮，和 UIKit 一样。推入时底盘从第一帧就在，小箭头
   * 晚一拍淡入；退出时小箭头立刻淡出，底盘跟着屏幕离开。两次淡变都用返回按钮的弹簧，推入的
   * 延迟是导航表里实测的值。
   */
  function fadeBack(kind: 'push' | 'pop', under: string | null, release = false): void {
    if (under == null || options.rootKey() !== under)
      return
    const element = container.value
    const delay = kind === 'pop' ? 0 : resolveMotion(element, navigation, 'backChevronPushDelayMs')
    if (kind === 'push') {
      backControl.set({ opacity: 1 })
      backChevron.set({ opacity: 0 })
    }
    // 用各屏的时钟，和它们一起开始。延迟是曲线的一部分，整个淡变是一个合成层动画，
    // 主线程忙也拖不住它。WebKit 里开始时刻定在将来会等主线程。
    const from = kind === 'push' ? 0 : 1
    const to = kind === 'push' ? 1 : 0
    const fade = solveSpring(toSpring(resolveMotion(element, springs.navigationBackButton)), { from, to })
    const delayS = delay / 1000
    backChevron.play(
      {
        opacity: {
          duration: delayS + fade.settleTime(0.001),
          at: t => (t < delayS ? from : fade.value(t - delayS)),
          velocity: t => (t < delayS ? 0 : fade.velocity(t - delayS)),
        },
      },
      { ...started, touchRelease: release },
    )
  }

  /** 把一屏的层放到静止位置：在最上面，或被盖住。 */
  function settle(key: string, role: 'top' | 'covered'): void {
    const layers = layersOf(key)
    const values = layersAt(0, width(), direction())
    if (role === 'top') {
      layers?.card?.set({ x: 0, opacity: 1 })
      layers?.dim?.set({ opacity: 0 })
      layers?.bar?.set({ x: 0 })
      layers?.barDim?.set({ opacity: 0 })
      // 在最上面的屏幕在任何指针下都显示整条栏。
      setClip(key, 0)
    }
    else {
      // 被盖住：停在视差处，压在最上面的屏幕和它的栏下面。
      layers?.card?.set({ x: values.underX, opacity: 1 })
      layers?.dim?.set({ opacity: 1 })
      layers?.bar?.set({ x: values.underX })
      layers?.barDim?.set({ opacity: 1 })
      // 这里重新读指针：移动期间指针可能变了。
      parkClip(key, values.underX)
    }
  }

  /** 新挂上来、处于被盖住位置的栏停到视差处；裁切按当前指针。 */
  function parkBar(key: string): void {
    const values = layersAt(0, width(), direction())
    layersOf(key)?.bar?.set({ x: values.underX })
    parkClip(key, values.underX)
  }

  /** 推入期间又推入：新的一屏（刚挂上、在原位）像任何推入一样从屏幕外开始。 */
  function placeOffscreen(key: string): void {
    const values = layersAt(1, width(), direction())
    layersOf(key)?.card?.set({ x: values.topX })
    layersOf(key)?.bar?.set({ x: values.topX })
  }

  /** 停下两屏上正在动的一切。 */
  function stop(keys: readonly string[]): void {
    for (const key of keys) {
      const layers = layersOf(key)
      layers?.card?.stop()
      layers?.dim?.stop()
      layers?.bar?.stop()
      layers?.barDim?.stop()
      layers?.barClip?.stop()
      layers?.barClipContent?.stop()
    }
  }

  return {
    layersOf,
    width,
    direction,
    readClearBars,
    setProgress,
    animateProgress,
    fadeBack,
    settle,
    parkBar,
    parkClip,
    placeOffscreen,
    stop,
    progress: () => progress,
  }
}
