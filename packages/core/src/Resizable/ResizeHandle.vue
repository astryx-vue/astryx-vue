<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { ResizeHandleProps, ResizeHandleSlots, ResizePillPlacement } from './types.js'
import { computed, onBeforeUnmount, ref, useAttrs, useTemplateRef, watch } from 'vue'
import { getEffectiveMaxPx } from '../composables/internal/resizableChannel.js'
import { devWarn } from '../composables/useDevWarning.js'
import { useAstryxMessages } from '../locale/index.js'
import { handleResizeKey, toggleCollapse } from './resizeKeyboard.js'
import '../../styles/resize-handle.css'

defineOptions({
  name: 'AstryxResizeHandle',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ResizeHandleProps>(), {
  direction: 'horizontal',
  position: 'inline',
  isReversed: false,
  isDisabled: false,
  hasDivider: false,
  isAlwaysVisible: true,
  pillPlacement: 'auto',
})

defineSlots<ResizeHandleSlots>()

const attrs = useAttrs()
const messages = useAstryxMessages()
const root = useTemplateRef<HTMLDivElement>('root')
const dragging = ref(false)
const hovered = ref(false)
const focused = ref(false)
let drag: { pointerId: number, start: number, rtl: number } | null = null

defineExpose({ element: root })

const label = computed(() => props.label || messages.value.layout.resizeHandle)
const sign = computed(() => props.isReversed ? -1 : 1)
const collapsed = computed(() => props.resizable?._isCollapsed ?? false)
const active = computed(() => hovered.value || focused.value || dragging.value)

const pillSide = computed(() => resolveSide(props.pillPlacement, props.isReversed, collapsed.value))

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style' && key !== 'onKeydown' && key !== 'onKeyDown'),
))

const rootClass = computed(() => ['astryx-resize-handle', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)

const ariaNow = computed(() => {
  const resizable = props.resizable
  if (resizable == null)
    return undefined
  return collapsed.value ? Math.max(resizable._size, resizable._minSizePx) : resizable._size
})

const ariaMax = computed(() => {
  const resizable = props.resizable
  if (resizable == null)
    return undefined
  const reported = getEffectiveMaxPx(resizable)
  if (reported != null && Number.isFinite(reported))
    return reported
  const max = resizable._maxSizePx
  return max != null && Number.isFinite(max) ? max : undefined
})

let warnedAxis = false
watch(() => [props.direction, props.resizable?._direction] as const, ([direction, hookDirection]) => {
  if (warnedAxis || hookDirection == null || hookDirection === direction)
    return
  warnedAxis = true
  devWarn(
    'ResizeHandle',
    `direction="${direction}" but its useResizable region is "${hookDirection}". They must match: the hook measures one axis and the handle drags the other.`,
  )
}, { immediate: true })

const ariaText = computed(() => collapsed.value && props.resizable ? messages.value.layout.collapsed : undefined)

const pillStyle = computed<CSSProperties>(() => offsetStyle(props.direction, pillSide.value))

function resolveSide(placement: ResizePillPlacement, reversed: boolean, isCollapsed: boolean): 'start' | 'end' | 'center' {
  if (placement !== 'auto')
    return placement
  const panelSide = reversed ? 'end' : 'start'
  if (isCollapsed)
    return panelSide === 'start' ? 'end' : 'start'
  return panelSide
}

function offsetStyle(direction: 'horizontal' | 'vertical', side: 'start' | 'end' | 'center'): CSSProperties {
  const dir = side === 'center' ? 0 : side === 'start' ? -1 : 1
  const gap = 'var(--astryx-spacing-1, 4px)'
  if (direction === 'horizontal') {
    if (side === 'center')
      return { insetInlineStart: '50%', transform: 'translateX(-50%)' }
    return { insetInlineStart: '0', transform: `translate(calc(${dir} * (100% + ${gap})), -50%)` }
  }
  if (side === 'center')
    return { insetBlockStart: '50%', transform: 'translateY(-50%)' }
  return { top: '0', transform: `translate(-50%, calc(${dir} * (100% + ${gap})))` }
}

function callKeydown(handler: unknown, event: KeyboardEvent): void {
  if (Array.isArray(handler)) {
    for (const item of handler)
      callKeydown(item, event)
    return
  }
  if (typeof handler === 'function')
    (handler as (event: KeyboardEvent) => void)(event)
}

function rtlMultiplier(): number {
  if (props.direction !== 'horizontal' || root.value == null)
    return 1
  return getComputedStyle(root.value).direction === 'rtl' ? -1 : 1
}

function clearDrag() {
  drag = null
  dragging.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

let frame = 0
let pendingDelta = 0

function flushMove(): void {
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
  props.resizable?._onResizeMove(pendingDelta)
}

function pointerDown(event: PointerEvent) {
  if (props.isDisabled || props.resizable == null || drag)
    return
  event.preventDefault()
  event.stopPropagation()
  const target = event.currentTarget
  if (target instanceof HTMLElement)
    target.setPointerCapture?.(event.pointerId)
  drag = {
    pointerId: event.pointerId,
    start: props.direction === 'horizontal' ? event.clientX : event.clientY,
    rtl: rtlMultiplier(),
  }
  dragging.value = true
  pendingDelta = 0
  document.body.style.cursor = props.direction === 'horizontal' ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'
  props.resizable._onResizeStart()
}

function pointerMove(event: PointerEvent) {
  if (drag == null || drag.pointerId !== event.pointerId || props.resizable == null)
    return
  const current = props.direction === 'horizontal' ? event.clientX : event.clientY
  pendingDelta = (current - drag.start) * drag.rtl * sign.value
  if (frame)
    return
  frame = requestAnimationFrame(() => {
    frame = 0
    props.resizable?._onResizeMove(pendingDelta)
  })
}

function pointerUp(event: PointerEvent) {
  if (drag?.pointerId !== event.pointerId)
    return
  flushMove()
  clearDrag()
  props.resizable?._onResizeEnd()
}

function pointerCancel(event: PointerEvent) {
  if (drag?.pointerId !== event.pointerId)
    return
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
  clearDrag()
  props.resizable?._onResizeCancel?.()
}

function onRootKeyDown(event: KeyboardEvent) {
  callKeydown(attrs.onKeydown, event)
  if (attrs.onKeyDown !== attrs.onKeydown)
    callKeydown(attrs.onKeyDown, event)
  const resizable = props.resizable
  if (props.isDisabled || resizable == null)
    return
  handleResizeKey(event, resizable, sign.value, rtlMultiplier(), props.direction === 'horizontal')
}

function doubleClick() {
  const resizable = props.resizable
  if (props.isDisabled || resizable == null || !resizable._collapsible)
    return
  toggleCollapse(resizable)
}

onBeforeUnmount(() => {
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
  if (drag)
    clearDrag()
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- role=separator 加 tabindex 就是键盘控件；方向键、Home、End、Enter 都在这个元素上。 -->
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :style="rootStyle"
    role="separator"
    :aria-orientation="direction === 'horizontal' ? 'vertical' : 'horizontal'"
    :aria-valuenow="ariaNow"
    :aria-valuemin="resizable?._minSizePx"
    :aria-valuemax="ariaMax"
    :aria-valuetext="ariaText"
    :aria-label="label"
    :aria-disabled="isDisabled || undefined"
    :tabindex="isDisabled ? -1 : 0"
    :data-direction="direction"
    :data-position="position"
    :data-divider="hasDivider || undefined"
    :data-disabled="isDisabled || undefined"
    :data-active="active || undefined"
    :data-resizing="dragging || undefined"
    @keydown="onRootKeyDown"
    @dblclick="doubleClick"
    @focus="focused = true"
    @blur="focused = false"
  >
    <div
      class="astryx-resize-handle__hit"
      :data-bias="pillSide"
      @pointerdown="pointerDown"
      @pointermove="pointerMove"
      @pointerup="pointerUp"
      @pointercancel="pointerCancel"
      @lostpointercapture="pointerCancel"
      @pointerenter="hovered = true"
      @pointerleave="hovered = dragging"
    />
    <slot>
      <div
        class="astryx-resize-handle-pill"
        :data-hidden="isAlwaysVisible ? undefined : true"
        :style="pillStyle"
      />
    </slot>
  </div>
</template>
