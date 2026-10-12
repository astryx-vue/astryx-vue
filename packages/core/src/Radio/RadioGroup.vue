<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { RadioChangeEvent, RadioGroupEmits, RadioGroupProps, RadioGroupSlots, RadioValue } from './types.js'
import { computed, provide, useId, useTemplateRef } from 'vue'
import Field from '../Field/Field.vue'
import Radio from './Radio.vue'
import { radioContextKey } from './types.js'
import '../../styles/radio.css'

defineOptions({ name: 'AstryxRadioGroup' })
const props = withDefaults(defineProps<Omit<RadioGroupProps, 'modelValue'>>(), {
  statusVariant: 'detached',
})
const emit = defineEmits<RadioGroupEmits>()
defineSlots<RadioGroupSlots>()
const model = defineModel<RadioValue>({ required: true })
const generatedName = `astryx-radio-${useId()}`
const groupName = computed(() => props.name ?? generatedName)
const group = useTemplateRef<HTMLDivElement>('group')
const generatedId = `astryx-radio-group-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const style = computed<CSSProperties>(() => ({ '--astryx-field-width': typeof props.width === 'number' ? `${props.width}px` : props.width }))

defineExpose({ element: group })

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
  size: computed(() => props.size),
})
</script>

<template>
  <Field
    ref="group" class="astryx-radio-group" :style="style" :data-orientation="orientation"
    :label="label" :input-id="inputId" is-group-label :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :label-icon="labelIcon" :label-tooltip="labelTooltip" :optional-label="optionalLabel" :required-label="requiredLabel"
    :status="status" :status-variant="statusVariant"
  >
    <template v-if="$slots.labelIcon" #labelIcon>
      <slot name="labelIcon" />
    </template>
    <template #default="field">
      <div class="astryx-radio-group-list" role="radiogroup" :aria-labelledby="field.labelId" :aria-describedby="field.describedBy">
        <Radio
          v-for="option in options" :key="option.value"
          :value="option.value" :label="option.label" :description="option.description"
          :is-disabled="option.isDisabled"
        />
        <slot />
      </div>
    </template>
  </Field>
</template>
