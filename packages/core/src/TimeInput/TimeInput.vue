<script setup lang="ts">
import type { TimeInputEmits, TimeInputProps } from './types.js'
import { computed, useId } from 'vue'
import Field from '../Field/Field.vue'
import TimeField from './TimeField.vue'

defineOptions({ name: 'AstryxTimeInput' })

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
const generatedId = `astryx-time-input-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :label-tooltip="labelTooltip" :status="status" :status-variant="statusVariant"
  >
    <template #default="field">
      <TimeField
        v-model="model"
        :label="label" :input-id="inputId" :described-by="field.describedBy" :labelled-by="field.labelId"
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
