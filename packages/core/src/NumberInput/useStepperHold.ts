import type { ShallowRef } from 'vue'
import { onScopeDispose, watch } from 'vue'

type StepDirection = 1 | -1

/**
 * 按住步进按钮的节奏：按下 `delayMs` 后第一次重复，之后每次间隔是上一次的 `acceleration` 倍，
 * 从 `firstIntervalMs` 一路缩到 `minIntervalMs`。
 */
const STEPPER_HOLD = {
  delayMs: 500,
  firstIntervalMs: 250,
  acceleration: 0.9,
  minIntervalMs: 50,
} as const

interface Hold {
  pointerId: number
  timer: ReturnType<typeof setTimeout> | null
  /** 重复走到的数；还没重复过是 `null`。 */
  held: number | null
  intervalMs: number
  /** 字段中途被禁用或设为只读：不再重复，松手也不提交。 */
  isFrozen: boolean
}

export interface StepperHoldOptions {
  /** 重复走到的数。调用方先建好，输入框显示和拒绝提示才能在按住逻辑之前用到它。 */
  heldValue: ShallowRef<number | null>
  /** 按下时的起点：草稿的读数，读不出来就是已提交的值。 */
  base: () => number | null
  /** 从一个数沿方向走一格，走不动返回原数或 `null`。 */
  stepFrom: (current: number | null, direction: StepDirection) => number | null
  /** 禁用或只读。 */
  isLocked: () => boolean
  /** 按住结束，提交一次。 */
  commit: (value: number) => void
}

export interface StepperHold {
  start: (direction: StepDirection, canStep: boolean, event: PointerEvent) => void
  end: (kind: 'release' | 'cancel', pointerId: number) => void
  onContextMenu: () => void
  /** 按住松手后跟着来的那一下 click 不再步进；没有指针的 click（读屏）照常步进。 */
  consumeClick: (event: MouseEvent) => boolean
  cancel: () => void
}

/**
 * 按住步进按钮（鼠标或笔）会重复步进，重复写进输入框的草稿，松手或指针取消时只提交一次。
 * 按下不到 0.5 秒松手是一次点击，立刻步进并提交；手指只保留它那一下点击的单步。
 */
export function useStepperHold(options: StepperHoldOptions): StepperHold {
  const heldValue = options.heldValue
  let hold: Hold | null = null
  let isClickAfterHold = false
  /** 被另一次按下取消的重复按住的指针：它自己松手时仍要吞掉随后的 click。 */
  let cancelledPointerId: number | null = null

  function clearTimer(target: Hold): void {
    if (target.timer != null)
      clearTimeout(target.timer)
    target.timer = null
  }

  /** 结束按住、不提交，并丢掉重复写下的草稿。 */
  function cancel(): void {
    if (hold == null)
      return
    const current = hold
    hold = null
    cancelledPointerId = current.held != null ? current.pointerId : null
    clearTimer(current)
    heldValue.value = null
  }

  watch(options.isLocked, (locked) => {
    if (!locked)
      return
    heldValue.value = null
    if (hold != null) {
      hold.isFrozen = true
      clearTimer(hold)
    }
  }, { flush: 'sync' })

  function start(direction: StepDirection, canStep: boolean, event: PointerEvent): void {
    isClickAfterHold = false
    if (cancelledPointerId === event.pointerId)
      cancelledPointerId = null
    // 任何新的按下都结束正在进行的按住，不管是哪个指针。
    cancel()
    // 步进按钮只在细指针下出现，所以按住的是鼠标或笔；手指只有那一下点击的单步。
    if (event.button !== 0 || event.pointerType === 'touch' || !canStep || options.isLocked())
      return
    const first = options.stepFrom(options.base(), direction)
    if (first == null)
      return
    // 松手时不管指针在哪都结束按住。
    const target = event.currentTarget as HTMLElement | null
    target?.setPointerCapture?.(event.pointerId)
    const current: Hold = { pointerId: event.pointerId, timer: null, held: null, intervalMs: STEPPER_HOLD.firstIntervalMs, isFrozen: false }
    const repeat = (): void => {
      const next = current.held == null ? first : options.stepFrom(current.held, direction)
      // 走到边界就不再重复，松手仍然提交。
      if (next == null || next === current.held) {
        current.timer = null
        return
      }
      current.held = next
      heldValue.value = next
      current.timer = setTimeout(repeat, current.intervalMs)
      current.intervalMs = Math.max(STEPPER_HOLD.minIntervalMs, current.intervalMs * STEPPER_HOLD.acceleration)
    }
    current.timer = setTimeout(repeat, STEPPER_HOLD.delayMs)
    hold = current
  }

  function end(kind: 'release' | 'cancel', pointerId: number): void {
    const current = hold
    // 只有按住的那个指针能结束按住。
    if (current == null || current.pointerId !== pointerId) {
      if (cancelledPointerId === pointerId) {
        cancelledPointerId = null
        // 只在松手时布置吞 click：丢失捕获不能清掉它。
        if (kind === 'release')
          isClickAfterHold = true
      }
      return
    }
    hold = null
    clearTimer(current)
    // 第一次重复之前松手是一次点击，由它的 click 步进。
    if (current.held == null)
      return
    isClickAfterHold = kind === 'release'
    heldValue.value = null
    // 冻结的按住不提交，所以它下面打的草稿保留。
    if (current.isFrozen || options.isLocked())
      return
    options.commit(current.held)
  }

  function onContextMenu(): void {
    const current = hold
    if (current == null)
      return
    // 鼠标的右键菜单请求（比如 Control 加点击）结束按住、不提交，随后的 click 也不步进。
    cancel()
    cancelledPointerId = current.pointerId
    isClickAfterHold = true
  }

  function consumeClick(event: MouseEvent): boolean {
    const isAfterHold = isClickAfterHold
    isClickAfterHold = false
    return isAfterHold && event.detail > 0
  }

  onScopeDispose(cancel)

  return { start, end, onContextMenu, consumeClick, cancel }
}
