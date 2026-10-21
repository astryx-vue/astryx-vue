<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { RadioChangeEvent, RadioGroupEmits, RadioGroupProps, RadioGroupSlots, RadioValue } from './types.js'
import { computed, provide, useAttrs, useId, useTemplateRef } from 'vue'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import Radio from './Radio.vue'
import { radioContextKey } from './types.js'
import '../../styles/radio.css'

defineOptions({ name: 'AstryxRadioGroup', inheritAttrs: false })
const props = withDefaults(defineProps<Omit<RadioGroupProps, 'modelValue'>>(), {
  statusVariant: 'detached',
})
const emit = defineEmits<RadioGroupEmits>()
defineSlots<RadioGroupSlots>()
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'RadioList',
  props,
  attrs,
  reservedAttrs: ['aria-labelledby', 'aria-describedby', 'aria-invalid', 'aria-required'],
})
const model = defineModel<RadioValue>({ required: true })
const generatedName = `astryx-radio-${useId()}`
const groupName = computed(() => props.name ?? generatedName)
const group = useTemplateRef<HTMLDivElement>('group')
const generatedId = `astryx-radio-group-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const style = computed<CSSProperties>(() => ({ '--astryx-field-width': typeof props.width === 'number' ? `${props.width}px` : props.width }))
const disabledMessage = computed(() => props.disabledMessage?.trim() || undefined)
const disabledMessageId = computed(() => disabledMessage.value ? `${inputId.value}-disabled` : undefined)

defineExpose({ element: group })

function groupDescribedBy(fieldDescribed?: string): string | undefined {
  return [attrs['aria-describedby'], fieldDescribed, props.isDisabled ? disabledMessageId.value : undefined].filter(Boolean).join(' ') || undefined
}

function select(value: RadioValue, event: Event): void {
  if (props.isDisabled || props.isReadOnly)
    return
  const changeEvent: RadioChangeEvent = new CustomEvent('change', { cancelable: true, detail: { value, originalEvent: event } })
  if (event.defaultPrevented)
    changeEvent.preventDefault()
  model.value = value
  emit('change', value, changeEvent)
}

provide(radioContextKey, {
  name: groupName,
  selectedValue: model,
  select,
  isGroupDisabled: computed(() => props.isDisabled ?? false),
  isGroupReadOnly: computed(() => props.isReadOnly ?? false),
  isRequired: computed(() => (props.isRequired && !props.isOptional) ?? false),
  disabledMessage,
  disabledMessageId,
  size: computed(() => props.size),
})
</script>

<template>
  <Field
    class="astryx-radio-group" :class="[attrs.class, parts.containerClass.value]" :style="[style, attrs.style as StyleValue, parts.containerStyle.value]" :data-orientation="orientation"
    :label="label" :input-id="inputId" is-group-label :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
    :status="status" :status-variant="statusVariant"
  >
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <Tooltip :content="disabledMessage" :is-enabled="disabledMessage != null" focus-trigger="always" placement="above">
        <div ref="group" class="astryx-radio-group-list" :class="controlClass" :style="controlStyle" role="radiogroup" v-bind="parts.forwardedAttrs()" :aria-labelledby="[field.labelId, attrs['aria-labelledby']].filter(Boolean).join(' ') || undefined" :aria-describedby="groupDescribedBy(field.describedBy)">
          <Radio
            v-for="option in options" :key="option.value"
            :value="option.value" :label="option.label" :description="option.description"
            :is-disabled="option.isDisabled"
          />
          <slot />
        </div>
      </Tooltip>
      <VisuallyHidden v-if="isDisabled && disabledMessageId" :id="disabledMessageId">
        {{ disabledMessage }}
      </VisuallyHidden>
    </template>
  </Field>
</template>
