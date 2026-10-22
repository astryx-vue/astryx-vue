<script setup lang="ts">
import type { TimeInputEmits, TimeInputProps } from './types.js'
import { computed, useAttrs, useId } from 'vue'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import TimeField from './TimeField.vue'

defineOptions({ name: 'AstryxTimeInput', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<TimeInputProps, 'modelValue'>>(), {
  modelValue: null,
  hourFormat: '12h',
  hasSeconds: false,
  increment: 1,
  size: 'md',
  hasClear: false,
  statusVariant: 'attached',
})

defineEmits<TimeInputEmits>()
const model = defineModel<string | null>({ default: null })
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'TimeInput',
  props,
  attrs,
  reservedAttrs: ['id', 'value', 'type', 'disabled', 'readonly', 'min', 'max', 'placeholder', 'aria-labelledby', 'aria-describedby', 'aria-required', 'aria-busy', 'aria-disabled', 'aria-invalid', 'aria-expanded', 'aria-controls'],
})
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const generatedId = `astryx-time-input-${useId()}`
const inputId = computed(() => props.id ?? generatedId)

function inputAttrs(): Record<string, unknown> {
  return parts.forwardedAttrs()
}
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :class="parts.containerClass.value" :style="parts.containerStyle.value"
    :is-label-hidden="hideLabel" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :label-tooltip="labelTooltip" :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <TimeField
        v-model="model"
        v-bind="inputAttrs()"
        :control-class="parts.controlClass()"
        :control-style="parts.controlStyle()"
        :label="label" :input-id="inputId" :described-by="[attrs['aria-describedby'], field.describedBy].filter(Boolean).join(' ') || undefined" :labelled-by="field.labelId"
        :placeholder="placeholder" :hour-format="hourFormat" :has-seconds="hasSeconds" :increment="increment"
        :min="min" :max="max" :presentation="presentation" :native-picker="nativePicker"
        :has-clear="hasClear" :clear-label="clearLabel" :size="size"
        :is-disabled="isDisabled" :is-read-only="isReadOnly" :is-required="isRequired && !isOptional"
        :is-loading="isLoading" :loading-label="loadingLabel" :disabled-message="disabledMessage"
        :status="status"
      />
    </template>
  </Field>
</template>
