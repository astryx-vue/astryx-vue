<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { TimeInputEmits, TimeInputProps } from './types.js'
import { computed, shallowRef, useAttrs, useId } from 'vue'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { useInputGroupDisabled } from '../InputGroup/context.js'
import { useSize } from '../SizeContext/SizeContext.js'
import TimeField from './TimeField.vue'

defineOptions({ name: 'AstryxTimeInput', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<TimeInputProps, 'modelValue'>>(), {
  modelValue: null,
  hasSeconds: false,
  increment: 1,
  hasClear: false,
  statusVariant: 'attached',
})

const emit = defineEmits<TimeInputEmits>()

// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')
const disabled = useInputGroupDisabled(() => props.isDisabled)

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

/** 字段亮着的拒绝那句话。调用方的 error 说明优先；警告和成功的状态从不挡住拒绝。 */
const rejection = shallowRef<string | null>(null)
const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  const own = props.status
  if (rejection.value == null || (own?.type === 'error' && own.message))
    return own
  return { type: 'error', message: rejection.value }
})

function inputAttrs(): Record<string, unknown> {
  return parts.forwardedAttrs()
}
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :class="parts.containerClass.value" :style="parts.containerStyle.value"
    :is-label-hidden="hideLabel" :is-disabled="disabled" :is-optional="isOptional" :is-required="isRequired"
    :label-tooltip="labelTooltip" :status="fieldStatus" :status-variant="statusVariant"
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
        :is-disabled="disabled" :is-read-only="isReadOnly" :is-required="isRequired && !isOptional"
        :is-loading="isLoading" :loading-label="loadingLabel" :disabled-message="disabledMessage"
        :status="status" :entry-error-behavior="entryErrorBehavior"
        @entry-error-change="emit('entryErrorChange', $event)"
        @message-change="rejection = $event"
      />
    </template>
  </Field>
</template>
