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
 *
 * A looping wheel (UIDatePicker's minutes) has no ends: its offset is
 * unbounded and it draws copies of its rows over the span any motion covers.
 * At rest the offset moves back onto the wheel's own rows, where the strip
 * shows the same rows, and the span shrinks again.
 */

import type { MaybeRefOrGetter, Ref } from 'vue'
import type { LoopSpan } from './wheelLoop'
import type { PickerWheelOption, WheelKey } from './wheelOptions'
import type { WheelCurve, WheelLayout } from './wheelPhysics'
import type { PlayOptions } from './wheelStrip'
import { computed, onScopeDispose, ref, shallowRef, toValue, watch } from 'vue'
import { scrollTypeOf } from '../gestures/GestureHost'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { TapGestureRecognizer } from '../gestures/TapGestureRecognizer'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'
import { resolveMotion } from '../motion/resolveMotion'
import { registerScrollTable, scroll } from '../motion/uikit/scroll'
import { springs } from '../motion/uikit/springs'
import { lockSelection } from '../utils/selectionLock'
import { coveringSpan, lapPosition, loopedStep, mod, nearestLoopCopy, restingLoopStep, restingSpan } from './wheelLoop'
import { endRow, nearestEnabledIndex, steppedRow } from './wheelOptions'
import { bounceCurve, dragOffset, fingerOffset, nearestIndex, planRelease, rowAtPoint, scaleFor, WHEEL_ROW_HEIGHT } from './wheelPhysics'
import { createWheelStrip } from './wheelStrip'

export interface TouchWheelOptions {
  column: Readonly<Ref<HTMLElement | null>>
  strip: Readonly<Ref<HTMLElement | null>>
  options: MaybeRefOrGetter<ReadonlyArray<PickerWheelOption>>
  value: MaybeRefOrGetter<string | undefined>
  /** The rows repeat without end, as UIDatePicker's minutes do. A single row never loops. */
  looping?: MaybeRefOrGetter<boolean | undefined>
  onChange: (value: string) => void
}

/** A copy of a row that a looping wheel draws past its own rows. */
export interface WheelCopy {
  readonly position: number
  readonly option: PickerWheelOption
}

export interface TouchWheel {
  /** The position the band marks (a copy's on a loop): null while the wheel moves. */
  readonly marked: Readonly<Ref<number | null>>
  /** The copies a looping wheel draws; none for a wheel with ends. */
  readonly copies: Readonly<Ref<ReadonlyArray<WheelCopy>>>
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

const isEnabled = (option: PickerWheelOption | undefined): boolean => option != null && !option.disabled

export function useTouchWheel({ column, strip, options, value, looping, onChange }: TouchWheelOptions): TouchWheel {
  const rows = computed(() => toValue(options))
  const loops = computed(() => toValue(looping) === true && rows.value.length > 1)
  const layout = computed<WheelLayout>(() => ({ rowHeight: WHEEL_ROW_HEIGHT, rowCount: rows.value.length, looping: loops.value }))
  const selectedIndex = computed(() => Math.max(0, rows.value.findIndex(option => option.value === toValue(value))))
  const motion = createWheelStrip(layout.value)
  const marked = ref<number | null>(selectedIndex.value)
  /** The finger's offset at the pan's start, before any rubber band; null without a drag. */
  let dragStart: number | null = null
  /** A finger landed on a moving wheel and stopped it. */
  let caught = false
  /** Where the committed row sits on the strip: on a loop, the copy the wheel rests on. */
  let committed = selectedIndex.value

  /** The positions a looping wheel draws rows at; null for a wheel with ends. */
  const span = shallowRef<LoopSpan | null>(null)
  watch([loops, () => rows.value.length], ([on, count]) => {
    span.value = on ? restingSpan(count) : null
  }, { immediate: true })
  const copies = computed<WheelCopy[]>(() => {
    const drawn = span.value
    const count = rows.value.length
    const list: WheelCopy[] = []
    if (drawn == null)
      return list
    for (let position = drawn.from; position <= drawn.to; position++) {
      if (position < 0 || position >= count)
        list.push({ position, option: rows.value[mod(position, count)]! })
    }
    return list
  })

  /** The option a position shows: on a loop, a copy shows the row it copies. */
  function optionAt(position: number): PickerWheelOption | undefined {
    const count = rows.value.length
    return loops.value && count > 0 ? rows.value[mod(position, count)] : rows.value[position]
  }

  /** The position of row `row` nearest `offset`: on a loop, the copy nearest it. */
  function nearestPosition(row: number, offset: number): number {
    return loops.value ? nearestLoopCopy(row, offset / WHEEL_ROW_HEIGHT, rows.value.length) : row
  }

  /** On a loop, the drawn span grows to cover positions `a` to `b` and the band's surroundings. */
  function cover(a: number, b: number): void {
    if (span.value != null)
      span.value = coveringSpan(span.value, a, b)
  }

  /**
   * At rest on a copy, the offset moves onto the wheel's own row, where the
   * strip shows the same rows, and the drawn span shrinks back. Returns the
   * offset there.
   */
  function settle(offset: number): number {
    const count = rows.value.length
    if (!loops.value)
      return offset
    const position = nearestIndex(offset, layout.value)
    const shift = position - mod(position, count)
    if (shift !== 0) {
      motion.setOffset(offset - shift * WHEEL_ROW_HEIGHT)
      committed -= shift
    }
    span.value = restingSpan(count)
    return offset - shift * WHEEL_ROW_HEIGHT
  }

  function shownOffset(): number {
    return motion.isMoving() ? motion.stop() : motion.offset()
  }

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

  function commit(option: PickerWheelOption | undefined): void {
    if (option != null && !option.disabled && option.value !== toValue(value))
      onChange(option.value)
  }

  /** Signed rows from a rest at `position` to the row the rest rule names: 0 to commit where it is. */
  function restStep(position: number): number {
    const count = rows.value.length
    if (loops.value) {
      // Measured around the seam; the committed row counts at its copy nearest
      // the rest, so a rest whole laps away is on it.
      const committedCopy = nearestLoopCopy(committed, position, count)
      return position === committedCopy ? 0 : restingLoopStep(at => isEnabled(optionAt(at)), position, committedCopy, count)
    }
    const committedRow = rows.value.findIndex(option => option.value === toValue(value))
    return position === committedRow ? 0 : nearestEnabledIndex(rows.value, position, Math.max(0, committedRow)) - position
  }

  // At rest: commit the row, or turn on to the nearest enabled row first. A
  // rest on the committed row commits nothing, even outside the bounds.
  function arrive(offset: number): void {
    const position = nearestIndex(offset, layout.value)
    const step = restStep(position)
    if (step !== 0) {
      cover(position, position + step)
      move(turnCurve(column.value, offset, (position + step) * WHEEL_ROW_HEIGHT), { kind: 'release', onEnd: onArrive })
      return
    }
    const option = optionAt(position)
    // The offset moves onto the wheel's own rows before the commit, so a
    // value the owner clamps turns the wheel on from there.
    committed = nearestIndex(settle(offset), layout.value)
    commit(option)
  }

  function onArrive(outcome: 'arrived' | 'stopped', offset: number): void {
    if (outcome === 'arrived')
      arrive(offset)
  }

  function release(velocity: number): void {
    registerScrollTable()
    const offset = motion.offset()
    const plan = planRelease(offset, velocity, layout.value, resolveMotion(column.value, scroll.bounce))
    cover(nearestIndex(offset, layout.value), plan.index)
    move(plan.curve, {
      kind: 'release',
      ticks: true,
      onEnd: onArrive,
      touchRelease: true,
      momentum: plan.kind === 'coast' || plan.kind === 'edge',
    })
  }

  // A key or a click turns the wheel onto `position` and commits that row at
  // once. On a loop the strip first moves the target's lap onto its own rows,
  // as a rest does.
  function turnTo(position: number): void {
    const offset = shownOffset()
    const count = rows.value.length
    const option = optionAt(position)
    const shift = loops.value ? position - mod(position, count) : 0
    const from = offset - shift * WHEEL_ROW_HEIGHT
    const to = position - shift
    if (shift !== 0)
      motion.setOffset(from)
    committed = to
    cover(nearestIndex(from, layout.value), to)
    move(turnCurve(column.value, from, to * WHEEL_ROW_HEIGHT))
    commit(option)
  }

  /** Where `key` turns the wheel from the position it is heading to, or null to stay. */
  function keyTarget(key: WheelKey, heading: number): number | null {
    if (!loops.value)
      return steppedRow(rows.value, heading, key)
    // On a loop an end key stays in the committed row's lap, and a step
    // crosses the seam.
    if ('end' in key) {
      const row = endRow(rows.value, key.end)
      return row == null ? null : lapPosition(row, committed, rows.value.length)
    }
    const travel = loopedStep(at => isEnabled(optionAt(at)), heading, key.step, rows.value.length)
    return travel == null ? null : heading + travel
  }

  // Keys step from the row the wheel is heading to, so two quick presses move
  // two rows. A key with nowhere to go leaves a turn in flight to finish.
  function onKey(key: WheelKey): void {
    const position = keyTarget(key, nearestIndex(motion.target(), layout.value))
    if (position != null)
      turnTo(position)
  }

  // A click names a value: on a loop, the row in the committed row's lap.
  function activateRow(index: number): void {
    const position = loops.value ? lapPosition(index, committed, rows.value.length) : index
    if (isEnabled(optionAt(position)))
      turnTo(position)
  }

  // Park the committed row under the band when the wheel mounts, at once. A
  // value that changes from outside turns the wheel onto its row instead, as
  // UIDatePicker does: from where the wheel is drawn, even mid-turn. Never
  // while a finger or a release owns the wheel; its rest commits and parks.
  // On a loop it turns the shorter way round, and its rest settles onto the
  // wheel's own rows.
  let isParked = false
  watch([selectedIndex, strip], ([index, element]) => {
    if (element == null || dragStart != null || motion.movingKind() === 'release')
      return
    if (!isParked) {
      isParked = true
      committed = index
      motion.setOffset(index * WHEEL_ROW_HEIGHT)
      return
    }
    const heading = nearestPosition(index, motion.target())
    if (Math.abs(motion.target() - heading * WHEEL_ROW_HEIGHT) <= 0.01) {
      committed = heading
      return
    }
    const shown = shownOffset()
    const position = nearestPosition(index, shown)
    committed = position
    cover(nearestIndex(shown, layout.value), position)
    move(turnCurve(column.value, shown, position * WHEEL_ROW_HEIGHT), {
      onEnd: (outcome, end) => {
        if (outcome === 'arrived')
          settle(end)
      },
    })
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
        const shown = shownOffset()
        dragStart = fingerOffset(shown, layout.value)
        motion.resetDrag()
        motion.setOffset(dragOffset(dragStart - recognizer.translation().y, layout.value), { ticks: true })
        break
      }
      case 'changed': {
        if (dragStart == null)
          break
        const offset = dragOffset(dragStart - recognizer.translation().y, layout.value)
        const position = nearestIndex(offset, layout.value)
        cover(position, position)
        motion.setOffset(offset, { ticks: true })
        break
      }
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
    // On a loop the tapped row can be a copy: the wheel turns onto it.
    cover(nearestIndex(offset, layout.value), target)
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

  return { marked, copies, selectedIndex, onKey, activateRow }
}
