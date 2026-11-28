/**
 * @file useSwipeAction.ts
 * @input 行根（SwipeActionsLayer 的面板挂在它下面）、行的横滑选项；共享拖动通道
 *   createSnapDrag（触控板分流、pan、吸附拖动和动画器）；UIKit 的横滑常量
 * @output useSwipeAction：行横滑背后的状态、落位、触发和合上
 * @position 横滑模块内部，只有 SwipeActionsLayer.vue 用它。拖动模型在 swipeDragModel.ts，
 *   纯规则在 swipeRelease.ts，DOM 辅助在 swipeDom.ts。
 */

import type { ShallowRef } from 'vue'
import type { SnapDrag } from '../dragToSnapPoints/createDragToSnapPoints'
import type { MotionHandle } from '../motion/types'
import type { SettleCause, SwipeActionOptions, SwipeSettleOptions } from './swipeDragModel'
import type { Stop, SwipeLayout, SwipeSide, SwipeState } from './swipeRelease'
import { onScopeDispose, shallowRef, watch } from 'vue'
import { setPressHeld } from '../composables/internal/pressHeld'
import { createSnapDrag } from '../dragToSnapPoints/createDragToSnapPoints'
import { getGestureHost } from '../gestures/GestureHost'
import { TapGestureRecognizer } from '../gestures/TapGestureRecognizer'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'
import { swipeActions as SWIPE } from '../motion/uikit/swipeActions'
import { isRtlElement } from '../utils/isRtlElement'
import { lockSelection } from '../utils/selectionLock'
import { focusRowContent, settleParts, sidePanelOf, subscribeOpenRowCloses } from './swipeDom'
import { createSwipeDragModel } from './swipeDragModel'
import {
  AT_REST_PX,
  confirmProgress,
  IDLE_STATE,
  isSwipeOpen,
  physicalSign,
  sideFor,
  stopAt,
  stopIndex,
  stopsOf,
  SWIPE_CONFIRM_PROPERTY,
  SWIPE_TRAVEL_PROPERTY,
} from './swipeRelease'

export interface UseSwipeActionResult {
  state: Readonly<ShallowRef<SwipeState>>
  /**
   * 停开的面板里某个操作被点了。不带 `hasRemoval`（`holdsOut`）的立即触发，行合上；
   * 带的，行滑出、内容离开原来的盒子时触发，然后停在外面。被点的操作（这一侧的第 `cover` 个）
   * 在此期间盖满面板。
   */
  activateEntry: (fire: () => void, holdsOut: boolean, cover: number) => void
  /** 合上开着的行。 */
  close: (start?: 'next-frame') => void
  /** 焦点在行里时 Escape 合上开着的行。 */
  onKeyDown: (event: KeyboardEvent) => void
}

/**
 * 行的横滑跑在所有跟手平移共用的拖动通道上：触控板分流、pan、吸附拖动和动画器。
 * 行按侧声明它的停靠点（原位、开宽、全滑时滑出行边之外）和它的操作。拖动把行的位移画进根上的
 * 一个 CSS 自定义属性，面板的每个部件都读它（SwipeActionsLayer）；落位把终点立即写进去，各部件
 * 在合成器上沿同一个时钟走过去。
 *
 * 拖过确认点、且这一侧的最外侧操作能触发时，全滑确认：行跑到 UIKit 的确认偏移，最外侧操作盖满
 * 空出来的地方（面板从第二个属性「确认进度」读到它），退回就撤销。确认状态下抬起，行滑出并触发
 * 最外侧操作，速度不论；单靠速度永远不触发，所以全滑是一甩唯一到不了的停靠点。行滑出时（全滑，
 * 或点了带 `hasRemoval` 的操作），等行的内容离开原来的盒子才触发，然后行弹回，或在操作带
 * `hasRemoval` 时停在外面。
 *
 * 鼠标拖动和鼠标滚轮的刻度永远不横滑行：pan 只接触摸、笔和触控板滚动。另一根手指按着时
 * （不论在不在这一行上）落下的手指不会开始 pan：页面去缩放。
 *
 * 开着的行在指针落在它外面时合上。从让它停开的那次松手起就算开着。焦点不在开着的面板里时，
 * 带着它的任何滚动也会合上它；焦点在行里时 Escape 合上它。在它自己的内容上轻点也会合上它，
 * 且不激活行上的任何东西；鼠标和笔的按下照常到达行。
 *
 * 减少动效下，拖动本身是直接操作，一比一跟随；但松手、确认、合上开始的东西不移动也不回弹。
 * 手指松手后行在不透明度低谷处落位；笔和触控板的在细指针上立即落位。
 *
 * 方向是逻辑的：`leading` 由朝行内末尾的拖动露出，位于行内开头；`trailing` 相反。
 * 都在拖动开始时按根的计算 `direction` 读。
 */
export function useSwipeAction(
  root: () => HTMLElement | null,
  options: () => SwipeActionOptions,
): UseSwipeActionResult {
  const state = shallowRef<SwipeState>(IDLE_STATE)
  /** 最近移动那一侧的几何：行在哪、怎么移动它。 */
  let layout: SwipeLayout | null = null
  let snap: SnapDrag | null = null
  let stopCloses: (() => void) | null = null
  /** 最近一次按下落在哪一侧的最外侧操作上（行正开在那一侧时）。 */
  let landedOn: SwipeSide | null = null
  let close: (start?: 'next-frame') => void = () => {}

  const isOpen = (): boolean => isSwipeOpen(state.value)

  // 所有状态变化都走这里。所以让行打开或合上的那次变化，就在引起它的处理函数里立即按住或放开
  // 根的按压：开着的行的根不接按压，点它的内容只会合上它，和 UIKit 一样单元格根本收不到那次触摸。
  // 同一次变化订阅或取消行的合上时机。
  const setState = (next: SwipeState): void => {
    const wasOpen = isOpen()
    const willOpen = isSwipeOpen(next)
    state.value = next
    if (wasOpen === willOpen)
      return
    stopCloses?.()
    stopCloses = null
    const element = root()
    if (element == null)
      return
    setPressHeld(element, willOpen)
    if (willOpen)
      stopCloses = subscribeOpenRowCloses(element, () => layout?.side, start => close(start))
  }

  /** 行现在在屏幕上的位移，物理 px。 */
  const presentedX = (): number => snap?.position() ?? 0

  /**
   * 某个位移（物理 px）下全滑的确认进度。只有最外侧操作盖满面板时才动它；不能确认的拖动
   * 让每个操作都留在原处。它和位移在同一个动画里画出（共享拖动的伴随属性），不会和行错开。
   */
  const confirmOf = (x: number): number => {
    const current = state.value
    if (
      layout == null
      || current.side !== layout.side
      || current.cover !== options().sides[layout.side] - 1
      || !options().canConfirm(layout.side)
    ) {
      return 0
    }
    return confirmProgress(layout, x)
  }

  /** 共享拖动停在了某个停靠点上：行在那里落定。 */
  const landed = (index: number): void => {
    if (layout == null)
      return
    const stop = stopAt(layout, index)
    if (stop === 'out') {
      // 触发后停在外面（`hasRemoval`），除非触发已经让行弹回了。
      if (state.value.phase === 'settling')
        setState({ cover: state.value.cover, isArmed: false, phase: 'held', side: layout.side })
      return
    }
    setState(stop === 'rest' ? IDLE_STATE : { cover: null, isArmed: false, phase: 'resting', side: layout.side })
  }

  /**
   * 让行落在一个停靠点上，落定时进入 `phase`。除非被打断（拖动接住了行，或另一次落位开始），
   * 共享拖动会报告落定（onSettle）。
   */
  const settle = (
    target: SwipeLayout,
    stop: Stop,
    phase: 'idle' | 'resting' | 'held',
    settleOptions: SwipeSettleOptions = {},
  ): MotionHandle | null => {
    if (snap == null)
      return null
    layout = target
    setState({ cover: settleOptions.cover ?? null, isArmed: false, landing: phase, phase: 'settling', side: target.side })
    // 没指定就用 UIKit 的 settle 弹簧；触控板故意指定成 undefined：用共享拖动自己的。
    const spring = 'spring' in settleOptions ? settleOptions.spring : SWIPE.settle
    snap.setSnapPoints(stopsOf(target))
    return snap.settleTo(stopIndex(target, stop), {
      spring,
      touchRelease: settleOptions.cause === 'release',
      ...(settleOptions.velocity != null ? { velocity: settleOptions.velocity } : {}),
      ...(settleOptions.onPass != null ? { onPass: settleOptions.onPass } : {}),
      ...(settleOptions.start != null ? { start: settleOptions.start } : {}),
    })
  }

  /**
   * 把行朝它走的方向滑出，等内容离开原来的盒子再触发。UIKit 在抬起或点按时就调用处理函数；
   * 等内容离开再触发，应用立即删掉的行就不会在滑到一半时消失。共享拖动在落位曲线第一次把行
   * 带过行边的那一帧回调；减少动效下是它在淡入淡出低谷处落到盒子外的那一帧。先被别的落位或
   * 拖动替换掉的滑出什么都不触发。
   */
  const slideOutThenFire = (
    target: SwipeLayout,
    fire: () => boolean,
    settleOptions: SwipeSettleOptions & { cover: number },
  ): void => {
    const sign = physicalSign(target.side, target.inlineSign)
    settle(target, 'out', 'held', {
      ...settleOptions,
      onPass: {
        offset: sign * target.rowWidth,
        direction: sign,
        call: () => {
          // `fire` 返回 true 表示行停在外面。过了盒子行已经看不见，它的落位就此结束，
          // 之后接手的东西（比如列表的退场）看到的是静止的行。
          if (fire())
            snap?.finishSettle()
        },
      },
    })
  }

  /** 确认的全滑：最外侧操作盖着行原来的位置滑出，行离开时触发，然后停在外面或弹回。 */
  const slideOutAndFire = (
    target: SwipeLayout,
    cause: SettleCause,
    motion: Pick<SwipeSettleOptions, 'velocity' | 'spring'> = {},
  ): void => {
    const cover = options().sides[target.side] - 1
    slideOutThenFire(target, () => {
      if (options().fireOutermost(target.side))
        return true
      settle(target, 'rest', 'idle', { cause, ...motion, cover })
      return false
    }, { cause, ...motion, cover })
  }

  const blurIntoContent = (): void => {
    const element = root()
    if (element != null && element.contains(element.ownerDocument.activeElement))
      focusRowContent(element)
  }

  /**
   * 合上开着的行。在输入事件自己的任务里请求时（按键、按下、轻点）传 `'next-frame'`：
   * 合上从那个任务之后的第一帧开始，同一事件后面占住主线程的监听器只会推迟它，不会让它跳进曲线中途。
   */
  close = (start?: 'next-frame'): void => {
    if (!isOpen() || layout == null)
      return
    blurIntoContent()
    settle(layout, 'rest', 'idle', start != null ? { start } : {})
  }

  const activateEntry = (fire: () => void, holdsOut: boolean, cover: number): void => {
    // 从让行停开的那次松手起，不只是停稳以后。
    if (!isOpen() || layout == null)
      return
    blurIntoContent()
    // 操作在它的按下或按键自己的任务里被激活。
    if (holdsOut) {
      slideOutThenFire(layout, () => {
        fire()
        return true
      }, { cause: 'other', start: 'next-frame', cover })
      return
    }
    fire()
    settle(layout, 'rest', 'idle', { start: 'next-frame', cover })
  }

  const model = createSwipeDragModel({
    root,
    snap: () => snap,
    options,
    state: () => state.value,
    setState,
    setLayout: (next) => {
      layout = next
    },
    landedOn: () => landedOn,
    travelNow: target => Math.max(0, presentedX() * physicalSign(target.side, target.inlineSign)),
    settle,
    slideOutAndFire,
  })

  // 根一出现就在它上面建共享拖动：触控板分流、pan、吸附拖动和动画器。根的一生只有一个。
  watch(root, (element, _previous, onCleanup) => {
    if (element == null)
      return
    const drag = createSnapDrag(element, {
      axis: 'x',
      snapPoints: [0],
      // 位移，以及在同一个动画里从它算出的全滑确认进度（面板两个都读）。
      customProperty: {
        name: SWIPE_TRAVEL_PROPERTY,
        syntax: '<length>',
        companion: { name: SWIPE_CONFIRM_PROPERTY, syntax: '<number>', map: confirmOf },
      },
      // 落位在合成器上移动行的各个部件。
      compositorParts: () => settleParts(element, layout, confirmOf),
      onSettle: landed,
      pan: {
        // 手指、笔和触控板的双指滚动能横滑行；鼠标拖动和鼠标滚轮的刻度不能。
        allowedPointerTypes: ['touch', 'pen'],
        allowedScrollTypes: ['continuous'],
        hysteresis: SWIPE.claim,
        maximumNumberOfTouches: 1,
        name: 'Item.swipe',
        // 拖动移动行：按住期间关掉文字选择和长按菜单。
        selectionLock: lockSelection,
        // 每个触摸落下时宿主在这里递一次。这里记下按在开着那一侧最外侧操作上的按下，
        // 让这次按压能确认全滑。
        shouldReceiveTouch: (_pan, touch) => {
          const current = state.value
          const { target } = touch
          const outer = sidePanelOf(element, current.side)?.entries.at(-1)
          landedOn = touch.scrollType == null && isSwipeOpen(current) && target instanceof Node && outer?.contains(target) === true
            ? current.side
            : null
          return true
        },
        shouldBegin: (pan) => {
          // 不是唯一按下的手指就是在双指缩放，哪怕第一根手指不在这一行上：页面去缩放。
          if (getGestureHost(element.ownerDocument).fingersDown() > 1)
            return false
          if (state.value.phase === 'held')
            return false
          const inlineSign: 1 | -1 = isRtlElement(element) ? -1 : 1
          return Math.abs(presentedX()) > AT_REST_PX
            || options().sides[sideFor(pan.totalTranslation().x, inlineSign)] > 0
        },
      },
      model: {
        begin: model.begin,
        move: model.move,
        release: model.release,
        cancel: model.cancel,
      },
    })
    snap = drag
    onCleanup(() => {
      snap = null
      drag.destroy()
      // 根比横滑活得久：把它自己的样式还给它。
      element.style.removeProperty(SWIPE_TRAVEL_PROPERTY)
      element.style.removeProperty(SWIPE_CONFIRM_PROPERTY)
    })
  }, { immediate: true, flush: 'post' })

  // 在开着的行自己的内容上轻点会合上它、不激活任何东西，和 UIKit 的收起一样。轻点在抬起时识别；
  // 宿主替行吞掉它本来会产生的点击。鼠标和笔的按下照常到达行；面板里的操作保留自己的点按，
  // 合着的行永远不会把触摸递给这个识别器。
  useGestureRecognizer(
    root,
    () => new TapGestureRecognizer({
      name: 'item-swipe-dismiss',
      allowedPointerTypes: ['touch'],
      shouldReceiveTouch: (_tap, touch) =>
        isOpen() && !(touch.target instanceof Element && touch.target.closest('[data-swipe-panel]') != null),
    }),
    (tap) => {
      if (tap.state === 'ended')
        close('next-frame')
    },
  )

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isOpen()) {
      event.stopPropagation()
      close('next-frame')
    }
  }

  // 开着时失去横滑的行重新接受按压，丢掉它的合上订阅和飞行中的领先量帧。
  onScopeDispose(() => {
    stopCloses?.()
    stopCloses = null
    model.dispose()
    const element = root()
    if (element != null)
      setPressHeld(element, false)
  })

  return { state, activateEntry, close: start => close(start), onKeyDown }
}
