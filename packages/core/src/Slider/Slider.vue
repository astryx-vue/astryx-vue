<script setup lang="ts" generic="T extends SliderValue">
import type { CSSProperties } from 'vue'
import type { SliderEmits, SliderProps, SliderSlots, SliderValue } from './types.js'
import { computed, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import Field from '../Field/Field.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { percent, position } from './sliderMath.js'
import SliderThumb from './SliderThumb.vue'
import { useSlider } from './useSlider.js'
import '../../styles/slider.css'

defineOptions({ name: 'AstryxSlider', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<SliderProps<T>, 'modelValue'>>(), { min: 0, max: 100, step: 1, orientation: 'horizontal', valueDisplay: 'tooltip', minLabel: 'Minimum value', maxLabel: 'Maximum value', requiredLabel: 'Required' })
const emit = defineEmits<SliderEmits<T>>()
defineSlots<SliderSlots>()
const model = defineModel<T>({ required: true })
const attrs = useAttrs()
const track = useTemplateRef<HTMLDivElement>('track')
const generatedId = `astryx-slider-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const control = useSlider({
  props,
  model: () => model.value,
  track,
  change: (value) => {
    model.value = value as T
    emit('change', value as T)
  },
  end: value => emit('changeEnd', value as T),
})
const { min, max, values, dragging } = control
const isRange = computed(() => values.value.length === 2)
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const tooltip = useButtonTooltip(showsDisabledMessage)
const required = computed(() => !!props.isRequired && !props.isOptional)
const marks = computed(() => props.marks?.filter(mark => Number.isFinite(mark.value) && mark.value >= min.value && mark.value <= max.value) ?? [])
const hasMarkLabels = computed(() => marks.value.some(mark => mark.label))
const format = (value: number): string => props.formatValue?.(value) ?? String(value)
const displayText = computed(() => values.value.map(format).join(' – '))
const fillStyle = computed<CSSProperties>(() => {
  const start = isRange.value ? position(percent(values.value[0]!, min.value, max.value)) : '0px'
  const end = position(percent(values.value.at(-1)!, min.value, max.value))
  return props.orientation === 'horizontal' ? { insetInlineStart: start, width: `calc(${end} - ${start})` } : { bottom: start, height: `calc(${end} - ${start})` }
})
function describedBy(fieldIds?: string): string | undefined {
  return [attrs['aria-describedby'], fieldIds, required.value ? `${inputId.value}-required` : undefined, showsDisabledMessage.value ? `${inputId.value}-disabled` : undefined].filter(Boolean).join(' ') || undefined
}
function markStyle(value: number): CSSProperties {
  const offset = position(percent(value, min.value, max.value))
  return props.orientation === 'horizontal' ? { insetInlineStart: offset } : { bottom: offset }
}
function isFilled(value: number): boolean {
  return value <= values.value.at(-1)! && (!isRange.value || value >= values.value[0]!)
}
function rootAttrs(): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !['aria-labelledby', 'aria-describedby'].includes(key)))
}
function focus(index = 0, options?: FocusOptions): void {
  track.value?.querySelectorAll<HTMLElement>('[role="slider"]')[index]?.focus(options)
}
function blur(): void {
  const active = track.value?.ownerDocument.activeElement
  if (active instanceof HTMLElement && track.value?.contains(active))
    active.blur()
}
const element = computed(() => track.value)
defineExpose({ element, focus, blur })
</script>

<template>
  <Field
    v-bind="rootAttrs()" class="astryx-slider" :data-orientation="orientation" :data-disabled="isDisabled || undefined" :data-mark-labels="hasMarkLabels || undefined"
    :label="label" :input-id="inputId" is-group-label :description="description" :width="width" :is-label-hidden="isLabelHidden"
    :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired" :label-icon="labelIcon" :label-tooltip="labelTooltip"
    :optional-label="optionalLabel" :required-label="requiredLabel" :status="status" status-variant="detached"
  >
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <div class="astryx-slider-row">
        <input v-for="(value, index) in values" :key="index" type="hidden" :name="htmlName" :value="value" :disabled="isDisabled" :form="form">
        <div
          ref="track" class="astryx-slider-control" :role="isRange ? 'group' : undefined" :aria-labelledby="isRange ? field.labelId : undefined"
          @pointerdown="control.pointerDown" @pointermove="control.pointerMove" @pointerup="control.pointerEnd" @pointercancel="control.pointerEnd" @lostpointercapture="control.pointerEnd"
          @pointerenter="tooltip.onPointerEnter" @pointerleave="tooltip.onPointerLeave" @focusin="tooltip.onTooltipPointerEnter" @focusout="tooltip.onBlur" @keydown.esc="tooltip.hideImmediately"
        >
          <div class="astryx-slider-track" aria-hidden="true" />
          <div class="astryx-slider-fill" :style="fillStyle" aria-hidden="true" />
          <span v-for="mark in marks" :key="mark.value" class="astryx-slider-mark" :data-mark-value="mark.value" :data-filled="isFilled(mark.value) || undefined" :style="markStyle(mark.value)" aria-hidden="true">
            <span v-if="mark.label" class="astryx-slider-mark-label" :data-mark-value="mark.value">{{ mark.label }}</span>
          </span>
          <SliderThumb
            v-for="(value, index) in values" :id="`${inputId}-${index}`" :key="index" :index="index" :value="value" :percentage="percent(value, min, max)"
            :min="control.bounds(index)[0]" :max="control.bounds(index)[1]" :orientation="orientation"
            :labelled-by="[field.labelId, isRange ? `${inputId}-label-${index}` : undefined, attrs['aria-labelledby']].filter(Boolean).join(' ')"
            :described-by="describedBy(field.describedBy)" :value-text="formatValue ? format(value) : undefined" :is-invalid="status?.type === 'error'"
            :is-disabled="isDisabled" :is-focusable="!isDisabled || showsDisabledMessage" :dragging="dragging === index" :tooltip-text="valueDisplay === 'tooltip' ? format(value) : undefined"
            @keydown="control.keydown(index, $event)"
          />
        </div>
        <span v-if="valueDisplay === 'text'" class="astryx-slider-value" aria-hidden="true">{{ displayText }}</span>
      </div>
      <template v-if="isRange">
        <VisuallyHidden :id="`${inputId}-label-0`">
          {{ minLabel }}
        </VisuallyHidden>
        <VisuallyHidden :id="`${inputId}-label-1`">
          {{ maxLabel }}
        </VisuallyHidden>
      </template>
      <VisuallyHidden v-if="required" :id="`${inputId}-required`">
        {{ requiredLabel }}
      </VisuallyHidden>
      <VisuallyHidden v-if="showsDisabledMessage" :id="`${inputId}-disabled`">
        {{ disabledMessage }}
      </VisuallyHidden>
    </template>
  </Field>
  <ButtonTooltip
    v-if="showsDisabledMessage" :id="`${inputId}-disabled-tooltip`" :anchor="track" :open="tooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="tooltip.onTooltipPointerEnter" @pointer-leave="tooltip.onTooltipPointerLeave"
  />
</template>
