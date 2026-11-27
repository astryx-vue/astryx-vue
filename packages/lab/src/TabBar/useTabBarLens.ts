/**
 * @file useTabBarLens.ts
 * @input 胶囊、项数、选中项、是否触屏呈现、松手的回调；core 的动效引擎和 UIKit 手势常量，
 *   uikitTabBar.ts、tabBarModel.ts 和 useTabBarPress.ts
 * @output useTabBarLens：选中透镜的动效和按压跟踪，以及 TabBar 挂到胶囊和透镜各层上的 ref
 * @position lab TabBar 的触屏层
 */

import type { MotionCurve, MotionEngine, SpringDescription } from '@astryx-vue/core/internal/touch'
import type { Ref, ShallowRef } from 'vue'
import { createMotionEngine, isRtlElement, UIKIT_GESTURES } from '@astryx-vue/core/internal/touch'
import { nextTick, onScopeDispose, shallowRef, watch } from 'vue'
import { useMotionEngine } from '../internal/useMotionEngine'
import { copyTransform, itemCenters, itemWidth, lensTarget, liftScale, nearestIndex } from './tabBarModel'
import { tabBar } from './uikitTabBar'
import { tabsOf, useTabBarPress } from './useTabBarPress'

/** 手指离落点超过这么远就算在拖。 */
const DRAG_SLOP = UIKIT_GESTURES.longPress.allowableMovement.value
/** 选中副本的曲线跑多久：比任何一个透镜弹簧停稳都长。 */
const COPY_HORIZON_S = 1.5
/** 从推导出的曲线上读速度时，两次取样隔多少秒。 */
const VELOCITY_STEP_S = 0.001
/** 被按住的标签带着这个属性；TabBar 的样式读它画按下的底色。 */
const PAINTED_ATTRIBUTE = 'data-tab-bar-pressed'

interface Press {
  /** 各项在胶囊里的中心，物理 px，弹性缩放之前。 */
  readonly centers: number[]
  /** 项（和静止透镜）的宽度，px。 */
  readonly size: number
  /** 胶囊左沿的视口 x，弹性缩放之前。 */
  readonly left: number
  readonly startX: number
  lastX: number
  isDragging: boolean
  /** 落下时有选中的标签：透镜跟着手指走。 */
  readonly hasLens: boolean
  /** 落在禁用的标签上：手指拖起来之前什么都不动。 */
  isIgnored: boolean
  readonly count: number
  /** 落下时没有选中的标签，没有透镜可动：改成给按住的标签上底色。 */
  readonly paints: boolean
  painted: HTMLElement | null
}

function paintTab(press: Press, tab: HTMLElement | null): void {
  if (!press.paints || press.painted === tab)
    return
  press.painted?.removeAttribute(PAINTED_ATTRIBUTE)
  press.painted = tab
  tab?.setAttribute(PAINTED_ATTRIBUTE, '')
}

export interface UseTabBarLensOptions {
  readonly capsule: Ref<HTMLElement | null>
  readonly count: () => number
  readonly selectedIndex: () => number
  /** 触屏呈现（主指针是粗指针）：手指和触控笔按弹簧抬起透镜。否则按压就是普通的按钮点击。 */
  readonly isTouch: () => boolean
  /** 在第 `index` 项上松手。 */
  readonly onLift: (index: number) => void
  /** 第 `index` 项是否禁用。手指落在上面时，拖起来之前什么都不动，和 UIKit 忽略点在禁用标签上一样。 */
  readonly isDisabled: (index: number) => boolean
}

export interface TabBarLens {
  /** 胶囊：它的缩放就是按压时的弹性。 */
  readonly capsuleRef: (element: unknown) => void
  /** 透镜本体：平移和抬起；它的 `::before` 是抬起时的阴影（在裁切之外）。 */
  readonly bodyRef: (element: unknown) => void
  /** 透镜的裁切层：它的 `::before` 是抬起时的玻璃。 */
  readonly clipRef: (element: unknown) => void
  /** 选中样子的项副本。 */
  readonly copyRef: (element: unknown) => void
  /** 副本里的第 `index` 项：抬起时的放大。 */
  readonly copyItemRef: (index: number) => (element: unknown) => void
  /** 副本正画着：透镜抬起，或者在手指下移动。静止时选中的标签画自己的选中样子，副本不挂载。 */
  readonly isCopyShown: ShallowRef<boolean>
}

/**
 * 透镜在 CSS 里静止在选中项上（TabBar.vue），里面的本体由这里移动：`x` 是离静止位置的偏移，
 * `scaleX` / `scaleY` 是抬起，`::before` 是随抬起淡入的阴影。本体里的裁切层装着移动时的选中
 * 副本，它的底色不透明，`::before` 是随抬起淡入的玻璃。副本做反变换，透镜移动时项停在原地，
 * 曲线由本体的曲线推出来（tabBarModel 的 `copyTransform`）。副本里每项绕自己的中心按抬起的
 * 倍数放大。手指落下或开始滑动时副本挂上，一切停稳后拿掉。数值全是 iOS 26.2 实测的（uikitTabBar.ts）。
 *
 * 触屏呈现下的手指和触控笔（iOS 和 Android 一样）。按压是没有延迟的长按，碰到就开始：
 * - 落下：透镜朝手指走（`lensTravel`）并抬起（`lift`：外扩、玻璃、放大），胶囊弹一下（`flexPress`）；
 * - 拖动（超过长按允许的移动距离）：透镜追着手指（`lensTrack`），越过首尾两项按橡皮筋收住；
 * - 抬起：选离手指最近的项，透镜落到它上面（`lensSettle`），抬起和弹性回落（`lift`、`flexRelease`）。
 *   被取消的按压落回选中项；
 * - 离开栏：透镜回到选中项，在那里松手什么都不选；在禁用的标签上也一样。
 * 松手的选择在落位动画开始之后、同一个事件里报给 app。app 要是留着旧的选中，透镜落回去。
 *
 * 选中项变化时，本体从透镜在屏幕上的位置滑到新的静止位置：从静止开始用 `lensTravel`（按键、
 * app 改的），松手引起的就接着松手时开始的落位。手指的移动会改写这些动画的目标，所以主线程
 * 忙的时候透镜照样在走。「减少动态效果」下按压不缩放；手指下的透镜直接放到手指处，抬起的样子
 * 立刻出现、只在松手时淡出；按键或 app 改的选中变成淡入淡出。
 *
 * 用鼠标时这里什么都不跑：点击选中标签，TabBar 的 CSS 让透镜滑过去。
 */
export function useTabBarLens(options: UseTabBarLensOptions): TabBarLens {
  const capsule = useMotionEngine()
  const body = useMotionEngine()
  // 抬起的样子（本体和裁切层的 `::before`）一开始是藏着的。
  const shadow = useMotionEngine({ pseudoElement: '::before', initial: { opacity: 0 } })
  const glass = useMotionEngine({ pseudoElement: '::before', initial: { opacity: 0 } })
  const copy = useMotionEngine()
  const copyItems: MotionEngine[] = []
  const copyItemRefs: Array<(element: unknown) => void> = []
  onScopeDispose(() => copyItems.forEach(item => item.attach(null)))

  const copyItemRef = (index: number): ((element: unknown) => void) => {
    while (copyItems.length <= index) {
      const animator = createMotionEngine(null)
      copyItems.push(animator)
      copyItemRefs.push(element => animator.attach(element instanceof HTMLElement ? element : null))
    }
    return copyItemRefs[index]!
  }
  const liveCopyItems = (): MotionEngine[] => copyItems.slice(0, options.count())

  let press: Press | null = null
  // 松手时朝新选中项开始的落位，等新的选中渲染出来（或 app 留着旧的）。
  let settling: number | null = null
  // 是否在某个标签上，松手会选它。离开栏就没有标签，滑出去就是取消。
  let isOnBar = false
  const isCopyShown = shallowRef(false)
  let motion = 0

  const isReduced = (touchRelease = false): boolean =>
    body.animator.reducedMotion({ touchRelease }) !== 'off'

  /** 手指在 `x` 时透镜去哪：跟着手指，越过首尾按橡皮筋收住。离开栏时回到选中项。 */
  const chaseTarget = (x: number, centers: number[]): number =>
    isOnBar ? lensTarget(x, centers) : centers[Math.max(options.selectedIndex(), 0)]!

  /** 这次（或之后某次）动效停稳、而且没有手指按着时，拿掉副本。 */
  function dropCopyAtRest(): void {
    const current = ++motion
    void Promise.all([
      body.animator.atRest(),
      glass.animator.atRest(),
      shadow.animator.atRest(),
      ...liveCopyItems().map(item => item.atRest()),
    ]).then(() => {
      if (motion === current && press == null)
        isCopyShown.value = false
    })
  }

  /** 从 `at` 起按本体此刻的曲线推出副本的反变换并播放。每次改了本体之后调用。 */
  function playCopy(at: number): void {
    const sample = (t: number): ReturnType<typeof copyTransform> => {
      const time = at + t * 1000
      return copyTransform(body.animator.get('x', time), body.animator.get('scaleX', time), body.animator.get('scaleY', time))
    }
    const curve = (key: 'x' | 'scaleX' | 'scaleY'): MotionCurve => ({
      duration: COPY_HORIZON_S,
      at: t => sample(t)[key],
      velocity: t => (sample(t + VELOCITY_STEP_S)[key] - sample(Math.max(0, t - VELOCITY_STEP_S))[key])
        / (t >= VELOCITY_STEP_S ? 2 * VELOCITY_STEP_S : VELOCITY_STEP_S),
    })
    copy.animator.play({ x: curve('x'), scaleX: curve('scaleX'), scaleY: curve('scaleY') }, { at })
  }

  /** 在 `body.animator.set()` 之后用：「减少动态效果」下 play() 会把副本的移动变成淡入淡出。 */
  function placeCopy(): void {
    copy.animator.set(copyTransform(body.animator.get('x'), body.animator.get('scaleX'), body.animator.get('scaleY')))
  }

  /** 抬起（true）或放下（false）一个 `size` px 宽的透镜，并让胶囊弹一下。 */
  function lift(isLifted: boolean, at: number, size: number, touchRelease = false): void {
    const animateOptions = { at, touchRelease }
    const spring = { spring: tabBar.lift }
    const reduced = isReduced(touchRelease)
    // 「减少动态效果」下抬起的样子在按下时立刻出现，和 UIKit 一样；放下仍然淡出。
    if (reduced && isLifted) {
      shadow.animator.set({ opacity: 1 })
      glass.animator.set({ opacity: 1 })
    }
    else {
      shadow.animator.animate({ opacity: isLifted ? 1 : 0 }, spring, animateOptions)
      glass.animator.animate({ opacity: isLifted ? 1 : 0 }, spring, animateOptions)
    }
    if (reduced)
      return
    const lifted = liftScale(size)
    body.animator.animate(isLifted ? { scaleX: lifted.x, scaleY: lifted.y } : { scaleX: 1, scaleY: 1 }, spring, animateOptions)
    for (const item of liveCopyItems())
      item.animate({ scale: isLifted ? tabBar.liftMagnification : 1 }, spring, animateOptions)
    capsule.animator.animate({ scale: isLifted ? tabBar.flexScale : 1 }, { spring: isLifted ? tabBar.flexPress : tabBar.flexRelease }, animateOptions)
  }

  /** 本体朝 `x` 走：「减少动态效果」下直接放过去，否则按 `spring` 走，副本跟着。 */
  function moveBody(x: number, spring: SpringDescription, at: number, touchRelease = false): void {
    if (isReduced(touchRelease)) {
      body.animator.set({ x })
      placeCopy()
      return
    }
    body.animator.animate({ x }, { spring }, { at, touchRelease })
    playCopy(at)
  }

  function begin(clientX: number, tab: HTMLElement | null): void {
    const element = options.capsule.value
    const root = element?.parentElement
    const selected = options.selectedIndex()
    const count = options.count()
    if (element == null || root == null)
      return
    // 在任何东西动起来之前读：胶囊的布局盒（弹性是变换，布局不管它）加上没缩放的父元素的位置。
    const left = root.getBoundingClientRect().left + element.offsetLeft
    const centers = itemCenters(element.offsetWidth, count, isRtlElement(element))
    const size = itemWidth(element.offsetWidth, count)
    const x = clientX - left
    const isIgnored = options.isDisabled(nearestIndex(x, centers))
    press = { centers, size, left, startX: x, lastX: x, isDragging: false, hasLens: selected >= 0, isIgnored, count, paints: selected < 0, painted: null }
    isOnBar = tab != null
    paintTab(press, tab)
    if (selected < 0 || isIgnored)
      return
    // 抬起的透镜显示选中样子：副本现在挂上，「减少动态效果」下也挂，只有放大算动效。
    motion += 1
    isCopyShown.value = true
    const at = performance.now()
    const travel = chaseTarget(x, centers) - centers[selected]!
    // 「减少动态效果」下透镜直接放到手指下，和 UIKit 一样；走过去会有一帧看不到透镜。
    if (isReduced())
      body.animator.set({ x: travel })
    else
      body.animator.animate({ x: travel }, { spring: tabBar.lensTravel }, { at })
    lift(true, at, size)
    if (isReduced())
      placeCopy()
    else
      playCopy(at)
  }

  function move(clientX: number, tab: HTMLElement | null): void {
    const selected = options.selectedIndex()
    if (press == null)
      return
    isOnBar = tab != null
    paintTab(press, tab)
    const x = clientX - press.left
    press.lastX = x
    press.isDragging ||= Math.abs(x - press.startX) > DRAG_SLOP
    if (press.isIgnored) {
      // 手指拖起来、或者停到可用的标签上，忽略就结束：显示手指下的标签，松手选它。
      if (!press.isDragging && tab == null)
        return
      press.isIgnored = false
      if (press.hasLens && selected >= 0) {
        motion += 1
        isCopyShown.value = true
        lift(true, performance.now(), press.size)
      }
    }
    if (!press.hasLens || selected < 0)
      return
    moveBody(chaseTarget(x, press.centers) - press.centers[selected]!, press.isDragging ? tabBar.lensTrack : tabBar.lensTravel, performance.now())
  }

  let pendingLift: ((tab: HTMLElement) => void) | null = null

  function end(tracked: HTMLElement | null, wasCancelled: boolean): void {
    const ended = press
    press = null
    pendingLift = null
    if (ended != null)
      paintTab(ended, null)
    const selected = options.selectedIndex()
    const element = options.capsule.value
    if (ended == null || element == null)
      return
    // 按着的时候标签列表变了：中心是旧列表的，按取消处理，透镜落回静止位置。
    const isStale = ended.count !== options.count()
    const lifted = wasCancelled || isStale ? null : tracked
    const chosen = lifted == null ? -1 : tabsOf(element).indexOf(lifted)
    if (ended.isIgnored || !ended.hasLens || selected < 0) {
      if (chosen >= 0)
        pendingLift = () => options.onLift(chosen)
      return
    }
    const target = chosen >= 0 ? chosen : selected
    const at = performance.now()
    moveBody(isStale ? 0 : ended.centers[target]! - ended.centers[selected]!, tabBar.lensSettle, at, true)
    lift(false, at, ended.size, true)
    dropCopyAtRest()
    if (chosen < 0)
      return
    if (chosen !== selected)
      settling = chosen
    pendingLift = () => {
      options.onLift(chosen)
      if (chosen === selected)
        return
      // app 渲染完新选中之后再看：它留着旧的选中，透镜就落回去。
      void nextTick(() => {
        if (settling === chosen && options.selectedIndex() === selected) {
          settling = null
          moveBody(0, tabBar.lensSettle, performance.now(), true)
          dropCopyAtRest()
        }
      })
    }
  }

  const tracking = useTabBarPress(options.capsule, {
    isEnabled: options.isTouch,
    handlers: {
      begin,
      move,
      end,
      activate: (tab) => {
        const run = pendingLift
        pendingLift = null
        run?.(tab)
      },
    },
  })

  // 按着的时候标签列表变了：按压就此按取消结束，免得移动去追旧的中心。
  watch(options.count, (count) => {
    if (press != null && press.count !== count)
      tracking.cancel()
  }, { flush: 'post' })

  // 手指下选中变了，渲染前就画上副本，开始滑动的那一帧已经有它。
  watch(options.selectedIndex, (next, previous) => {
    if (options.isTouch() && previous >= 0 && previous < options.count() && next >= 0 && !isReduced())
      isCopyShown.value = true
  }, { flush: 'pre' })

  // 新的选中：静止位置已经跳到新项（CSS，这一帧），本体从透镜在屏幕上的位置开始。
  watch(options.selectedIndex, (next, from) => slideTo(next, from), { flush: 'post' })

  function slideTo(next: number, from: number): void {
    const element = options.capsule.value
    const count = options.count()
    const fromLift = settling === next
    settling = null
    if (!options.isTouch() || element == null || from === next || from < 0 || next < 0 || from >= count)
      return
    const centers = itemCenters(element.offsetWidth, count, isRtlElement(element))
    const now = performance.now()
    const offset = body.animator.get('x', now) + centers[from]! - centers[next]!
    const velocity = body.animator.getVelocity('x', now)
    body.animator.set({ x: offset })
    const chase = (): number => press == null ? 0 : chaseTarget(press.lastX, press.centers) - press.centers[next]!
    // 「减少动态效果」下把手指的透镜和副本放到位；播曲线的话副本会在松手时淡出再淡入。
    if ((press != null || fromLift) && isReduced()) {
      body.animator.set({ x: chase() })
      placeCopy()
      if (press == null)
        dropCopyAtRest()
      return
    }
    if (press != null) {
      // 手指按着（选中在它下面变了）：透镜继续朝手指走，从新的静止位置量起。
      body.animator.animate({ x: chase() }, { spring: press.isDragging ? tabBar.lensTrack : tabBar.lensTravel, velocity: { x: velocity } }, { at: now })
      playCopy(now)
      return
    }
    if (fromLift || velocity !== 0) {
      // 屏幕上还在动：从现在接着走，副本由它推出来。
      body.animator.animate({ x: 0 }, { spring: fromLift ? tabBar.lensSettle : tabBar.lensTravel, velocity: { x: velocity } }, { at: now, touchRelease: fromLift })
      playCopy(now)
      dropCopyAtRest()
      return
    }
    // 从静止开始（按键、app 改的）：本体在浏览器提交这一帧时开始，和透镜跳到新位置同一帧。
    // 副本按本体自己的时钟播本体的曲线。
    copy.animator.set({ x: -offset })
    const call = body.animator.animate({ x: 0 }, { spring: tabBar.lensTravel })
    dropCopyAtRest()
    const current = motion
    void call.started.then((start) => {
      if (motion === current)
        playCopy(start)
    })
  }

  return {
    capsuleRef: capsule.ref,
    bodyRef: (element) => {
      body.ref(element)
      shadow.ref(element)
    },
    clipRef: glass.ref,
    copyRef: copy.ref,
    copyItemRef,
    isCopyShown,
  }
}
