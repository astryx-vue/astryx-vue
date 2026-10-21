<script setup lang="ts">
import type { SliderOrientation } from './types.js'
import { computed, shallowRef, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { position } from './sliderMath.js'
import '../../styles/button.css'

const props = defineProps<{
  id: string
  index: number
  value: number
  min: number
  max: number
  percentage: number
  orientation: SliderOrientation
  labelledBy: string
  describedBy?: string
  valueText?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isFocusable: boolean
  tooltipText?: string
  dragging: boolean
  keyboardFocus?: boolean
  extraAttrs?: Record<string, unknown>
}>()
const emit = defineEmits<{
  keydown: [event: KeyboardEvent]
  focus: []
  blur: []
}>()
const thumb = useTemplateRef<HTMLDivElement>('thumb')
const tooltip = useTemplateRef<InstanceType<typeof ButtonTooltip>>('tooltip')
const tabIndex = computed(() => props.isFocusable ? 0 : -1)
const focused = shallowRef(false)
const hovered = shallowRef(false)
const dismissed = shallowRef(false)
const open = computed(() => !!props.tooltipText && !props.isDisabled && !dismissed.value && (focused.value || hovered.value || props.dragging))
const style = computed(() => props.orientation === 'horizontal' ? { insetInlineStart: position(props.percentage) } : { bottom: position(props.percentage) })
watch(() => props.dragging, () => {
  dismissed.value = false
})
watch(() => [props.percentage, props.tooltipText], () => {
  tooltip.value?.updatePosition()
}, { flush: 'post' })
function keydown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    dismissed.value = true
  emit('keydown', event)
}
function focus(): void {
  focused.value = true
  dismissed.value = false
  emit('focus')
}
function blur(): void {
  focused.value = false
  emit('blur')
}
function enter(): void {
  hovered.value = true
  dismissed.value = false
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/interactive-supports-focus -- The tested dynamic tabindex is always 0 or -1. -->
  <div
    v-bind="extraAttrs" :id="id" ref="thumb" class="astryx-slider-thumb" role="slider" :style="style" :tabindex="tabIndex"
    :data-thumb-index="index" :data-dragging="dragging || undefined" :data-keyboard-focus="keyboardFocus || undefined"
    :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="value"
    :aria-valuetext="valueText" :aria-orientation="orientation" :aria-labelledby="labelledBy" :aria-describedby="describedBy"
    :aria-disabled="isDisabled || undefined" :aria-invalid="isInvalid || undefined"
    @keydown="keydown" @focus="focus" @blur="blur" @pointerenter="enter" @pointerleave="hovered = false"
  />
  <ButtonTooltip v-if="tooltipText" :id="`${id}-tooltip`" ref="tooltip" :anchor="thumb" :open="open" :text="tooltipText" @pointer-enter="hovered = true" @pointer-leave="hovered = false" />
</template>
