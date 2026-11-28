<script setup lang="ts" generic="T extends SliderValue">
import type { CSSProperties, StyleValue } from 'vue'
import type { SliderEmits, SliderProps, SliderSlots, SliderValue } from './types.js'
import { computed, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { useAriaRequired } from '../FormLayout/context.js'
import { useComponentMessages } from '../locale/context.js'
import { sliderMessages } from '../locale/messages/slider.js'
import { withholdCallerHandlers } from '../utils/disabledInteraction.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { percent, position, thumbHitInsets } from './sliderMath.js'
import SliderThumb from './SliderThumb.vue'
import { useSlider } from './useSlider.js'
import { useSliderTouch } from './useSliderTouch.js'
import '../../styles/slider.css'

defineOptions({ name: 'AstryxSlider', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<SliderProps<T>, 'modelValue'>>(), { min: 0, max: 100, step: 1, orientation: 'horizontal', valueDisplay: 'tooltip' })
const emit = defineEmits<SliderEmits<T>>()
defineSlots<SliderSlots>()
const model = defineModel<T>({ required: true })
const attrs = useAttrs()
const messages = useComponentMessages({ slider: sliderMessages })
const minName = computed(() => props.minLabel ?? messages.value.slider.minimumThumb)
const maxName = computed(() => props.maxLabel ?? messages.value.slider.maximumThumb)
const requiredName = computed(() => props.requiredLabel ?? messages.value.slider.required)
const press = usePressFeedback({ hasOverlay: false })
const parts = useFieldPartStyling({
  component: 'Slider',
  props,
  attrs,
  reservedAttrs: ['aria-labelledby', 'aria-describedby', 'onPointerdown', 'onPointermove', 'onPointerup', 'onPointercancel', 'onPointerDown', 'onPointerMove', 'onPointerUp', 'onPointerCancel'],
})
const track = useTemplateRef<HTMLDivElement>('track')
const fillMover = useTemplateRef<HTMLDivElement>('fillMover')
const fill = useTemplateRef<HTMLDivElement>('fill')
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
useSliderTouch({
  props,
  control,
  getParts: () => track.value == null
    ? null
    : { control: track.value, thumbs: [...track.value.querySelectorAll<HTMLElement>('[role="slider"]')], fillMover: fillMover.value, fill: fill.value },
})
const { min, max, values, dragging } = control
const isRange = computed(() => values.value.length === 2)
const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim())
const tooltip = useButtonTooltip(showsDisabledMessage)
// 外层 FormLayout 的默认必填也算：没标 optional 的字段同样要报必填。
const ariaRequired = useAriaRequired(props)
const required = computed(() => ariaRequired.value === true)
const marks = computed(() => props.marks?.filter(mark => Number.isFinite(mark.value) && mark.value >= min.value && mark.value <= max.value) ?? [])
const hasMarkLabels = computed(() => marks.value.some(mark => mark.label))
const format = (value: number): string => props.formatValue?.(value) ?? String(value)
const displayText = computed(() => values.value.map(format).join(' – '))
// The filled range's ends as progress: slider.css moves the fill parts by them.
const fillStyle = computed(() => ({
  '--_slider-fill-start': isRange.value ? percent(values.value[0]!, min.value, max.value) / 100 : 0,
  '--_slider-fill-end': percent(values.value.at(-1)!, min.value, max.value) / 100,
}))
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
function callConsumerPointer(event: PointerEvent): void {
  // 禁用的滑块还留着 Tab 落脚点，事件照常来；调用方的处理函数一个都不运行。
  if (props.isDisabled)
    return
  const names: Record<string, string[]> = {
    pointerdown: ['onPointerdown', 'onPointerDown'],
    pointermove: ['onPointermove', 'onPointerMove'],
    pointerup: ['onPointerup', 'onPointerUp'],
    pointercancel: ['onPointercancel', 'onPointerCancel'],
  }
  for (const name of names[event.type] ?? []) {
    const handler = attrs[name]
    if (typeof handler === 'function')
      handler(event)
  }
}
function onPointerDown(event: PointerEvent): void {
  control.pointerDown(event)
  callConsumerPointer(event)
}
function onPointerMove(event: PointerEvent): void {
  control.pointerMove(event)
  callConsumerPointer(event)
}
function onPointerEnd(event: PointerEvent): void {
  control.pointerEnd(event)
  callConsumerPointer(event)
}
const shellStyle = computed<StyleValue>(() => [attrs.style as StyleValue, parts.containerStyle.value])
const thumbAttrs = computed(() => isRange.value ? {} : withholdCallerHandlers(parts.forwardedAttrs(), !!props.isDisabled))
const trackAttrs = computed(() => ({
  ...(isRange.value ? withholdCallerHandlers(parts.forwardedAttrs(), !!props.isDisabled) : {}),
  ...(props.isDisabled ? {} : press.pressableProps),
}))
function focus(index = 0, options?: FocusOptions): void {
  track.value?.querySelectorAll<HTMLElement>('[role="slider"]')[index]?.focus(options)
}
function blur(): void {
  const active = track.value?.ownerDocument.activeElement
  if (active instanceof HTMLElement && track.value?.contains(active))
    active.blur()
}
const element = computed(() => {
  if (isRange.value)
    return track.value
  return track.value?.querySelector<HTMLElement>('[role="slider"]') ?? null
})
defineExpose({ element, focus, blur })
</script>

<template>
  <Field
    class="astryx-slider" :class="[attrs.class, parts.containerClass.value]" :style="shellStyle" :data-orientation="orientation" :data-disabled="isDisabled || undefined" :data-mark-labels="hasMarkLabels || undefined"
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
          ref="track" v-bind="trackAttrs" class="astryx-slider-control" :class="controlClass" :style="controlStyle"
          :data-orientation="orientation" :data-disabled="isDisabled || undefined" :data-range="isRange || undefined"
          :role="isRange ? 'group' : undefined" :aria-labelledby="isRange ? [field.labelId, attrs['aria-labelledby']].filter(Boolean).join(' ') : undefined"
          @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerEnd" @pointercancel="onPointerEnd" @lostpointercapture="onPointerEnd"
          @pointerenter="tooltip.onPointerEnter" @pointerleave="tooltip.onPointerLeave" @focusin="tooltip.onTooltipPointerEnter" @focusout="tooltip.onBlur" @keydown.esc="tooltip.hideImmediately"
        >
          <div class="astryx-slider-travel">
            <div class="astryx-slider-track" aria-hidden="true" />
            <div class="astryx-slider-fill-clip" :style="fillStyle" aria-hidden="true">
              <div ref="fillMover" class="astryx-slider-fill-mover">
                <div ref="fill" class="astryx-slider-fill" />
              </div>
            </div>
            <span v-for="mark in marks" :key="mark.value" class="astryx-slider-mark" :data-mark-value="mark.value" :data-filled="isFilled(mark.value) || undefined" :style="markStyle(mark.value)" aria-hidden="true">
              <span v-if="mark.label" class="astryx-slider-mark-label" :data-mark-value="mark.value">{{ mark.label }}</span>
            </span>
            <SliderThumb
              v-for="(value, index) in values" :id="`${inputId}-${index}`" :key="index" :index="index" :value="value" :percentage="percent(value, min, max)"
              :hit-insets="thumbHitInsets(index, values, min, max, orientation !== 'vertical')"
              :min="control.bounds(index)[0]" :max="control.bounds(index)[1]" :orientation="orientation"
              :labelled-by="[field.labelId, isRange ? `${inputId}-label-${index}` : undefined, isRange ? undefined : attrs['aria-labelledby']].filter(Boolean).join(' ')"
              :described-by="describedBy(field.describedBy)" :value-text="formatValue ? format(value) : undefined" :is-invalid="status?.type === 'error'"
              :is-disabled="isDisabled" :is-focusable="!isDisabled || showsDisabledMessage" :dragging="dragging === index" :drag-active="dragging !== null"
              :keyboard-focus="control.keyboardFocus.value === index" :extra-attrs="thumbAttrs"
              :tooltip-text="valueDisplay === 'tooltip' ? format(value) : undefined"
              @keydown="control.keydown(index, $event)" @focus="control.thumbFocus(index)" @blur="control.thumbBlur()"
            />
          </div>
        </div>
        <span v-if="valueDisplay === 'text'" class="astryx-slider-value" aria-hidden="true">{{ displayText }}</span>
      </div>
      <template v-if="isRange">
        <VisuallyHidden :id="`${inputId}-label-0`">
          {{ minName }}
        </VisuallyHidden>
        <VisuallyHidden :id="`${inputId}-label-1`">
          {{ maxName }}
        </VisuallyHidden>
      </template>
      <VisuallyHidden v-if="required" :id="`${inputId}-required`">
        {{ requiredName }}
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
