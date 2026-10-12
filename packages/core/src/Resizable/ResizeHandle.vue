<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { ResizeHandleProps, ResizeHandleSlots, ResizePillPlacement } from './types.js'
import { computed, onBeforeUnmount, ref, useAttrs, useTemplateRef } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
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
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style' && key !== 'onKeydown'),
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
  const max = props.resizable?._maxSizePx
  return max != null && max !== Number.POSITIVE_INFINITY ? max : undefined
})

const ariaText = computed(() => collapsed.value && props.resizable ? messages.value.layout.collapsed : undefined)

const pillStyle = computed<CSSProperties>(() => offsetStyle(props.direction, pillSide.value, true))
const hitStyle = computed<CSSProperties>(() => offsetStyle(props.direction, pillSide.value, false))

function resolveSide(placement: ResizePillPlacement, reversed: boolean, isCollapsed: boolean): 'start' | 'end' | 'center' {
  if (placement !== 'auto')
    return placement
  const panelSide = reversed ? 'end' : 'start'
  if (isCollapsed)
    return panelSide === 'start' ? 'end' : 'start'
  return panelSide
}

function offsetStyle(direction: 'horizontal' | 'vertical', side: 'start' | 'end' | 'center', pill: boolean): CSSProperties {
  const dir = side === 'center' ? 0 : side === 'start' ? -1 : 1
  const gap = 'var(--astryx-spacing-1, 4px)'
  if (direction === 'horizontal') {
    if (side === 'center')
      return { insetInlineStart: '50%', transform: 'translateX(-50%)' }
    if (pill)
      return { insetInlineStart: '0', transform: `translate(calc(${dir} * (100% + ${gap})), -50%)` }
    return { insetInlineStart: '0', transform: `translateX(calc(${dir} * (3px + ${gap}) - 6.5px))` }
  }
  if (side === 'center')
    return { insetBlockStart: '50%', transform: 'translateY(-50%)' }
  if (pill)
    return { top: '0', transform: `translate(-50%, calc(${dir} * (100% + ${gap})))` }
  return { insetBlockStart: '0', transform: `translateY(calc(${dir} * (3px + ${gap}) - 6.5px))` }
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

function pointerDown(event: PointerEvent) {
  if (props.isDisabled || props.resizable == null || drag)
    return
  event.preventDefault()
  const target = event.currentTarget
  if (target instanceof HTMLElement)
    target.setPointerCapture?.(event.pointerId)
  drag = {
    pointerId: event.pointerId,
    start: props.direction === 'horizontal' ? event.clientX : event.clientY,
    rtl: rtlMultiplier(),
  }
  dragging.value = true
  document.body.style.cursor = props.direction === 'horizontal' ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'
  props.resizable._onResizeStart()
}

function pointerMove(event: PointerEvent) {
  if (drag == null || drag.pointerId !== event.pointerId || props.resizable == null)
    return
  const current = props.direction === 'horizontal' ? event.clientX : event.clientY
  props.resizable._onResizeMove((current - drag.start) * drag.rtl * sign.value)
}

function pointerUp(event: PointerEvent) {
  if (drag?.pointerId !== event.pointerId)
    return
  clearDrag()
  props.resizable?._onResizeEnd()
}

function pointerCancel(event: PointerEvent) {
  if (drag?.pointerId !== event.pointerId)
    return
  clearDrag()
  props.resizable?._onResizeCancel?.()
}

function keydown(event: KeyboardEvent) {
  const resizable = props.resizable
  if (props.isDisabled || resizable == null)
    return
  const step = event.shiftKey ? 50 : 10
  const rtl = rtlMultiplier()
  const move = (delta: number) => {
    resizable._onResizeStart()
    resizable._onResizeMove(delta)
    resizable._onResizeEnd()
  }
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    move(step * rtl * sign.value)
  }
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    move(-step * rtl * sign.value)
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    move(resizable._minSizePx - resizable._size)
  }
  else if (event.key === 'End' && resizable._maxSizePx !== Number.POSITIVE_INFINITY) {
    event.preventDefault()
    move(resizable._maxSizePx - resizable._size)
  }
  else if (event.key === 'Enter' && resizable._collapsible) {
    event.preventDefault()
    move(resizable._isCollapsed ? resizable._minSizePx : -resizable._size)
  }
}

function doubleClick() {
  const resizable = props.resizable
  if (props.isDisabled || resizable == null || !resizable._collapsible)
    return
  resizable._onResizeStart()
  resizable._onResizeMove(resizable._isCollapsed ? resizable._minSizePx : -resizable._size)
  resizable._onResizeEnd()
}

onBeforeUnmount(() => {
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
    @keydown="keydown"
    @dblclick="doubleClick"
    @focus="focused = true"
    @blur="focused = false"
  >
    <div
      class="astryx-resize-handle__hit"
      :style="hitStyle"
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
