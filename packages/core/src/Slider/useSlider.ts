import type { ComputedRef, ShallowRef } from 'vue'
import type { SliderProps, SliderValue } from './types.js'
import { computed, shallowRef, watch } from 'vue'
import { getInteractionModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import { add, clamp, multiply, snap, THUMB_SIZE } from './sliderMath.js'

interface SliderOptions {
  props: Omit<SliderProps, 'modelValue'>
  model: () => SliderValue
  track: Readonly<ShallowRef<HTMLDivElement | null>>
  change: (value: SliderValue) => void
  end: (value: SliderValue) => void
}
interface SliderControl {
  min: ComputedRef<number>
  max: ComputedRef<number>
  values: ComputedRef<number[]>
  gap: ComputedRef<number>
  bounds: (index: number) => [number, number]
  dragging: ShallowRef<number | null>
  keyboardFocus: ShallowRef<number | null>
  pointerDown: (event: PointerEvent) => void
  pointerMove: (event: PointerEvent) => void
  pointerEnd: (event: PointerEvent) => void
  keydown: (index: number, event: KeyboardEvent) => void
  thumbFocus: (index: number) => void
  thumbBlur: () => void
}

export function useSlider(options: SliderOptions): SliderControl {
  const p = options.props
  const min = computed(() => Number.isFinite(p.min) ? p.min! : 0)
  const max = computed(() => Math.max(min.value, Number.isFinite(p.max) ? p.max! : 100))
  const step = computed(() => Number.isFinite(p.step) && p.step! > 0 ? p.step! : 1)
  const gap = computed(() => Math.min(max.value - min.value, multiply(Math.max(0, Number.isFinite(p.minStepsBetweenThumbs) ? p.minStepsBetweenThumbs! : 0), step.value)))
  const values = computed(() => {
    const model = options.model()
    if (!Array.isArray(model))
      return [clamp(model, min.value, max.value)]
    const [low, high] = model.map(value => clamp(value, min.value, max.value)).sort((a, b) => a - b)
    const upper = Math.max(high!, add(min.value, gap.value))
    return [Math.min(low!, add(upper, -gap.value)), upper]
  })
  const dragging = shallowRef<number | null>(null)
  const keyboardFocus = shallowRef<number | null>(null)
  if (typeof document !== 'undefined')
    trackInteractionModality()
  let pointerId: number | null = null
  let latest: SliderValue | undefined
  watch([() => p.isDisabled, () => p.orientation, () => Array.isArray(options.model())], () => {
    dragging.value = null
    pointerId = null
    latest = undefined
  })
  watch(values, () => {
    latest = undefined
  })

  function bounds(index: number): [number, number] {
    return [index === 1 ? add(values.value[0]!, gap.value) : min.value, values.value.length === 2 && index === 0 ? add(values.value[1]!, -gap.value) : max.value]
  }

  function update(index: number, raw: number, shouldSnap = true): SliderValue {
    const next = [...values.value]
    const [lower, upper] = bounds(index)
    const stepped = shouldSnap ? snap(raw, min.value, step.value) : raw
    next[index] = clamp(stepped, lower, upper)
    const value: SliderValue = next.length === 2 ? [next[0]!, next[1]!] : next[0]!
    latest = value
    if (next.some((v, i) => v !== values.value[i]))
      options.change(value)
    return value
  }

  function pointerValue(event: PointerEvent): number {
    const track = options.track.value!
    const rect = track.getBoundingClientRect()
    const vertical = p.orientation === 'vertical'
    const size = vertical ? rect.height : rect.width
    const offset = vertical ? rect.bottom - event.clientY : getComputedStyle(track).direction === 'rtl' ? rect.right - event.clientX : event.clientX - rect.left
    const fraction = size > THUMB_SIZE ? (offset - THUMB_SIZE / 2) / (size - THUMB_SIZE) : size > 0 ? offset / size : 0
    return min.value + clamp(fraction, 0, 1) * (max.value - min.value)
  }

  function pointerDown(event: PointerEvent): void {
    if (p.isDisabled || event.defaultPrevented || event.button !== 0 || pointerId !== null || !options.track.value)
      return
    const target = event.target as HTMLElement
    const mark = target.closest<HTMLElement>('[data-mark-value]')
    const thumb = target.closest<HTMLElement>('[data-thumb-index]')
    const raw = mark ? Number(mark.dataset.markValue) : pointerValue(event)
    const index = thumb ? Number(thumb.dataset.thumbIndex) : values.value.length === 2 && Math.abs(raw - values.value[1]!) < Math.abs(raw - values.value[0]!) ? 1 : 0
    event.preventDefault()
    dragging.value = index
    pointerId = event.pointerId
    options.track.value.querySelectorAll<HTMLElement>('[role="slider"]')[index]?.focus({ preventScroll: true })
    keyboardFocus.value = null
    update(index, raw)
    options.track.value.setPointerCapture?.(event.pointerId)
  }

  function pointerMove(event: PointerEvent): void {
    if (!p.isDisabled && pointerId === event.pointerId && dragging.value !== null)
      update(dragging.value, pointerValue(event))
  }

  function pointerEnd(event: PointerEvent): void {
    if (pointerId !== event.pointerId || dragging.value === null)
      return
    const value = latest ?? (values.value.length === 2 ? [values.value[0]!, values.value[1]!] : values.value[0]!) as SliderValue
    dragging.value = null
    pointerId = null
    latest = undefined
    if (options.track.value?.hasPointerCapture?.(event.pointerId))
      options.track.value.releasePointerCapture(event.pointerId)
    if (!p.isDisabled)
      options.end(value)
  }

  function thumbFocus(index: number): void {
    keyboardFocus.value = !p.isDisabled && getInteractionModality() === 'keyboard' ? index : null
  }

  function thumbBlur(): void {
    keyboardFocus.value = null
  }

  function keydown(index: number, event: KeyboardEvent): void {
    if (p.isDisabled || event.defaultPrevented)
      return
    if (event.key !== 'Shift' && !event.altKey && !event.ctrlKey && !event.metaKey && getInteractionModality() === 'keyboard')
      keyboardFocus.value = index
    if (event.altKey || event.ctrlKey || event.metaKey)
      return
    const current = values.value[index]!
    const rtl = p.orientation !== 'vertical' && options.track.value && getComputedStyle(options.track.value).direction === 'rtl'
    const offsets: Record<string, number> = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
    let value: number
    if (event.key === 'Home')
      value = min.value
    else if (event.key === 'End')
      value = max.value
    else if (event.key in offsets)
      value = current + offsets[event.key]! * step.value
    else
      return
    event.preventDefault()
    const toBound = event.key === 'Home' || event.key === 'End'
    options.end(update(index, value, !toBound))
  }

  return { min, max, gap, values, bounds, dragging, keyboardFocus, pointerDown, pointerMove, pointerEnd, keydown, thumbFocus, thumbBlur }
}
