/**
 * @file usePageControlInput.ts
 * @input 控件的元素、页码状态、要页的函数和按住的样子；core 的手势识别器
 * @output usePageControlInput：点按翻一页、拖动换页、越过边缘自动连翻
 * @position PageControl 的输入层。识别器接所有指针：鼠标和手指一样点按、拖动，
 *   只是鼠标下按着整排实际画出的点来算。
 */

import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { DotCenter, WindowGeometry } from './pageControlGeometry'
import type { PageRequests } from './pageControlRequest'
import {
  isRtlElement,
  LongPressGestureRecognizer,
  PanGestureRecognizer,
  TapGestureRecognizer,
  useGestureRecognizer,
} from '@astryx-vue/core/internal/touch'
import { onScopeDispose } from 'vue'
import { dotCenters, nearestDot, windowGeometry } from './pageControlGeometry'
import { clampPage, jogInterval, pageControlLayout, PITCH, scrubTarget, tapTarget } from './pageControlModel'
import { pageControl as PC } from './pageControlTable'

export interface PageControlInput {
  /** 触屏呈现（粗指针）开着。 */
  isTouch: Readonly<Ref<boolean>>
  root: Readonly<ShallowRef<HTMLElement | null>>
  strip: Readonly<ShallowRef<HTMLElement | null>>
  pages: ComputedRef<number>
  /** 当前页，从 0 数起。 */
  current: ComputedRef<number>
  windowStart: ComputedRef<number>
  requests: PageRequests
  /** 显示按住的样子（垫片、其余点变暗），只在触屏呈现下有。 */
  showHeld: () => void
  /** 收起按住的样子。 */
  hideHeld: () => void
  /** 拖动进行中：鼠标下被裁的整排在松手前不动。 */
  isScrubbing: Ref<boolean>
}

/** 一次按压的状态，在手势和计时器之间共用。 */
interface Press {
  startX: number
  lastX: number
  isScrubbing: boolean
  /** 拖动开始时读一次的窗口几何，手指移动时不读布局。 */
  geometry: WindowGeometry | null
  /** 鼠标下整排每个点的中心，拖动开始时读一次。 */
  centers: DotCenter[]
  interactTimer: number
  jogTimer: number
  /** 手指越过边缘、或上一步连翻到期的时刻，ms。 */
  jogFrom: number | null
  /** 等着的那一步连翻什么时候跑，ms。 */
  jogDue: number
}

/**
 * 按在控件上的指针（手指或鼠标）在 10px 内定下来，所以竖着起手的滑动还是页面的滚动：
 * - 横向拖动从 10px 起开始，离落点 16px 后变成拖动换页；竖着起手的拖动让它失败；
 * - 按住不动 155ms（UIPageControl 的交互延迟）后从那里同样拖动换页，手指下显示垫片；
 * - 点按翻一页。
 * 谁先开始谁拿下这次按压，其余的失败。16px 从落点量起，和 UIKit 一样。
 */
export function usePageControlInput(input: PageControlInput): void {
  const { isTouch, root, strip, pages, current, windowStart, requests } = input
  const view = (): Window => root.value?.ownerDocument.defaultView ?? window
  const press: Press = {
    startX: 0,
    lastX: 0,
    isScrubbing: false,
    geometry: null,
    centers: [],
    interactTimer: 0,
    jogTimer: 0,
    jogFrom: null,
    jogDue: 0,
  }

  function stopJog(): void {
    if (press.jogTimer !== 0) {
      view().clearTimeout(press.jogTimer)
      press.jogTimer = 0
    }
    press.jogFrom = null
  }

  /**
   * 带窗口的控件，手指越过内容边缘时页码自己往前走。每一步在上一步到期（或手指越过边缘）
   * 之后 1 / 速率 跑，速率跟着手指此刻越过多远，越远下一步来得越快。步子从到期时刻算起，
   * 计时器晚了也不会拖慢；停顿超过一步之后从晚到的那步重新算，不会连跳。
   */
  function jog(): void {
    const geometry = press.geometry
    if (geometry == null || !press.isScrubbing || !pageControlLayout(pages.value).isWindowed) {
      stopJog()
      return
    }
    const beyond = geometry.past(press.lastX)
    const direction = Math.sign(beyond)
    const interval = direction === 0 ? Infinity : jogInterval(Math.abs(beyond), direction)
    if (!Number.isFinite(interval)) {
      stopJog()
      return
    }
    const now = performance.now()
    press.jogFrom ??= now
    const due = press.jogFrom + interval * 1000
    if (press.jogTimer !== 0) {
      if (Math.abs(due - press.jogDue) < 1)
        return
      view().clearTimeout(press.jogTimer)
    }
    press.jogDue = due
    press.jogTimer = view().setTimeout(() => {
      press.jogTimer = 0
      const ranAt = performance.now()
      press.jogFrom = ranAt - due > interval * 1000 ? ranAt : due
      const step = Math.sign(geometry.past(press.lastX))
      if (step !== 0) {
        const from = requests.pending?.page ?? current.value
        requests.request(clampPage(from + step, pages.value), 'other')
      }
      jog()
    }, Math.max(0, due - now))
  }

  function scrubTo(x: number): void {
    if (!isTouch.value) {
      // 鼠标下：整排里离指针最近的点；两头不连翻。
      const nearest = nearestDot(press.centers, x)
      if (nearest != null)
        requests.request(clampPage(nearest.page, pages.value), 'other')
      return
    }
    const geometry = press.geometry
    if (geometry == null)
      return
    if (geometry.past(x) === 0 || !pageControlLayout(pages.value).isWindowed) {
      stopJog()
      requests.request(scrubTarget(geometry.along(x), pages.value, windowStart.value), 'other')
    }
    jog()
  }

  function finish(): void {
    if (press.interactTimer !== 0) {
      view().clearTimeout(press.interactTimer)
      press.interactTimer = 0
    }
    stopJog()
    press.isScrubbing = false
    press.geometry = null
    press.centers = []
    input.hideHeld()
    input.isScrubbing.value = false
  }

  function begin(startX: number): void {
    press.startX = startX
    press.lastX = startX
    press.isScrubbing = false
  }

  function track(x: number): void {
    press.lastX = x
    const el = root.value
    if (!press.isScrubbing && el != null && Math.abs(x - press.startX) >= PC.scrubStartDistance && pages.value > 1) {
      press.isScrubbing = true
      press.geometry = windowGeometry(el, pages.value)
      press.centers = isTouch.value ? [] : dotCenters(strip.value)
      input.isScrubbing.value = true
      input.showHeld()
    }
    if (press.isScrubbing)
      scrubTo(x)
  }

  /** 点按，或还没拖起来就松开的拖动和按住：朝手指落在当前点哪一侧翻一页。 */
  function step(x: number): void {
    const el = root.value
    if (el == null || pages.value < 2)
      return
    if (!isTouch.value) {
      // 鼠标下：按画出来的整排，看指针在当前点哪一侧。
      const dot = strip.value?.querySelector(`[data-page="${current.value}"]`)
      if (dot == null)
        return
      const box = dot.getBoundingClientRect()
      requests.request(tapTarget(x, box.left + box.width / 2, current.value, pages.value, isRtlElement(el)), 'tap')
      return
    }
    const slot = current.value - (pageControlLayout(pages.value).isWindowed ? windowStart.value : 0)
    const along = windowGeometry(el, pages.value).along(x)
    requests.request(tapTarget(along, slot * PITCH, current.value, pages.value, false), 'tap')
  }

  function lift(x: number): void {
    if (!press.isScrubbing)
      step(x)
    finish()
  }

  /** 识别器第一个跟踪的触点落在哪里，没有就用 `fallback`。 */
  const landingX = (recognizer: { trackedTouches: ReadonlyArray<{ startX: number }> }, fallback: number): number =>
    recognizer.trackedTouches[0]?.startX ?? fallback

  useGestureRecognizer(root, () => new PanGestureRecognizer({ direction: 'horizontal' }), (pan) => {
    const { x } = pan.location()
    switch (pan.state) {
      case 'began':
        begin(landingX(pan, x - pan.travelAtBegan.x))
        press.interactTimer = view().setTimeout(() => {
          press.interactTimer = 0
          input.showHeld()
        }, PC.interactionDelayMs)
        track(x)
        break
      case 'changed':
        track(x)
        break
      case 'ended':
        lift(x)
        break
      case 'cancelled':
        finish()
        break
      default:
        break
    }
  })

  useGestureRecognizer(root, () => new LongPressGestureRecognizer({ minimumPressDuration: PC.interactionDelayMs }), (hold) => {
    const { x } = hold.location()
    switch (hold.state) {
      case 'began':
        begin(landingX(hold, x))
        // 按住的样子在按住开始的这个任务里就画上：Vue 的更新排在本任务的微任务里，
        // 不会等到页面其他任务之后。
        input.showHeld()
        break
      case 'changed':
        track(x)
        break
      case 'ended':
        lift(x)
        break
      case 'cancelled':
        finish()
        break
      default:
        break
    }
  })

  useGestureRecognizer(root, () => new TapGestureRecognizer(), (tap) => {
    if (tap.state === 'ended')
      step(tap.location().x)
  })

  // 计时器随控件结束。
  onScopeDispose(() => {
    const owner = view()
    owner.clearTimeout(press.interactTimer)
    owner.clearTimeout(press.jogTimer)
  })
}
