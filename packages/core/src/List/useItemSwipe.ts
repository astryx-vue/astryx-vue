import type { ComputedRef, Ref } from 'vue'
import type { ItemSwipeAction, ItemSwipeBehavior, ItemSwipeSide } from './types.js'
import { onBeforeUnmount, ref } from 'vue'

const AXIS_LOCK_PX = 10
const REST_FRACTION = 0.5
const COMMIT_PAST_PX = 48
const COMMIT_FRACTION = 0.5
const FLING_VELOCITY = 0.6
const FLING_MIN_PX = 44
const OVERSHOOT_PX = 24
const SETTLE_MS = 200

export interface ItemSwipeBindings {
  phase: Ref<'idle' | 'dragging' | 'resting' | 'settling' | 'held'>
  onPointerDown: (event: PointerEvent) => void
  onClickCapture: (event: MouseEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
  activate: (action: ItemSwipeAction) => void
}

/**
 * 触摸横滑露出行内操作。鼠标不开始拖动；竖着拖留给外面的滚动。
 * `reveal` 松手后停在打开的位置，长拖或甩动触发最外侧。
 * `commit` 松手越过阈值就滑出并触发最外侧，没有停住的状态。
 */
export function useItemSwipe(options: {
  root: Ref<HTMLElement | null>
  enabled: ComputedRef<boolean>
  behavior: ComputedRef<ItemSwipeBehavior>
  leading: ComputedRef<ItemSwipeAction[]>
  trailing: ComputedRef<ItemSwipeAction[]>
}): ItemSwipeBindings {
  const phase = ref<'idle' | 'dragging' | 'resting' | 'settling' | 'held'>('idle')
  let pointerId: number | null = null
  let originX = 0
  let originY = 0
  let claimed: boolean | null = null
  let direction = 1
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let suppressClick = false
  let settleTimer: ReturnType<typeof setTimeout> | undefined

  function write(travel: number, duration: string): void {
    const root = options.root.value
    if (!root)
      return
    root.style.setProperty('--_item-swipe-dir', String(direction))
    root.style.setProperty('--_item-swipe-travel', String(travel))
    root.style.setProperty('--_item-swipe-duration', duration)
  }

  function panelWidth(side: ItemSwipeSide): number {
    const root = options.root.value
    const panel = root?.querySelector<HTMLElement>(`[data-side="${side}"]`)
    return panel?.offsetWidth || 72
  }

  function clearSettle(): void {
    if (settleTimer != null)
      clearTimeout(settleTimer)
    settleTimer = undefined
  }

  function springTo(travel: number, next: 'idle' | 'resting' | 'held'): void {
    clearSettle()
    phase.value = 'settling'
    write(travel, `${SETTLE_MS}ms`)
    settleTimer = setTimeout(() => {
      phase.value = next
      if (next === 'idle')
        write(0, '0s')
    }, SETTLE_MS)
  }

  function stopTracking(): void {
    pointerId = null
    claimed = null
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('pointercancel', onPointerCancel)
    }
  }

  function onPointerMove(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      return
    const dx = event.clientX - originX
    const dy = event.clientY - originY
    if (claimed == null) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX)
        return
      if (Math.abs(dy) > Math.abs(dx)) {
        stopTracking()
        return
      }
      claimed = true
      phase.value = 'dragging'
      write(0, '0s')
    }
    event.preventDefault()
    const now = event.timeStamp
    if (lastTime > 0)
      velocity = (event.clientX - lastX) / Math.max(1, now - lastTime)
    lastX = event.clientX
    lastTime = now
    let logical = dx * direction
    if (logical > 0 && options.leading.value.length === 0)
      logical = 0
    if (logical < 0 && options.trailing.value.length === 0)
      logical = 0
    const side: ItemSwipeSide = logical >= 0 ? 'leading' : 'trailing'
    const limit = panelWidth(side)
    const distance = Math.abs(logical)
    const resisted = distance > limit ? limit + (distance - limit) * 0.35 : distance
    write(Math.sign(logical || 1) * resisted, '0s')
  }

  function currentTravel(): number {
    const raw = options.root.value?.style.getPropertyValue('--_item-swipe-travel')
    return Number(raw) || 0
  }

  function actionsFor(side: ItemSwipeSide): ItemSwipeAction[] {
    return side === 'leading' ? options.leading.value : options.trailing.value
  }

  function finish(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      return
    const travel = currentTravel()
    const didDrag = claimed === true
    stopTracking()
    if (!didDrag)
      return
    suppressClick = true
    setTimeout(() => {
      suppressClick = false
    }, 400)
    const side: ItemSwipeSide = travel >= 0 ? 'leading' : 'trailing'
    const actions = actionsFor(side)
    const outermost = actions[actions.length - 1]
    const distance = Math.abs(travel)
    const width = panelWidth(side)
    const rowWidth = options.root.value?.offsetWidth ?? width
    const logicalVelocity = velocity * direction
    const flung = Math.sign(logicalVelocity) === Math.sign(travel) && Math.abs(logicalVelocity) > FLING_VELOCITY && distance > FLING_MIN_PX
    if (options.behavior.value === 'commit') {
      const commitAt = Math.max(width + COMMIT_PAST_PX, rowWidth * COMMIT_FRACTION)
      if ((distance >= commitAt || flung) && outermost && !outermost.isDisabled) {
        outermost.onActivate()
        springTo(Math.sign(travel || 1) * (rowWidth + OVERSHOOT_PX), outermost.hasRemoval ? 'held' : 'idle')
        return
      }
      springTo(0, 'idle')
      return
    }
    if (flung && outermost && !outermost.isDisabled && distance > width) {
      outermost.onActivate()
      springTo(Math.sign(travel || 1) * (rowWidth + OVERSHOOT_PX), outermost.hasRemoval ? 'held' : 'idle')
      return
    }
    if (distance >= width * REST_FRACTION)
      springTo(Math.sign(travel || 1) * width, 'resting')
    else
      springTo(0, 'idle')
  }

  function onPointerUp(event: PointerEvent): void {
    finish(event)
  }

  function onPointerCancel(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      return
    stopTracking()
    springTo(0, 'idle')
  }

  function onPointerDown(event: PointerEvent): void {
    if (!options.enabled.value || event.pointerType !== 'touch' || phase.value === 'held')
      return
    const target = event.target
    if (target instanceof Element && target.closest('button, a, input, textarea, select'))
      return
    pointerId = event.pointerId
    originX = event.clientX
    originY = event.clientY
    lastX = event.clientX
    lastTime = event.timeStamp
    velocity = 0
    claimed = null
    direction = getComputedStyle(options.root.value ?? document.documentElement).direction === 'rtl' ? -1 : 1
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointercancel', onPointerCancel)
  }

  function onClickCapture(event: MouseEvent): void {
    if (!suppressClick)
      return
    const target = event.target
    if (target instanceof Element && target.closest('.astryx-item__swipe-action'))
      return
    event.preventDefault()
    event.stopPropagation()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && (phase.value === 'resting' || phase.value === 'dragging'))
      springTo(0, 'idle')
  }

  function activate(action: ItemSwipeAction): void {
    if (action.isDisabled)
      return
    action.onActivate()
    if (action.hasRemoval) {
      const rowWidth = options.root.value?.offsetWidth ?? 0
      const travel = currentTravel()
      springTo(Math.sign(travel || 1) * (rowWidth + OVERSHOOT_PX), 'held')
      return
    }
    springTo(0, 'idle')
  }

  onBeforeUnmount(() => {
    stopTracking()
    clearSettle()
  })

  return { phase, onPointerDown, onClickCapture, onKeyDown, activate }
}
