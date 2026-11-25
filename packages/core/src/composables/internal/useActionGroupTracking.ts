import type { MaybeRefOrGetter, Ref } from 'vue'
import { getCurrentScope, onScopeDispose, toValue, watch } from 'vue'
import { createActionGroupTracker, GROUP_PRESS_POINTERS, isTrackedByGroup, PRESS_GROUP_ITEM_ATTRIBUTE, resolveGroupTouch } from './actionGroupTracker.js'
import { msSinceInput } from './inputAge.js'
import { PRESS_ONSET_MS, PRESS_SLOP_PX } from './pressGesture.js'
import { isInsideScrollView } from './scrollView.js'

export { GROUP_PRESS_POINTERS, PRESS_GROUP_ITEM_ATTRIBUTE, pressGroupItemProps } from './actionGroupTracker.js'

export interface ActionGroupTrackingOptions {
  /** 只在为真时跟踪。组件一般传「主要指针是粗指针」并且组没禁用。 */
  isEnabled: MaybeRefOrGetter<boolean>
  /**
   * 组画了触控热区（`useTouchHitArea` 加 `GROUP_HIT_AREA`）时为真：手指按在组自己或热区上，
   * 落在某个动作朝 44px 长出的范围里，就算那个动作；滑动时同样。
   */
  growsTargets?: MaybeRefOrGetter<boolean>
}

const DISABLED = ':disabled, [aria-disabled="true"]'

/** iOS 的 WebKit 点按钮不给它焦点；其他浏览器给。滑动后焦点跟着「点那个按钮会怎样」走。 */
function tapFocuses(view: Window | null): boolean {
  const nav = view?.navigator
  if (nav == null)
    return true
  const isIos = /iPad|iPhone|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1)
  return !isIos
}

/**
 * 内部用：让手指或笔在 `rootRef` 里那些带组标记的动作之间滑动，松手时执行手指下的那个。
 *
 * - 按下时手指下的动作立刻高亮（滚动视图里等 150ms，挪远了就交给滚动）。
 * - 高亮跟着手指走；在动作之间或组外没有高亮，松手什么都不执行。
 * - 松手执行的是手指下的那个动作，走它自己的 click；浏览器补发的那个 click 被吞掉。
 * - 第二根手指、pointercancel、窗口失焦，都直接结束，什么都不执行。
 * - 鼠标不跟踪，保持原生按钮的行为。
 */
export function useActionGroupTracking(rootRef: Readonly<Ref<HTMLElement | null>>, options: ActionGroupTrackingOptions): void {
  const tracker = createActionGroupTracker()
  let pointerId: number | null = null
  let pointerType = 'touch'
  let focusedBefore: Element | null = null
  let beganOn: HTMLElement | null = null
  /** 滚动视图里还没认定是按压时，等待中的定时器和落点。 */
  let pending: { timer: ReturnType<typeof setTimeout>, x: number, y: number, target: Node } | null = null

  function stopListening(): void {
    window.removeEventListener('pointermove', onMove, true)
    window.removeEventListener('pointerup', onUp, true)
    window.removeEventListener('pointercancel', onCancel, true)
    window.removeEventListener('pointerdown', onOtherDown, true)
    window.removeEventListener('blur', onCancel)
  }

  function clearPending(): void {
    if (pending != null)
      clearTimeout(pending.timer)
    pending = null
  }

  function finish(): void {
    clearPending()
    stopListening()
    pointerId = null
    beganOn = null
    focusedBefore = null
  }

  function begin(root: HTMLElement, x: number, y: number, target: Node): void {
    beganOn = tracker.begin(root, pointerType, x, y, target, pointerType === 'touch' && toValue(options.growsTargets) === true)
  }

  function onMove(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      return
    if (pending != null) {
      // 还在等：手指挪远了就是在滚动，交给滚动。
      if (Math.hypot(event.clientX - pending.x, event.clientY - pending.y) > PRESS_SLOP_PX)
        finish()
      return
    }
    tracker.move(event.clientX, event.clientY)
  }

  function onUp(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      return
    const root = rootRef.value
    if (pending != null && root != null) {
      // 太快的轻点，没等到高亮就抬手：按落点认这一下。
      const { x, y, target } = pending
      clearPending()
      begin(root, x, y, target)
    }
    const lifted = tracker.highlighted
    const doc = root?.ownerDocument
    const clickFocuses = pointerType === 'touch' ? tapFocuses(doc?.defaultView ?? null) : beganOn != null && focusedBefore === beganOn
    // 先给焦点再执行，和原生点击的顺序一样，点击里挪走焦点的结果能留下。
    if (clickFocuses && lifted != null && lifted.isConnected && !lifted.matches(DISABLED) && doc?.activeElement !== lifted)
      lifted.focus({ preventScroll: true })
    tracker.end()
    finish()
  }

  function onCancel(): void {
    tracker.cancel()
    finish()
  }

  /** 又来一根手指：捏合或双指滚动不是按压，结束这一次，什么都不执行。 */
  function onOtherDown(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      onCancel()
  }

  function onPointerDown(event: PointerEvent): void {
    const root = rootRef.value
    if (root == null || !toValue(options.isEnabled) || pointerId != null)
      return
    if (!GROUP_PRESS_POINTERS.includes(event.pointerType) || !event.isPrimary || event.button > 0)
      return
    const target = event.target
    if (!(target instanceof Element))
      return
    const member = target === root && event.pointerType === 'touch' && toValue(options.growsTargets) === true
      // 按在组的热区上：归最近的、长出范围盖住这一点的动作。
      ? resolveGroupTouch(root, event.pointerType, event.clientX, event.clientY)
      : target.closest<HTMLElement>(`[${PRESS_GROUP_ITEM_ATTRIBUTE}]`)
    // 只接按在组跟踪的可用动作上的按压。别的（菜单触发器、禁用的成员）保留自己的点击。
    if (member == null || !root.contains(member) || member.matches(DISABLED) || !isTrackedByGroup(member, event.pointerType))
      return
    pointerId = event.pointerId
    pointerType = event.pointerType
    focusedBefore = root.ownerDocument.activeElement
    window.addEventListener('pointermove', onMove, true)
    window.addEventListener('pointerup', onUp, true)
    window.addEventListener('pointercancel', onCancel, true)
    window.addEventListener('pointerdown', onOtherDown, true)
    window.addEventListener('blur', onCancel)
    const { clientX: x, clientY: y } = event
    if (!isInsideScrollView(member)) {
      begin(root, x, y, target)
      return
    }
    // 滚动视图里先等内容触摸延时，从触摸本身算起。
    const wait = Math.max(0, PRESS_ONSET_MS - msSinceInput(event.timeStamp, event))
    pending = {
      x,
      y,
      target,
      timer: setTimeout(() => {
        pending = null
        if (rootRef.value != null)
          begin(rootRef.value, x, y, target)
      }, wait),
    }
  }

  watch(
    () => (toValue(options.isEnabled) ? rootRef.value : null),
    (root, _previous, onCleanup) => {
      if (root == null)
        return
      root.addEventListener('pointerdown', onPointerDown)
      onCleanup(() => {
        root.removeEventListener('pointerdown', onPointerDown)
        // 关掉跟踪或卸载：正在跟踪的按压作废，淡出提前结束。
        tracker.cancel()
        tracker.dispose()
        finish()
      })
    },
    { immediate: true, flush: 'post' },
  )

  if (getCurrentScope() != null) {
    onScopeDispose(() => {
      tracker.dispose()
      finish()
    })
  }
}
