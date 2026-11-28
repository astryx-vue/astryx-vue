/**
 * @file backSwipes.ts
 * @input core 的手势识别器和 UIKit 手势表（`@astryx-vue/core/internal/touch`），
 *   navigationMotion.ts 和 navigationTransition.ts 里滑动的数值和松手判断
 * @output useBackSwipes：UIKit 的两种滑动返回，从屏幕前沿开始的，和从内容任意处开始的（iOS 26），
 *   通过 BackSwipeStack 驱动栈
 * @position NavigationStack 的滑动返回，只在 NavigationStack.vue 里用。
 */

import type { MaybeRefOrGetter, Ref } from 'vue'
import {
  PanGestureRecognizer,
  ScreenEdgePanGestureRecognizer,
  UIKIT_GESTURES,
  useGestureRecognizer,
} from '@astryx-vue/core/internal/touch'
import { onMounted, shallowRef, toValue } from 'vue'
import { navigation } from './navigationMotion'
import { popVelocity, progressFromTravel, shouldFinishPop } from './navigationTransition'

/** 滑动返回从栈里读什么、驱动什么。 */
export interface BackSwipeStack {
  /** 卡片区域的宽度（CSS px）。 */
  width: () => number
  /** 栈的书写方向。 */
  direction: () => 'ltr' | 'rtl'
  /** 退出一屏要在哪两屏之间移动；没有可退的时是 null。 */
  screens: () => { top: string, under: string } | null
  /** 停下正在动的东西，返回接着走的进度。 */
  grab: (top: string, under: string) => number
  /** 把两屏放到某个进度（0：上面一屏在原位，1：已退出）。 */
  setProgress: (progress: number, top: string, under: string) => void
  /** 两屏现在的进度。 */
  progress: () => number
  /** 手指抬起（或滑动被取消）：按松手速度（每秒几个宽度）提交退出，或弹回去。 */
  release: (top: string, under: string, finish: boolean, velocity: number) => void
}

/**
 * 内容滑动在平移手势自己的阈值处认领横向拖动，这时还来得及让浏览器放手；浏览器自己的
 * 容差一过就不再问了。内容滑动要到 UIKit 的 27px 才开始移动，中间这段是死区。
 */
const CONTENT_CLAIM_PX = UIKIT_GESTURES.pan.hysteresis.value
const CONTENT_DEAD_ZONE_PX = Math.max(0, navigation.contentPopHysteresis - CONTENT_CLAIM_PX)

/** 从主屏幕打开的网页应用，没有浏览器自己的滑动返回。 */
function isStandaloneWebApp(): boolean {
  return typeof navigator !== 'undefined'
    && (navigator as Navigator & { standalone?: boolean }).standalone === true
}

/** 在宽 `viewportWidth` 的视口里，从横坐标 x 开始的触摸是否落在前沿的边缘带里。 */
function startsInEdgeBand(x: number, direction: 'ltr' | 'rtl', viewportWidth: number): boolean {
  const band = UIKIT_GESTURES.screenEdgePan.edgeRegion.value
  return direction === 'rtl' ? x >= viewportWidth - band : x <= band
}

/**
 * 栈的滑动返回：边缘滑动挂在 `container` 上，内容滑动挂在 `cards` 上。两者都驱动
 * `stack()` 返回的栈（每次触摸事件时读，总能看到最新的渲染）。`isEnabled` 为真
 * （栈能退出且允许交互式退出）时才运行。
 */
export function useBackSwipes(
  container: Ref<HTMLElement | null>,
  cards: Ref<HTMLElement | null>,
  stack: () => BackSwipeStack,
  options: { isEnabled: MaybeRefOrGetter<boolean> },
): void {
  let swipe: {
    start: number
    top: string
    under: string
    /** 手指已经走过内容滑动的死区。 */
    isPastDeadZone: boolean
  } | null = null

  const onSwipe = (recognizer: PanGestureRecognizer, deadZone: number): void => {
    const current = stack()
    const screens = current.screens()
    if (screens == null)
      return
    const width = current.width()
    const direction = current.direction()
    const sign = direction === 'rtl' ? -1 : 1
    switch (recognizer.state) {
      case 'began': {
        const start = current.grab(screens.top, screens.under)
        swipe = { start, ...screens, isPastDeadZone: deadZone <= 0 }
        current.setProgress(start, screens.top, screens.under)
        break
      }
      case 'changed': {
        if (swipe == null)
          return
        const along = sign * recognizer.translation().x
        if (along >= deadZone)
          swipe.isPastDeadZone = true
        // 死区里屏幕不动。过了死区，往回拉过起点时屏幕带着阻力跟随（progressFromTravel）。
        const travel = swipe.isPastDeadZone ? along - deadZone : 0
        current.setProgress(
          progressFromTravel(swipe.start, sign * travel, width, direction),
          swipe.top,
          swipe.under,
        )
        break
      }
      case 'ended':
      case 'cancelled': {
        const ending = swipe
        swipe = null
        if (ending == null)
          return
        const p = current.progress()
        // 平移手势自己的松手速度：手指抬起前停住过，core 的速度跟踪读出 0。
        const v = recognizer.state === 'ended'
          ? popVelocity(recognizer.velocity().x, width, direction)
          : 0
        current.release(ending.top, ending.under, recognizer.state === 'ended' && shouldFinishPop(p, v), v)
        break
      }
      default:
        break
    }
  }

  // 服务端渲染和首帧按浏览器标签页算：那里的前沿是浏览器自己的滑动返回。
  const browserOwnsEdge = shallowRef(true)
  onMounted(() => {
    browserOwnsEdge.value = !isStandaloneWebApp()
  })
  const edge = useGestureRecognizer(
    container,
    () => new ScreenEdgePanGestureRecognizer({
      edges: ['leading'],
      // 公开的名字，应用代码可以靠它和这个手势建立关系（gestureNamed）。
      name: 'NavigationStack.backSwipe',
    }),
    recognizer => onSwipe(recognizer, 0),
    { isEnabled: () => toValue(options.isEnabled) && !browserOwnsEdge.value },
  )
  // iOS 26 从内容任意处开始的滑动返回。它等边缘滑动失败，边缘带外的触摸会立刻让边缘滑动失败。
  useGestureRecognizer(
    cards,
    () => {
      const recognizer = new PanGestureRecognizer({
        name: 'NavigationStack.contentBackSwipe',
        direction: 'right',
        hysteresis: CONTENT_CLAIM_PX,
        maximumNumberOfTouches: 1,
        // 手指下还能往这边滚的横向滚动容器留着这次拖动（UIKit 的滚动视图也这样）。
        scrollEdge: true,
        shouldReceiveTouch: (_recognizer, touch) => {
          const direction = stack().direction()
          // 退出朝尾部方向，每次触摸时读：栈挂着的时候书写方向也可能变。
          recognizer.direction = direction === 'rtl' ? 'left' : 'right'
          const view = container.value?.ownerDocument.defaultView
          return !(
            touch.pointerType === 'touch'
            && !isStandaloneWebApp()
            && startsInEdgeBand(touch.startX, direction, view?.innerWidth ?? 0)
          )
        },
      })
      return recognizer.requireToFail(edge)
    },
    recognizer => onSwipe(recognizer, CONTENT_DEAD_ZONE_PX),
    { isEnabled: options.isEnabled },
  )
}
