/**
 * @file useTouchWheel.ts
 * @input The touch column and its strip, the wheel's options, committed value
 *   and change callback
 * @output useTouchWheel: one picker column that moves like UIPickerView under
 *   a finger, and the row its band marks
 * @position Wiring of TouchPickerWheel.vue: the gesture system's pan and tap
 *   (../gestures), the strip (wheelStrip.ts) and the curves (wheelPhysics.ts)
 *
 * The wheel does not scroll natively: a scroller's momentum can be neither
 * caught nor measured. It pans through the gesture system, and the strip
 * plays every motion on the shared animator.
 */

import type { MaybeRefOrGetter, Ref } from 'vue'
import type { PickerWheelOption, WheelKey } from './wheelOptions'
import type { WheelCurve, WheelLayout } from './wheelPhysics'
import type { PlayOptions } from './wheelStrip'
import { computed, onScopeDispose, ref, toValue, watch } from 'vue'
import { scrollTypeOf } from '../gestures/GestureHost'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { TapGestureRecognizer } from '../gestures/TapGestureRecognizer'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'
import { resolveMotion } from '../motion/resolveMotion'
import { registerScrollTable, scroll } from '../motion/uikit/scroll'
import { springs } from '../motion/uikit/springs'
import { lockSelection } from '../utils/selectionLock'
import { nearestEnabledIndex, steppedRow } from './wheelOptions'
import { bounceCurve, dragOffset, fingerOffset, nearestIndex, planRelease, rowAtPoint, scaleFor, WHEEL_ROW_HEIGHT } from './wheelPhysics'
import { createWheelStrip } from './wheelStrip'

export interface TouchWheelOptions {
  column: Readonly<Ref<HTMLElement | null>>
  strip: Readonly<Ref<HTMLElement | null>>
  options: MaybeRefOrGetter<ReadonlyArray<PickerWheelOption>>
  value: MaybeRefOrGetter<string | undefined>
  onChange: (value: string) => void
}

export interface TouchWheel {
  /** The row the band marks: null while the wheel moves. */
  readonly marked: Readonly<Ref<number | null>>
  /** The committed row, or 0 when the value names none. */
  readonly selectedIndex: Readonly<Ref<number>>
  readonly onKey: (key: WheelKey) => void
  /** A click on a row from assistive technology, a keyboard or a mouse. */
  readonly activateRow: (index: number) => void
}

const SCALE = scaleFor(WHEEL_ROW_HEIGHT)

/** A turn a tap, a key or the program starts: the settle spring, as the wheel resolves it. */
function turnCurve(column: Element | null, from: number, to: number): WheelCurve {
  return bounceCurve(from, 0, to, SCALE, resolveMotion(column, springs.settle))
}

export function useTouchWheel({ column, strip, options, value, onChange }: TouchWheelOptions): TouchWheel {
  const rows = computed(() => toValue(options))
  const layout = computed<WheelLayout>(() => ({ rowHeight: WHEEL_ROW_HEIGHT, rowCount: rows.value.length }))
  const selectedIndex = computed(() => Math.max(0, rows.value.findIndex(option => option.value === toValue(value))))
  const motion = createWheelStrip(layout.value)
  const marked = ref<number | null>(selectedIndex.value)
  /** The finger's offset at the pan's start, before any rubber band; null without a drag. */
  let dragStart: number | null = null
  /** A finger landed on a moving wheel and stopped it. */
  let caught = false

  motion.onNearestChange((position) => {
    marked.value = position
  })
  watch(layout, next => motion.setLayout(next))
  watch(strip, element => motion.attach(element), { immediate: true, flush: 'sync' })

  // Every motion unmarks the band as it starts, and marks the row it ends on.
  function move(curve: WheelCurve, playOptions: PlayOptions = {}): void {
    marked.value = null
    motion.forgetNearest()
    motion.play(curve, playOptions)
  }

  function commit(index: number): void {
    const option = rows.value[index]
    if (option != null && !option.disabled && option.value !== toValue(value))
      onChange(option.value)
  }

  // At rest: commit the row, or turn on to the nearest enabled row first. A
  // rest on the committed row commits nothing, even outside the bounds.
  function arrive(offset: number): void {
    const position = nearestIndex(offset, layout.value)
    const committed = rows.value.findIndex(option => option.value === toValue(value))
    if (position !== committed) {
      const target = nearestEnabledIndex(rows.value, position, Math.max(0, committed))
      if (target !== position) {
        move(turnCurve(column.value, offset, target * WHEEL_ROW_HEIGHT), { kind: 'release', onEnd: onArrive })
        return
      }
    }
    commit(position)
  }

  function onArrive(outcome: 'arrived' | 'stopped', offset: number): void {
    if (outcome === 'arrived')
      arrive(offset)
  }

  function release(velocity: number): void {
    registerScrollTable()
    const plan = planRelease(motion.offset(), velocity, layout.value, resolveMotion(column.value, scroll.bounce))
    move(plan.curve, {
      kind: 'release',
      ticks: true,
      onEnd: onArrive,
      touchRelease: true,
      momentum: plan.kind === 'coast' || plan.kind === 'edge',
    })
  }

  // A key or a click turns the wheel onto `row` and commits it at once.
  function turnTo(row: number): void {
    const offset = motion.isMoving() ? motion.stop() : motion.offset()
    move(turnCurve(column.value, offset, row * WHEEL_ROW_HEIGHT))
    commit(row)
  }

  // Keys step from the row the wheel is heading to, so two quick presses move
  // two rows. A key with nowhere to go leaves a turn in flight to finish.
  function onKey(key: WheelKey): void {
    const row = steppedRow(rows.value, nearestIndex(motion.target(), layout.value), key)
    if (row != null)
      turnTo(row)
  }

  function activateRow(index: number): void {
    const option = rows.value[index]
    if (option != null && !option.disabled)
      turnTo(index)
  }

  // Park the committed row under the band when the wheel mounts, at once. A
  // value that changes from outside turns the wheel onto its row instead, as
  // UIDatePicker does: from where the wheel is drawn, even mid-turn. Never
  // while a finger or a release owns the wheel; its rest commits and parks.
  let isParked = false
  watch([selectedIndex, strip], ([index, element]) => {
    if (element == null || dragStart != null || motion.movingKind() === 'release')
      return
    const target = index * WHEEL_ROW_HEIGHT
    if (!isParked) {
      isParked = true
      motion.setOffset(target)
      return
    }
    if (Math.abs(motion.target() - target) <= 0.01)
      return
    const shown = motion.isMoving() ? motion.stop() : motion.offset()
    move(turnCurve(column.value, shown, target))
  }, { immediate: true, flush: 'post' })

  const pan = useGestureRecognizer(column, () => new PanGestureRecognizer({
    name: 'wheel-pan',
    direction: 'vertical',
    // A trackpad's two-finger scroll drives the pan as a finger does; a mouse
    // wheel's notches never reach it.
    allowedScrollTypes: ['continuous'],
    // A held finger on the wheel never starts text selection or the callout.
    selectionLock: lockSelection,
    shouldReceiveTouch: (_pan, touch) => {
      // A finger lands: a moving wheel stops where it is on screen.
      caught = motion.isMoving()
      if (caught)
        motion.stop(touch.time)
      return true
    },
  }), (recognizer) => {
    switch (recognizer.state) {
      case 'began': {
        const shown = motion.isMoving() ? motion.stop() : motion.offset()
        dragStart = fingerOffset(shown, layout.value)
        motion.resetDrag()
        motion.setOffset(dragOffset(dragStart - recognizer.translation().y, layout.value), { ticks: true })
        break
      }
      case 'changed':
        if (dragStart != null)
          motion.setOffset(dragOffset(dragStart - recognizer.translation().y, layout.value), { ticks: true })
        break
      case 'ended': {
        const wasDragging = dragStart != null
        dragStart = null
        // A scroll view's release velocity; the rows move against the finger.
        release(wasDragging ? -recognizer.scrollVelocity().y : 0)
        break
      }
      case 'cancelled':
        dragStart = null
        release(0)
        break
      default:
        break
    }
  })

  // A touch that stopped a moving wheel and lifted without dragging: the
  // wheel eases onto the nearest row, as a release without velocity does.
  const removeTransition = pan.addTransitionListener((_pan, _from, to) => {
    if (to === 'failed' && caught && !motion.isMoving())
      release(0)
  })

  // A tap on a row turns the wheel onto it, and its rest commits it. A tap on
  // the band's row, or one that caught a moving wheel, does nothing more.
  useGestureRecognizer(column, () => new TapGestureRecognizer({ name: 'wheel-tap' }), (recognizer) => {
    const element = column.value
    if (recognizer.state !== 'ended' || caught || element == null)
      return
    const box = element.getBoundingClientRect()
    const offset = motion.offset()
    const target = rowAtPoint(recognizer.location().y - (box.top + box.height / 2), offset, layout.value)
    if (target == null || target === nearestIndex(offset, layout.value))
      return
    move(turnCurve(element, offset, target * WHEEL_ROW_HEIGHT), { onEnd: onArrive })
  })

  // A mouse wheel's notch turns the wheel one row, as an arrow key does. A
  // wheel the pan took arrives already prevented; a ctrl-wheel stays the
  // page's zoom, and a sideways scroll stays the page's.
  function onWheel(event: WheelEvent): void {
    if (
      event.defaultPrevented || event.ctrlKey || event.shiftKey || event.deltaY === 0
      || Math.abs(event.deltaX) > Math.abs(event.deltaY) || scrollTypeOf(event) !== 'discrete'
    ) {
      return
    }
    event.preventDefault()
    onKey({ step: Math.sign(event.deltaY) })
  }
  watch(column, (element, _previous, onCleanup) => {
    if (element == null)
      return
    element.addEventListener('wheel', onWheel, { passive: false })
    onCleanup(() => element.removeEventListener('wheel', onWheel))
  }, { immediate: true, flush: 'post' })

  onScopeDispose(() => {
    removeTransition()
    motion.onNearestChange(null)
    motion.dispose()
  })

  return { marked, selectedIndex, onKey, activateRow }
}
